import fs from 'fs';
import path from 'path';

// read the db to see if there is an account
const DB_PATH = path.join('/Volumes/DevRepos/warframe-helper/data', 'warframe.db');
import DatabaseSync from 'node:sqlite';
const db = new DatabaseSync.DatabaseSync(DB_PATH);
const accounts = db.prepare('SELECT * FROM player_accounts LIMIT 1').all();
console.log('Accounts:', accounts);

if (accounts.length > 0) {
    const token = accounts[0].sync_token;
    const name = accounts[0].player_name;
    const res = await fetch(`http://127.0.0.1:3000/api/squad/VOL/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ playerName: name })
    });
    const data = await res.json();
    console.log('POST /join response:', res.status, data);
}
