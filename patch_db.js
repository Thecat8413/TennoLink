import fs from 'node:fs';
import path from 'node:path';
const file = path.join(process.cwd(), 'server', 'db.js');
let code = fs.readFileSync(file, 'utf8');

// 1. Rename pin -> password in schema and auth
code = code.replace(/pin_hash TEXT NOT NULL/g, 'password_hash TEXT NOT NULL');
code = code.replace(/ALTER TABLE rooms ADD COLUMN pin TEXT;/g, 'ALTER TABLE rooms ADD COLUMN pin TEXT; try { db.exec(`ALTER TABLE player_accounts ADD COLUMN password_hash TEXT;`); } catch {}');
code = code.replace(/function hashPin\(pin\)/g, 'function hashPassword(password)');
code = code.replace(/hashPin\(/g, 'hashPassword(');
code = code.replace(/pin_hash/g, 'password_hash');
code = code.replace(/pin/g, 'password'); // wait, this might break "pin" in rooms. Let's be careful.
fs.writeFileSync(file, code);
