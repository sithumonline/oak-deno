import { Pool } from "https://deno.land/x/postgres@v0.15.0/mod.ts";

const databaseUrl = Deno.env.get("DATABASE_URL");

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool(databaseUrl, 3, true);

export const query = async (query) => {
  const client = await pool.connect();
  const result = await client.queryObject(query);
  client.release();
  return result;
};
