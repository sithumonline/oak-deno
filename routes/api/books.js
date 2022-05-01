import { Router } from "https://deno.land/x/oak/mod.ts";
export const bookRouter = new Router();
import { query } from "../../config/db.js";
import joi from "https://cdn.skypack.dev/joi";

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
  const data = await query("SELECT * FROM book");
  ctx.response.body = { msg: data ? data.rows : "No Books found" };
  ctx.response.status = data ? 200 : 404;
});

// @route GET api/books/:id
// @description Get single book by id
// @access Public
bookRouter.get("/:id", async (ctx) => {
  const id = ctx.params.id;
  const { error } = joi
    .object({ id: joi.string().guid().required() })
    .validate({ id });
  if (error) {
    ctx.response.status = 400;
    ctx.response.body = { msg: error.message };
    return;
  }
  const data = await query({
    text: "SELECT * FROM book WHERE id = $id",
    args: {
      id: id,
    },
  });
  ctx.response.body = { msg: data ? data.rows : "No Book found" };
  ctx.response.status = data ? 200 : 404;
});

// @route GET api/books
// @description add/save book
// @access Public
bookRouter.post("/", async (ctx) => {
  const body = await ctx.request.body();
  const data = await body.value;
  const { error } = joi
    .object({
      title: joi.string().required(),
      author: joi.string().required(),
      description: joi.string().required(),
    })
    .validate(data);
  if (error) {
    ctx.response.status = 400;
    ctx.response.body = { msg: error.message };
    return;
  }
  if (ctx.request.hasBody) {
    const out = await query({
      text:
        "INSERT INTO book (title, author, description, updated_date) VALUES ($title, $author, $description, $updated_date)",
      args: {
        ...data,
        updated_date: new Date(),
      },
    });
    ctx.response.status = 201;
    ctx.response.body = { msg: out ? out.rows : "Book not added" };
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
    const id = ctx.params.id;
    const body = await ctx.request.body();
    const data = await body.value;
    const { error } = joi
      .object({
        id: joi.string().guid().required(),
        title: joi.string().required(),
        author: joi.string().required(),
        description: joi.string().required(),
      })
      .validate({ id, ...data });
    if (error) {
      ctx.response.status = 400;
      ctx.response.body = { msg: error.message };
      return;
    }
    const out = await query({
      text:
        "UPDATE book SET title = $title, author = $author, description = $description, updated_date = $updated_date WHERE id = $id",
      args: {
        ...data,
        id: id,
        updated_date: new Date(),
      },
    });
    ctx.response.status = 201;
    ctx.response.body = { msg: out ? out.rows : "Book not updated" };
  }
});

// @route GET api/books/:id
// @description Delete book by id
// @access Public
bookRouter.delete("/:id", async (ctx) => {
  const id = ctx.params.id;
  const { error } = joi
    .object({ id: joi.string().guid().required() })
    .validate({ id });
  if (error) {
    ctx.response.status = 400;
    ctx.response.body = { msg: error.message };
    return;
  }
  const out = await query({
    text: "DELETE FROM book WHERE id = $id",
    args: {
      id: id,
    },
  });
  ctx.response.body = { msg: out ? out.rows : "Book not deleted" };
  ctx.response.status = out ? 200 : 404;
});
