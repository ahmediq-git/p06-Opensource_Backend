
import { Context, Hono } from "hono";
import { resolve } from 'path'

const files = new Hono();

files.post("", async (c) => {
    const data = await c.req.formData();
    const file_x = data.get("file");
    if(!file_x) return c.json({error: true, data: null})
    let bytes_written = await Bun.write(`./files/${file_x.name}`, file_x)
    if(bytes_written > 0){
        let path = resolve(`./files/${file_x.name}`)
        return c.json({
            error: false,
            data: path
        })
    }
    return c.json({
        error: true,
        data: null
    })
   
});

files.get("/get_file", async (c: Context) => {
    const params = c.req.query();
	const { file_name } = params as {
        file_name: string;
	};
    if(file_name){
    let path = resolve(`./files/${file_name}`)
    return new Response(Bun.file(path))
    }
    return c.json({
        error: true,
        data: null
    })
})

export default files
