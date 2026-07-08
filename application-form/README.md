# VLAA Lab — Application form (Apps Script web app)

This is the source for the lab's application form embedded on `opening.html`.

It replaces the old **"Forms Studio"** script, which stopped working when Google
retired the legacy **Rhino** runtime (the old embed now returns HTTP 403). This
version runs on the current **V8** runtime and keeps all the behavior we relied on:

- **No Google login required** — anyone can fill it out and upload a PDF.
- **Instant email** to the lab the moment someone submits.
- The applicant's **uploaded PDF arrives as a real email attachment** (not just a link).
- Optional: every PDF is also **archived to a Drive folder** as a backup.

Files: [`Code.gs`](Code.gs) (server) and [`Index.html`](Index.html) (the form UI).

---

## One-time setup

1. Go to **https://script.google.com** → **New project**.
2. Paste [`Code.gs`](Code.gs) into the default `Code.gs` file.
3. Click **+** next to *Files* → **HTML** → name it exactly **`Index`** → paste
   [`Index.html`](Index.html) into it.
4. Edit the **CONFIG** block at the top of `Code.gs`:
   - `RECIPIENTS` — who gets notified (default: `cihangxie306@gmail.com`).
   - `DRIVE_FOLDER_ID` *(recommended)* — make a folder in Google Drive, open it,
     and copy the ID from the URL (`drive.google.com/drive/folders/THIS_PART`).
     Paste it here so every submission is also saved to Drive as a backup.
5. **Save** (💾).

## Deploy (this is what makes it public + no-login)

6. **Deploy** → **New deployment** → gear icon → **Web app**.
7. Set:
   - **Description:** `VLAA application form`
   - **Execute as:** **Me** (your account) ← the script emails/saves as *you*
   - **Who has access:** **Anyone** ← this is the setting that lets applicants
     submit **without logging in**. (Not "Anyone with Google account".)
8. **Deploy** → authorize when asked. On a personal Gmail you'll hit an
   "unverified app" screen → **Advanced** → **Go to project (unsafe)** → **Allow**.
   (This only grants Gmail + Drive access to *your own* account.)
9. Copy the **Web app URL** — it ends in **`/exec`**.

## Test

10. Open that `/exec` URL in an **incognito window** (so you're logged out),
    submit a test with a small PDF, and confirm the email lands in your inbox
    **with the PDF attached**.

## Put it on the site

11. Send Claude the `/exec` URL. The dead iframe in `opening.html` gets replaced with:

    ```html
    <style>.forms-studio{position:relative;width:100%;height:1700px;}
    .forms-studio iframe{width:100%;height:100%;border:0;}</style>
    <div class='forms-studio'>
      <iframe src='PASTE_YOUR_EXEC_URL_HERE'></iframe>
    </div>
    ```

---

## Updating the form later

Editing `Code.gs` / `Index.html` in the Apps Script editor is **not** live until you
redeploy: **Deploy → Manage deployments → (edit ✏️) → Version: New version → Deploy**.
The `/exec` URL stays the same, so nothing on the website needs to change.

## Notes / limits

- Gmail caps a single message at ~25 MB, so PDFs are attached up to `MAX_ATTACH_MB`
  (24 MB); anything larger falls back to the Drive link (set `DRIVE_FOLDER_ID`).
- Sending limit is ~100 emails/day on a personal Gmail account — plenty for hiring.
- Uploaded files count against the owner account's Drive storage (15 GB free).
