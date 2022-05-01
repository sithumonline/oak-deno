import { query } from "../config/db.js";

export const createBookTable = async () => {
  const sql = `
    SELECT gen_random_uuid();
    CREATE TABLE IF NOT EXISTS book (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT,
      author TEXT,
      description TEXT,
      updated_date TEXT
    );
  `;
  try {
    const result = await query(sql);
    console.log(result.rows);
  } catch (error) {
    console.log(error);
  }
};
