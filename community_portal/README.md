# Community Portal

This is a simple Reddit-style community portal built with plain HTML, CSS and JavaScript. Data is stored in the browser's local storage so no server-side dependencies are required. A tiny Python script (`app.py`) is included to serve the files locally.

## Features

- Register and login (data saved in browser)
- Post short messages or links
- Upvote/downvote posts
- Feed ordered by upvotes
- Responsive design thanks to Bootstrap
- Admin user (`admin`) can delete posts

## Running

```
python3 app.py
```

Then open <http://localhost:8000> in your browser.
