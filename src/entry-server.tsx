import { renderToString } from 'react-dom/server';
import App from './App';

// Build-time only. scripts/prerender.mjs calls this after `vite build` to bake
// static HTML into dist/index.html so crawlers, ATS parsers, and link unfurlers
// (Slack/LinkedIn/Google) see real content instead of an empty <div id="root">.
// The browser bundle still fully renders the app on load (see main.tsx); the
// prerendered markup is purely a no-JS / pre-JS fallback.
export function render(): string {
  return renderToString(<App />);
}
