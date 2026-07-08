/**
 * VLAA Lab - Application form web app
 * -----------------------------------
 * Replaces the retired "Forms Studio" script (which broke when Google shut
 * down the old Rhino runtime). This runs on the modern V8 runtime.
 *
 * What it does, matching the old behavior:
 *   - Serves a public application form - NO Google login required to submit.
 *   - The instant someone submits, emails the lab with all the answers.
 *   - Attaches the applicant's uploaded PDF as a REAL email attachment
 *     (not just a Drive link).
 *   - Optionally files a copy of every PDF into a Drive folder for your records.
 *
 * Deploy: see README.md.  Deploy as Web app -> Execute as: Me -> Who has access: Anyone.
 */

// ============ CONFIG - edit these ============
const RECIPIENTS      = 'cihangxie306@gmail.com';  // who gets notified (comma-separate for several)
const SUBJECT_TAG     = '[VLAA Application]';       // email subject prefix
const DRIVE_FOLDER_ID = '';                         // OPTIONAL: paste a Drive folder ID to archive every PDF.
                                                    //   Recommended - it's a durable backup if an email ever fails.
                                                    //   Leave '' to skip archiving.
const MAX_ATTACH_MB   = 24;                         // attach inline if <= this; larger -> Drive link (Gmail caps ~25 MB)
const SEND_APPLICANT_CONFIRMATION = false;          // true -> also email the applicant a "we received it" receipt
// =============================================

/** Serves the form. ALLOWALL lets it be embedded in the lab site's <iframe>. */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
      .setTitle('VLAA Lab - Application')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Called from the client via google.script.run.
 * `form` is the HTML form: text fields arrive as strings, the file input as a Blob.
 */
function processForm(form) {
  try {
    const name     = (form.name     || '').toString().trim();
    const email    = (form.email    || '').toString().trim();
    const position = (form.position || '').toString().trim();
    const links    = (form.links    || '').toString().trim();
    const message  = (form.message  || '').toString().trim();

    if (!name || !email) {
      return { ok: false, error: 'Please provide your name and email.' };
    }

    // File input -> Blob when a form is passed to google.script.run.
    const blob = form.cvFile;
    const hasFile = blob && blob.getBytes && blob.getBytes().length > 0;

    const attachments = [];
    let driveLink = '';

    if (hasFile) {
      const safeName = name.replace(/[^\w.\- ]+/g, '_');
      const original = blob.getName() || 'upload.pdf';
      blob.setName(safeName + ' - ' + original);

      // Archive a durable copy (recommended).
      if (DRIVE_FOLDER_ID) {
        const file = DriveApp.getFolderById(DRIVE_FOLDER_ID).createFile(blob);
        driveLink = file.getUrl();
      }

      const sizeMB = blob.getBytes().length / (1024 * 1024);
      if (sizeMB <= MAX_ATTACH_MB) {
        attachments.push(blob);            // real attachment
      }
      // else: too big to attach - the email carries the Drive link instead (if archived).
    }

    // Build the notification email.
    const rows = [
      ['Name', name], ['Email', email], ['Position', position],
      ['Links', links], ['Message', message],
    ];
    let html = '<h2>New application</h2>' +
               '<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif">';
    rows.forEach(function (r) {
      if (r[1]) {
        html += '<tr><td style="border:1px solid #ddd"><b>' + r[0] + '</b></td>' +
                '<td style="border:1px solid #ddd">' + escapeHtml(r[1]).replace(/\n/g, '<br>') +
                '</td></tr>';
      }
    });
    html += '</table>';

    if (hasFile && attachments.length === 0 && driveLink) {
      html += '<p><b>CV/PDF (too large to attach):</b> <a href="' + driveLink + '">' + driveLink + '</a></p>';
    } else if (driveLink) {
      html += '<p><b>CV/PDF also archived at:</b> <a href="' + driveLink + '">Drive copy</a></p>';
    } else if (!hasFile) {
      html += '<p><i>No file was uploaded.</i></p>';
    }

    MailApp.sendEmail({
      to: RECIPIENTS,
      subject: SUBJECT_TAG + ' ' + name + (position ? ' - ' + position : ''),
      htmlBody: html,
      attachments: attachments,
      name: 'VLAA Application Form',
      replyTo: email,                      // hit Reply -> goes straight to the applicant
    });

    if (SEND_APPLICANT_CONFIRMATION) {
      MailApp.sendEmail({
        to: email,
        subject: 'We received your application - VLAA Lab',
        htmlBody: 'Hi ' + escapeHtml(name) + ',<br><br>Thanks for your interest in the VLAA Lab. ' +
                  'We received your application and will be in touch.<br><br>- VLAA Lab',
        name: 'VLAA Lab',
      });
    }

    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err && err.message) ? err.message : String(err) };
  }
}

function escapeHtml(s) {
  return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
}
