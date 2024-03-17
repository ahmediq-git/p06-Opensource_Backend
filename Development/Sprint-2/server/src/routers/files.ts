import { Context, Hono } from "hono";
import { resolve } from "path";
import { v4 } from "uuid";
import { getCollection } from "@src/utils/getCollection";
import { createMetaData } from "@src/utils/files/createMetaData";
import { getMetaData } from "@src/utils/files/getMetaData";
import { unlink } from "node:fs/promises";
import {readFilesInDirectory} from "@src/utils/misc/readFilesInDirectory";

const files = new Hono();

//post with file field in form data http://localhost:3690/api/files
files.post("/", async (c) => {
  try {
    const data = await c.req.formData();
    const file = data.get("file");

    const id = v4().replaceAll('-', '').slice(0,16);

    if (!file) throw new Error("No file provided in the `file` field");

    const dotIndex = (file.name).lastIndexOf('.');
    const fileExtension = file.name.slice(dotIndex + 1);

    // obtaining the url of where the service is running
    const config=getCollection('config')
    const appConfig: any = await new Promise((resolve, reject) => {
			config.findOne({}, function (err:any, docs:any) {
				if (err) {
					reject(err);
				}
				resolve(docs);
			});
		});

		if (!appConfig) throw new Error("Failed to get appConfig");

    let bytes_written = await Bun.write(`./files/${id}.${fileExtension}`, file);

    if (bytes_written > 0) {
      const file_url = `${appConfig.application.url}/api/files?file_name=${id}.${fileExtension}`
      const metadata = createMetaData(file_url, file.name, `${id}.${fileExtension}` ,id, bytes_written)

      await Bun.write(`./files-metadata/${id}.json`, JSON.stringify(metadata, null, 2));

      return c.json({
        error: false,
        data: id,
      });
    } else {
      throw new Error("Failed to write file to disk");
    }

  } catch (err) {
    
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
    error: "Error retrieving the file",
    data: null,
  });

}

});

// return meta data of a file
// http://localhost:3690/api/files/metadata?id=
files.get("/metadata", async(c:Context)=>{
  try {
    const params = c.req.query();
    
    const { id } = params as {
      id: string;
    };

    if (id) {
      const meta = await getMetaData(id)
      return c.json({
        error: false,
        data: meta
      })
    }
    return c.json({
      error: true,
      data: null,
    });
  } catch (error) {
  
    console.log(error);
    return c.json({
      error: "Error retrieving the file",
      data: null,
    });
  
  }
})

// http://localhost:3690/api/files/:id
files.delete("/:id", async(c:Context)=>{
  try {
    const { id } = c.req.param();
  
    const meta = await getMetaData(id)

    await unlink(`./files/${meta.stored_name}`);
    await unlink(`./files-metadata/${id}.json`);
    
    return c.json({
      error: false,
      data: `Deletion of the file with id ${id} successful`,
    });
  } catch (error) {
    console.log(error);
    return c.json({
      error: "Error deleting the file",
      data: null,
    });
  }
})


// get all files meta data in an array
files.get("/list", async(c:Context)=>{
  try {
    const meta_data_file_names = readFilesInDirectory('files-metadata')
    let ids = meta_data_file_names.map(meta_data_file => meta_data_file.replace(".json", ""));
    
    let meta_data_files =[]

    await Promise.all(ids.map(async (id) => {
      try {
        const meta = await getMetaData(id);
        meta_data_files.push(meta);
      } catch (error) {
        console.error(`Error fetching metadata for ID ${id}:`, error);
      }
    }));

    return c.json({
      error: false,
      data: meta_data_files,
    });
    
  } catch (error) {
    return c.json({
      error: "Error Listing files",
      data: null,
    });
  }
})

export default files;
