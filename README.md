# FRAME Cinema

FRAME is a small React cinema website for browsing films, saving favorites, and making demo ticket reservations.

## Run the project

Install the packages and start the local development server:

```sh
npm install
npm run dev
```

Vite prints a local address to open in your browser. To check the code or make a production build, run `npm run lint` or `npm run build`.

## How the app is organized

- `src/App.jsx` contains the movie list, reusable movie card, page sections, and interactive dialogs.
- `src/App.css` contains the page layout, responsive rules, and animations.
- `src/index.css` contains shared colors, fonts, and basic page styles.
- `public/favicon.svg` is the small FRAME icon shown in the browser tab.

## How the main features work

- The movie list is a JavaScript array near the top of `src/App.jsx`. Each film has a title, genre, description, rating, and poster image URL.
- React state keeps track of the search text, selected genre, favorites, and which details or booking dialog is open.
- The movie list is filtered from the search text, genre, and favorites list before the cards are displayed.
- Favorites and reservations are saved in the browser with `localStorage`, so they remain after a refresh on the same browser.
- A reservation stores the film, date, showtime, and ticket count. This is a front-end demonstration only; it does not contact a cinema or take payment.

The poster and featured images load from Unsplash, so an internet connection is needed to see those images. The project uses plain React and CSS without additional UI packages.
