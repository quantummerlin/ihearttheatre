---
name: form-handler-wire
description: Wire new submission forms on iHeartTheatre.com to the canonical handler. Use when building a new form page or adding a contact widget. Follows the shared.js submitFormViaEmail pattern with IHT_FORMSPREE config, data-form-kind attributes, and mailto fallback. DO NOT create backend endpoints or console-only logging.
---

# form-handler-wire

iHeartTheatre runs on GitHub Pages — no backend. All forms go through ONE canonical handler: `submitFormViaEmail(source, opts)` in `js/shared.js`, which POSTs to Formspree when configured and falls back to the styled email modal otherwise.

## Steps for a new form

1. Build the form markup: `<form id="myForm" data-form-kind="{kind}">` where kind ∈ show|review|actor|service|holiday|contact (see `window.IHT_FORMSPREE` in `js/shared.js`). Add `name` attributes to every field — labels are derived from field `id` labels automatically.
2. Submit handler (end of page):
   ```js
   document.getElementById('myForm').addEventListener('submit', function(e) {
     e.preventDefault();
     submitFormViaEmail(this, {
       to: 'hello@ihearttheatre.com',
       subject: 'My Form: ' + this.someField.value,
       formId: 'submit-show' // maps to IHT_FORMSPREE key via form-kind
     });
   });
   ```
3. Ensure the page loads `js/shared.js` (deferred) — it overrides the main.js adapter automatically.
4. Optional: add a `data-formspree` attribute on the form to hardcode a specific Formspree form ID.

## Configuring a real Formspree form
Create the form at https://formspree.io (free tier), then paste its ID into `window.IHT_FORMSPREE` in `js/shared.js` (one key per submission type). Until an ID is present, the email-modal fallback handles submissions — never log submissions to console only.

## Hard rules
- No third-party scripts beyond Formspree endpoints.
- Always validate required fields with native form validation (the canonical handler calls `checkValidity()`/`reportValidity()`).
- Never use mailto-only (no modal) patterns — the modal with copy-to-clipboard is mandatory UX.
