// Writes store/js/env.js (gitignored) with the Supabase URL and anon key, from .env or the environment.
// Run before serving the store locally; the deploy runs it with the repo's secrets. No keys = demo mode.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const root = new URL('../', import.meta.url);
const file = new URL('.env', root);
const vars = Object.assign({}, process.env);
if (existsSync(file)) {
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) vars[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
}
const url = vars.SUPABASE_URL || '';
const key = vars.SUPABASE_ANON_KEY || '';

// The page is public, so only the anon/publishable key may go in it, never the service_role/secret key
let role = '';
try { role = JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role; } catch (e) { /* not a JWT */ }
if (role === 'service_role' || key.startsWith('sb_secret_')) {
  console.error('SUPABASE_ANON_KEY is a secret key. Use the anon (publishable) key.');
  process.exit(1);
}

writeFileSync(new URL('store/js/env.js', root), `window.PS_ENV = ${JSON.stringify({ supabaseUrl: url, supabaseAnonKey: key })};\n`);
console.log(url && key ? `store/js/env.js: Supabase at ${url}` : 'store/js/env.js: no keys, demo mode');
