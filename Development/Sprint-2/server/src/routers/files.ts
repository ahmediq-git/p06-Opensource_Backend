import { Context, Hono } from "hono";
import { resolve } from "path";
import { v4 } from "uuid";

const files = new Hono();

//post with file field in form data http://localhost:3690/api/files
files.post("/", async (c) => {
  try {
    const data = await c.req.formData();
    const file = data.get("file");
    const id = v4();
    if (!file) throw new Error("No file provided in the `file` field");

    let bytes_written = await Bun.write(`./files/${id}_${file.name}`, file);
    if (bytes_written > 0) {
      let name = `${id}_${file.name}`;
      return c.json({
        error: false,
        data: name,
      });
    } else {
      throw new Error("Failed to write file to disk");
    }
  } catch (err) {
    console.log(err);
    return c.json({ error: err, data: null });
  }
});

//http://localhost:3690/api/files?file_name=

files.get("/", async (c: Context) => {
  try {
  const params = c.req.query();
  const { file_name } = params as {
    file_name: string;
  };
  if (file_name) {
    let path = resolve(`./files/${file_name}`);
    return new Response(Bun.file(path));
  }
  return c.json({
    error: true,
    data: null,
  });
} catch (error) {

  console.log(error);
  return c.json({
    error: "Error retriving the file",
    data: null,
  });

}

});

export default files;
