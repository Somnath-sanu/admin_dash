# DummyJSON Product Dashboard

A small protected admin dashboard built with Next.js, TypeScript, Axios, and the [DummyJSON API](https://dummyjson.com).

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000` and log in with:

- Username: `emilys`
- Password: `emilyspass`

## Features

- JWT login/logout and protected product routes.
- Responsive product table/cards with API pagination.
- URL-based `page`, `limit`, `q`, `category`, `sortBy`, and `order` values.
- Debounced search, category filter, and title/price/rating sorting.
- Product details, reviews, add/edit forms, and delete confirmation.
- Loading, empty, error, and retry states.

## Implementation notes

All remote calls use the shared Axios client in `lib/api/client.ts`; it adds the stored access token and converts API failures into one error shape.

DummyJSON does not support search and category filtering together. The dashboard makes them mutually exclusive: searching clears/disables the category, and selecting a category clears search. This keeps API pagination totals accurate.

DummyJSON simulates add, edit, and delete responses but does not persist them. After a successful mutation, the app immediately shows the mock API response or deletion confirmation. Refreshing reloads the original API data.
