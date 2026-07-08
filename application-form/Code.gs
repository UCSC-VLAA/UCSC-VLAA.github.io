/**
 * VLAA Lab - Application form web app  (V8 runtime)
 * -------------------------------------------------
 * Replaces the retired "Forms Studio" script (broke when Google shut down the
 * old Rhino runtime). Public, no-login submissions.
 *
 * On every submission it:
 *   - logs a row to a Google Sheet  ("VLAA Applications") so you can see every
 *     applicant in one table, sort/filter, and open each CV;
 *   - archives the uploaded PDF into a Drive folder ("VLAA Application PDFs");
 *   - emails the lab instantly with the applicant's PDF as a REAL attachment.
 *
 * The Sheet and Folder are created automatically on first run and their IDs are
 * remembered in Script Properties - you never copy an ID by hand. Run setup()
 * once to create them immediately and get emailed the links.
 *
 * Deploy: Web app -> Execute as: Me -> Who has access: Anyone.
 */

// ============ CONFIG - edit these ============
const RECIPIENTS      = 'cihangxie306@gmail.com';  // who gets notified (comma-separate for several)
const SUBJECT_TAG     = '[VLAA Application]';       // email subject prefix
const MAX_ATTACH_MB   = 24;                         // attach inline if <= this; larger -> link only (Gmail caps ~25 MB)
const SEND_APPLICANT_CONFIRMATION = false;          // true -> also email the applicant a "we received it" receipt
// Optional: to reuse an EXISTING sheet/folder, paste their IDs here. Leave ''
// to auto-create and remember (recommended).
const SHEET_ID_OVERRIDE  = '';
const FOLDER_ID_OVERRIDE = '';
// =============================================

const HEADERS = ['Timestamp', 'Name', 'Email', 'Position', 'Links', 'Message', 'CV (PDF)'];

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

      // Always archive a durable copy in Drive; the Sheet links to it.
      const file = getFolder_().createFile(blob);
      driveLink = file.getUrl();

      const sizeMB = blob.getBytes().length / (1024 * 1024);
      if (sizeMB <= MAX_ATTACH_MB) {
        attachments.push(blob);            // real email attachment
      }
      // else: too big to attach - recipient uses the Drive link.
    }

    // 1) Log a row to the tracking spreadsheet.
    getSheet_().appendRow([new Date(), name, email, position, links, message, driveLink || '(no file)']);

    // 2) Build + send the notification email.
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
    if (driveLink) {
      html += '<p><b>CV/PDF:</b> <a href="' + driveLink + '">' + driveLink + '</a>' +
              (attachments.length ? ' (also attached)' : ' (too large to attach)') + '</p>';
    } else {
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

/** Run this once (Run button) to create the sheet + folder now and email yourself the links. */
function setup() {
  const sheet = getSheet_();
  const folder = getFolder_();
  const sheetUrl = sheet.getParent().getUrl();
  const folderUrl = folder.getUrl();
  MailApp.sendEmail({
    to: RECIPIENTS,
    subject: SUBJECT_TAG + ' Tracking sheet & PDF folder are ready',
    htmlBody: 'Applicants spreadsheet: <a href="' + sheetUrl + '">' + sheetUrl + '</a><br>' +
              'PDF archive folder: <a href="' + folderUrl + '">' + folderUrl + '</a>',
    name: 'VLAA Application Form',
  });
  Logger.log('SHEET_URL: ' + sheetUrl);
  Logger.log('FOLDER_URL: ' + folderUrl);
  return sheetUrl;
}

/** The applicants spreadsheet's first sheet (creates it once and remembers the ID). */
function getSheet_() {
  const props = PropertiesService.getScriptProperties();
  let id = SHEET_ID_OVERRIDE || props.getProperty('LOG_SHEET_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id).getSheets()[0]; } catch (e) { /* fall through, recreate */ }
  }
  const ss = SpreadsheetApp.create('VLAA Applications');
  const sh = ss.getSheets()[0];
  sh.appendRow(HEADERS);
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  props.setProperty('LOG_SHEET_ID', ss.getId());
  return sh;
}

/** The PDF archive folder (creates it once and remembers the ID). */
function getFolder_() {
  const props = PropertiesService.getScriptProperties();
  let id = FOLDER_ID_OVERRIDE || props.getProperty('PDF_FOLDER_ID');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (e) { /* fall through, recreate */ }
  }
  const f = DriveApp.createFolder('VLAA Application PDFs');
  props.setProperty('PDF_FOLDER_ID', f.getId());
  return f;
}

function escapeHtml(s) {
  return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
}
