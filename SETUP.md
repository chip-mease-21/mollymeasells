# mollymeasells.com — Setup Guide

Everything is built. This walks you through getting it live and getting Molly
publishing on her own. Budget about 45 minutes start to finish.

---

## What you're setting up

| Piece | What it does | Cost |
|---|---|---|
| GitHub repo | Holds the site files | Free |
| Netlify | Hosts the site, handles the login for Molly's editor | Free |
| Cloudflare | Points mollymeasells.com at Netlify | ~$12/yr for the domain |
| Substack | Molly's email newsletter | Free |

---

## Step 1 — Register the domain

Buy **mollymeasells.com** through Cloudflare (Domain Registration → Register).
Cloudflare sells at cost with no renewal markup.

---

## Step 2 — Put the site on GitHub

1. Create a new repository named `mollymeasells`. Keep it **public** or private, either works.
2. Upload every file and folder from this package into it. Keep the structure exactly as-is.
3. Make sure the default branch is named `main`.

The structure should look like:

```
index.html
story.html
journey.html
photos.html
support.html
netlify.toml
_redirects
admin/
  index.html
  config.yml
assets/
  css/style.css
  js/main.js
  img/molly.jpg
content/
  site.json
  notes.json
  gallery.json
```

---

## Step 3 — Deploy on Netlify

1. Netlify → **Add new site** → **Import an existing project** → GitHub → pick `mollymeasells`.
2. Leave the build command **blank**. Publish directory is `.`
3. Deploy. You'll get a temporary URL like `random-name.netlify.app`. Check that it works.

---

## Step 4 — Connect the domain

1. In Netlify: **Domain management** → **Add a domain** → `mollymeasells.com`
2. Netlify gives you DNS records. In Cloudflare DNS, add them.
3. Set the Cloudflare records to **DNS only** (grey cloud, not orange) so Netlify can issue the SSL certificate.
4. Wait for HTTPS to go green in Netlify. Usually minutes, sometimes an hour.

---

## Step 5 — Turn on Molly's editor

This is the part that lets her publish without touching code.

1. Netlify → your site → **Integrations** (or **Identity** on older dashboards) → enable **Netlify Identity**.
2. Identity → **Registration** → set to **Invite only**. Important, or anyone can sign up.
3. Identity → **Services** → **Git Gateway** → **Enable Git Gateway**.
4. Identity → **Invite users** → enter Molly's email. She gets an email, sets a password, done.
5. Invite yourself too so you can help her.

Then add this one line to every page, right before `</body>`. It handles the login redirect:

```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

Molly logs in at **mollymeasells.com/admin**

---

## Step 6 — Set up Substack

1. Go to substack.com, create a publication.
2. Suggested name: **Letters from Molly** or **Sent**.
3. Grab the URL. It'll be something like `mollymeasells.substack.com`.
4. Log into `/admin` → **Site Settings** → paste it into the Substack field → Save.

Every Substack link on the site updates automatically. Same for the giving link
and the contact email.

---

## What Molly can do at /admin

**Site Settings**
Update the amount raised. The water level on the home page rises to match.
Also holds the giving link, Substack link, and contact email.

**Field Notes**
Short updates. Date, title, a few sentences. They appear on the Home and Journey
pages, newest first. Save the long stories for Substack.

**Photos**
Upload a photo, add a caption, save. It shows up on the Photos page.

She clicks **Publish** and the site rebuilds itself in about a minute.

---

## Keeping the money number current

The fundraising total is manual on purpose. GiveSendGo doesn't offer a feed that
a static site can read. Once a week, check GiveSendGo, then update the number in
Site Settings. Takes thirty seconds.

---

## Contact email

The site currently points to `hello@mollymeasells.com`. You have two options:

- Set up email forwarding in Cloudflare (free, five minutes) so it lands in her real inbox
- Or change it in Site Settings to whatever address she actually wants to use

---

## If something breaks

- **Site won't build** — check the Netlify deploy log. Usually a file in the wrong folder.
- **Molly can't log in** — Identity is probably not enabled, or she wasn't invited.
- **Editor saves but nothing changes** — Git Gateway isn't enabled.
- **Images don't show** — check that `assets/uploads/` exists in the repo after her first upload.
