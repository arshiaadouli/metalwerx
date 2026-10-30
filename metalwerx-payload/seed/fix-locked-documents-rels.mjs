// Rebuilds payload_locked_documents_rels with a column and foreign key for
// every collection, so the dev server's schema push doesn't have to.
//
// Payload's SQLite push rebuilds that table to add a collection's column, and
// copies the new column from the old table, where it doesn't exist yet: "no
// such column: materials_id". It also left services_id without its foreign
// key. Run this with the CMS stopped, before the first `npm run dev` after
// adding a collection (add the collection's slug below):
//
//   node seed/fix-locked-documents-rels.mjs
//
// It does nothing if the table is already right. The table only holds the
// admin's edit locks, and its rows are kept.
import { readFileSync } from "node:fs";
import { DatabaseSync } from "node:sqlite";

const collections = ["users", "media", "posts", "services", "materials", "price", "messages", "message_photos", "payload_mcp_api_keys", "payload_folders"];

const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
const url = process.env.DATABASE_URL ?? env.match(/^DATABASE_URL=(.*)$/m)?.[1];
const file = url.replace(/^file:/, "");
const db = new DatabaseSync(file.startsWith("/") ? file : new URL(`../${file}`, import.meta.url).pathname);

const table = "payload_locked_documents_rels";
const keys = db.prepare(`PRAGMA foreign_key_list(${table})`).all().map((fk) => fk.from);
if (collections.every((slug) => keys.includes(`${slug}_id`))) {
  console.log(`${table} already has every collection's column.`);
  process.exit(0);
}

const columns = db.prepare(`PRAGMA table_info(${table})`).all().map((c) => c.name);
const kept = ["id", "order", "parent_id", "path", ...collections.map((slug) => `${slug}_id`)].filter((c) =>
  columns.includes(c),
);
const quote = (names) => names.map((n) => `\`${n}\``).join(", ");

db.exec("PRAGMA foreign_keys=OFF;");
db.exec("BEGIN;");
try {
  db.exec(`DROP TABLE IF EXISTS \`__new_${table}\`;`);
  db.exec(`CREATE TABLE \`__new_${table}\` (
    \`id\` integer PRIMARY KEY NOT NULL,
    \`order\` integer,
    \`parent_id\` integer NOT NULL,
    \`path\` text NOT NULL,
    ${collections.map((slug) => `\`${slug}_id\` integer`).join(",\n    ")},
    FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
    ${collections
      .map((slug) => `FOREIGN KEY (\`${slug}_id\`) REFERENCES \`${slug}\`(\`id\`) ON UPDATE no action ON DELETE cascade`)
      .join(",\n    ")}
  );`);
  db.exec(`INSERT INTO \`__new_${table}\` (${quote(kept)}) SELECT ${quote(kept)} FROM \`${table}\`;`);
  db.exec(`DROP TABLE \`${table}\`;`);
  db.exec(`ALTER TABLE \`__new_${table}\` RENAME TO \`${table}\`;`);
  for (const column of ["order", "parent_id", "path", ...collections.map((slug) => `${slug}_id`)]) {
    const name = `${table}_${column === "parent_id" ? "parent" : column}_idx`;
    db.exec(`CREATE INDEX \`${name}\` ON \`${table}\` (\`${column}\`);`);
  }
  db.exec("COMMIT;");
} catch (error) {
  db.exec("ROLLBACK;");
  throw error;
}
db.exec("PRAGMA foreign_keys=ON;");
console.log(`Rebuilt ${table} with columns for ${collections.join(", ")}.`);
