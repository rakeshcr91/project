# Community Portal

This directory contains a small Reddit-style community site powered by Flask and SQLite.
It provides user registration, login, posting messages, voting and a minimal admin
interface.

## Features

- Register/login with hashed passwords
- Post messages or links
- Upvote/downvote posts (one vote per user)
- Feed ordered by score
- Admin user (`admin`) can delete posts
- Responsive layout using Bootswatch (Lux), Bulma, Foundation and Tailwind for a rich UI
- Vote buttons update instantly thanks to a small JavaScript helper
- Posts feed rendered with a lightweight React component
- Dedicated admin dashboard at `/admin` to remove posts
  (accessible from the navbar when logged in as `admin`)

## Running

Install the requirements (ideally in a virtual environment):

```bash
pip install -r requirements.txt
```

Start the development server:

```bash
python app.py
```

Open <http://localhost:5000> in your browser.
