import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import mongoose from "mongoose";
import { migrateLegacyPasswords, migrationCounts } from "../server/security/legacy-password-migration.mjs";

export function parseMigrationArguments(args) {
  let database;
  let mode;
  for (let index = 0; index < args.length; index++) {
    const argument = args[index];
    if (argument === "--database" && !database) database = args[++index];
    else if (["--dry-run", "--apply"].includes(argument) && !mode) mode = argument;
    else throw new Error("Invalid migration arguments.");
  }
  if (!database || !/^[a-zA-Z0-9_][a-zA-Z0-9_-]{0,62}$/.test(database)) {
    throw new Error("An explicit database name is required.");
  }
  return { database, apply: mode === "--apply" };
}

export async function runMigrationCLI(args, env = process.env) {
  let connection;
  let counts = migrationCounts();
  let apply = false;
  try {
    const options = parseMigrationArguments(args);
    apply = options.apply;
    if (!env.MONGO_URI?.trim()) throw new Error("MONGO_URI is required.");
    // Never auto-load .env or silently use the default/test database from a URI.
    connection = mongoose.createConnection(env.MONGO_URI, {
      dbName: options.database,
      autoIndex: false,
      autoCreate: false,
      maxPoolSize: 2,
      serverSelectionTimeoutMS: 10_000,
    });
    await connection.asPromise();
    counts = await migrateLegacyPasswords(connection.collection("users"), { apply });
  } catch {
    counts.failed++;
  } finally {
    try { await connection?.close(); } catch { counts.failed++; }
  }
  const exitCode = counts.failed || counts.skipped || counts.conflicts || (apply && counts.remaining) ? 1 : 0;
  return { counts, exitCode };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { counts, exitCode } = await runMigrationCLI(process.argv.slice(2));
  console.log(JSON.stringify(counts));
  process.exitCode = exitCode;
}
