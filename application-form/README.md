# VLAA Lab — Application form (Apps Script web app)

Source for the lab's application form embedded on `opening.html`.

It replaces the old **"Forms Studio"** script, which stopped working when Google
retired the legacy **Rhino** runtime (the old embed returned HTTP 403). This
version runs on the current **V8** runtime and:

- **No Google login required** — anyone can fill it out and upload a PDF.
- **Instant email** to the lab the moment someone submits, with the applicant's
  **uploaded PDF as a real email attachment** (not just a link).
- **Logs every submission to a Google Sheet** ("VLAA Applications") — one row per
  applicant (Timestamp, Name, Email, Current Institution, Position, Interested PI,
  Links, Message, CV link) so you can see everyone in one table, sort/filter, and
  open each CV. "Interested PI" is a multi-select (Cihang Xie / Yuyin Zhou / both).
- **Archives every PDF** to a Drive folder ("VLAA Application PDFs").

Files: [`Code.gs`](Code.gs) (server) and [`Index.html`](Index.html) (form UI).

## Current deployment

- Live web app owned by **cihangxie306@gmail.com** (personal Gmail, so anonymous
  access is allowed). Deployed as **Execute as: Me**, **Who has access: Anyone**.
- The `/exec` URL is embedded in [`../opening.html`](../opening.html).
- The tracking Sheet and PDF folder are auto-created in that account's Drive; their
  IDs are stored in the script's Script Properties (no manual ID copying).

---

## Recreating it from scratch (reference)

1. **https://script.google.com** → **New project**. Paste [`Code.gs`](Code.gs) into `Code.gs`.
2. **+** next to *Files* → **HTML** → name it exactly **`Index`** → paste [`Index.html`](Index.html).
3. Edit the **CONFIG** block at the top of `Code.gs` (at minimum `RECIPIENTS`).
   The Sheet + folder auto-create on first run; leave `SHEET_ID_OVERRIDE` /
   `FOLDER_ID_OVERRIDE` blank unless you want to reuse existing ones.
4. **Save**. Optionally select `setup` in the function dropdown and **Run** once —
   this creates the Sheet + folder immediately and emails you both links.
5. **Deploy → New deployment → gear → Web app**: **Execute as: Me**,
   **Who has access: Anyone** (NOT "Anyone with Google account" — that forces login).
6. Authorize (personal Gmail shows an "unverified app" screen → **Advanced** →
   **Go to … (unsafe)** → **Allow**). Copy the **`/exec`** Web app URL into `opening.html`.

## Updating the form later  (IMPORTANT)

Editing `Code.gs` / `Index.html` is **not live** until you redeploy:
**Deploy → Manage deployments → (edit ✏️) → Version: New version → Deploy**.
The `/exec` URL stays the same, so the website never needs changing.
If you add code that uses a new Google service, Google will ask you to re-authorize.

## Notes / limits

- Gmail caps a message at ~25 MB, so PDFs are attached up to `MAX_ATTACH_MB` (24 MB);
  anything larger goes as the Drive link (the file is always archived to Drive regardless).
- Sending limit ~100 emails/day on a personal Gmail account — plenty for hiring.
- Uploaded files count against the owner account's Drive storage (15 GB free).
- Keep these source files **pure ASCII** — pasting non-ASCII (em-dashes, emoji) into
  the Apps Script editor via clipboard corrupts them into mojibake.
