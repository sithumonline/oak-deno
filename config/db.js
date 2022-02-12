import { MongoClient } from "https://deno.land/x/mongo@v0.29.1/mod.ts";
import "https://deno.land/x/dotenv@v3.2.0/load.ts";

export const connectDB = async () => {
  const mongoose = new MongoClient();
  await mongoose.connect(Deno.env.get("MONGODB_URI")).catch((err) => {
    console.log(err);
  });

  return mongoose;
};
