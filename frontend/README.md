# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# React Frontend for Persona Story Generator

## Local Development

1. **Start the Flask backend:**
   ```bash
   cd ../backend
   python app.py
   ```
   (or use `flask run` if you prefer)

2. **Start the Vite frontend:**
   ```bash
   npm run dev
   ```
   This will run the app at [http://localhost:5173](http://localhost:5173)

3. **API Proxying:**
   The Vite dev server proxies API requests (`/auth`, `/story`, `/facebook`) to the Flask backend at `http://localhost:5000` for seamless integration.

4. **Hot Reloading:**
   - Any changes to your React components or CSS will instantly update in the browser.
   - Flask will auto-reload on backend code changes if you run with `FLASK_ENV=development`.

5. **Debugging:**
   - Use browser DevTools for inspecting network requests and React component state.
   - Install [React Developer Tools](https://react.dev/learn/react-developer-tools) for advanced React debugging.
   - Use `console.log` in your components for quick debugging.

6. **Styling:**
   - Tailwind CSS is fully integrated. Use utility classes and the custom `midnight` palette for rapid styling.
   - The app defaults to dark mode for a Midnight IDE look.

7. **Tips:**
   - If you change the backend port, update the proxy in `vite.config.js`.
   - If you add new API endpoints, add them to the proxy config if needed.

## Features
- Login/logout
- Generate new persona story
- Review and post to Facebook
- View story history
- Modern dark theme (Midnight IDE inspired)
- Hot reloading and full local development experience
