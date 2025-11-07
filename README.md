# Shayonika — Photography & Video (Portfolio)

This repository contains the static portfolio website for Shayonika — a photographer and video editor. The site is a single-page HTML portfolio located at `index.html` and includes sections for Portfolio, Awards, Videos, About, Services and Contact.

Quick overview
- Main file: `index.html` — the whole site is self-contained (HTML + internal CSS).
- Images used for the Awards section are in `Logo Competition Award/`.
- Videos are embedded from Google Drive (see the `videos.txt` file for source links).

Preview locally
1. From the repository root, run a simple static server (Python):

```bash
cd /path/to/shayonika
python3 -m http.server 8000
# then open http://localhost:8000 in your browser
```

Notes about large media and git history
- Previously this repo contained large video files that exceeded GitHub's 100 MB limit. Those files were purged from history to keep the repository small and pushable.
- Git LFS was used temporarily during remediation but has been removed from the repository. If you need to reintroduce large media files, consider using Git LFS or an external host (YouTube, Vimeo, S3/Cloudinary) and link/embed those assets instead.

How the Videos section works
- The Videos section embeds Google Drive preview iframes. For these to work, each Drive file must be shared as "Anyone with the link can view." Drive is used as a lightweight host for previews; for production you may want a proper streaming host.

Contributing / workflow notes
- If you pull after a history rewrite (force-push) you may need to reset your local branches. To align with the remote after the purge, use:

```bash
# WARNING: this will discard local commits that diverge from origin/main
git fetch origin
git reset --hard origin/main
```

- Keep assets small inside the repo. For large deliverables, use releases or an external hosting solution.

License & contact
- This repo contains portfolio content owned by Shayonika. For updates or questions, contact the project owner via the contact section on the site.

---
Generated/updated on 2025-11-07

