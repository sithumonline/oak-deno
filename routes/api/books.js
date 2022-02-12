import { Router } from "https://deno.land/x/oak/mod.ts";
import { Bson } from "https://deno.land/x/mongo@v0.29.1/mod.ts";
export const bookRouter = new Router();
// Load Book model
import { Book } from "../../models/Book.ts";

// @route GET api/books/test
// @description tests books route
// @access Public
bookRouter.get("/test", (ctx) => {
  ctx.response.body = "book route testing!";
});

// @route GET api/books
// @description Get all books
// @access Public
bookRouter.get("/", async (ctx) => {
  const data = await Book.find({}).toArray();
  ctx.response.body = { msg: data ? data : "No Books found" };
  ctx.response.status = data ? 200 : 404;
});

// @route GET api/books/:id
// @description Get single book by id
// @access Public
bookRouter.get("/:id", async (ctx) => {
  const id = new Bson.ObjectId(ctx.params.id);
  const data = await Book.findOne({ _id: id });
  ctx.response.body = { msg: data ? data : "No Book found" };
  ctx.response.status = data ? 200 : 404;
});

// @route GET api/books
// @description add/save book
// @access Public
bookRouter.post("/", async (ctx) => {
  if (ctx.request.hasBody) {
    const body = await ctx.request.body();
    const data = await body.value;
    const out = await Book.insertOne(data);
    ctx.response.status = 201;
    ctx.response.body = { msg: out ? out : "Book not added" };
  } else {
    ctx.response.status = 400;
    ctx.response.body = { msg: "No data found" };
  }
});

// @route GET api/books/:id
// @description Update book
// @access Public
bookRouter.put("/:id", async (ctx) => {
  if (ctx.request.hasBody) {
    const id = new Bson.ObjectId(ctx.params.id);
    const body = await ctx.request.body();
    const data = await body.value;
    const out = await Book.updateOne(
      { _id: id },
      {
        $set: {
          title: data.title,
          author: data.author,
          description: data.description,
          updated_date: Date.now(),
        },
      }
    );
    ctx.response.status = 201;
    ctx.response.body = { msg: out ? out : "Book not updated˝" };
  } else {
    ctx.response.status = 400;
    ctx.response.body = { msg: "No data found" };
  }
});

// @route GET api/books/:id
// @description Delete book by id
// @access Public
bookRouter.delete("/:id", async (ctx) => {
  const id = new Bson.ObjectId(ctx.params.id);
  const out = await Book.deleteOne({ _id: id });
  ctx.response.body = { msg: out ? out : "Book not deleted" };
  ctx.response.status = out ? 200 : 404;
});
