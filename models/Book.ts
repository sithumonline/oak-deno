// const mongoose = require('mongoose');
import { Bson } from "https://deno.land/x/mongo@v0.29.1/mod.ts";
import { connectDB } from "../config/db.js";

interface BookSchema {
  _id: Bson.ObjectId;
  title: string;
  author: String;
  description: String;
  updated_date: Date;
}

const client = await connectDB();

const db = client.database("T");
export const Book = db.collection<BookSchema>("book");
