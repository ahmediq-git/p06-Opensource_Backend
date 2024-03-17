import { describe, expect, it } from "bun:test";
import { app } from "@src/index";

describe("Testing Index Creation", () => {
  it("Should create an index", async () => {
    const indexName = "age_index"; 
    const res = await app.request(`/api/index/create_index`, { method: "POST" , {collection_name:"Test", field:"Test", on:"Test"}});
    expect(res.status).toBe(201); 
  });
});

describe("Testing Index Deletion", () => {
  it("Should delete an index", async () => {
    const indexName = "age_index"; 
    const res = await app.request(`/api/index/remove_index`, { method: "DELETE", {collection_name:"Test", field:"Test", on:"Test"}});
    expect(res.status).toBe(200); 
});

describe("Testing Index Fetching", () => {
  it("Should fetch indexes", async () => {
    const res = await app.request("/api/index/get_all_indices");
    expect(res.status).toBe(200); 
    expect(res.body).toHaveLength(2);
});
