# Requirements — Ensure_vercel_deploy

## R1

A `vercel.json` file SHALL exist at the project root with valid JSON syntax.

## R2

The `vercel.json` file SHALL define a `build` key containing a `command` property that runs `npm run build`.

## R3

The `vercel.json` file SHALL define a `build` key containing an `outputDirectory` property that matches the Vite `outDir` (`build`).

## R4

WHEN a request is made to a non-root path (e.g., `/login`, `/room`), Vercel SHALL serve `/index.html` instead of returning a 404, to support SPA client-side routing.

## R5

WHEN a request is made to any static asset (images, fonts, scripts, manifest), Vercel SHALL serve the correct file from the build output without rewriting to `/index.html`.

## R6

WHEN `npm run build` is executed, Vercel SHALL produce a successful build (exit code 0) with no TypeScript errors.

## R7

WHEN Vite builds the project, the output directory (`build/`) SHALL contain an `index.html` file, a JavaScript bundle, and a CSS bundle.

## R8

The `ARCHITECTURE.md` file SHALL include a **Vercel Deployment** section documenting the `vercel.json` configuration, required environment variables, and the build process on Vercel.

## R9

The `ARCHITECTURE.md` file SHALL document every environment variable from `.env` that must be configured in the Vercel project dashboard, including `VITE_REACT_APP_BASEURL`, `VITE_REACT_APP_ADMIN`, `VITE_REACT_APP_AUTH_P`, `VITE_REACT_APP_P_KEY`, `VITE_REACT_APP_JOIN_ROOM`, `VITE_REACT_APP_CONFIRM_EMAIL_URL`, `VITE_REACT_APP_JOIN_ROOM_PATH`, `VITE_REACT_APP_CLIENT_ID`, `VITE_REACT_APP_REQUESTS_URL`, and `VITE_REACT_APP_REQUESTS_BASE_URL`.

## R10

WHEN the application is deployed on Vercel and a user navigates to any route, all images, logos, and assets SHALL load without 404 errors.

## R11

WHEN `npm test` is run in the repository root, all existing tests SHALL pass (exit code 0).

## R12

IF the `vercel.json` file contains invalid JSON syntax, THEN `npm test` SHALL detect the error and fail with a non-zero exit code.

## R13

WHEN the project is built with `vite build`, the build output SHALL contain a `manifest.webmanifest` file for PWA support.
