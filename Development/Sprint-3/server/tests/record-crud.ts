import { describe, expect, it } from "bun:test";
import { app } from "@src/index";

describe("Testing Record Creation", () => {
  it("Should create a new record", async () => {
    const newRecord = { id: 1, name: "John Doe", age: 30, collection_name: "Test"};
    const res = await app.request("/api/record/create", { method: "POST", body: newRecord });
    expect(res.status).toBe(201); // 201 is successful creation
    expect(res.body).toMatchObject(newRecord);
  });
});

describe("Testing Record Deletion", () => {
  it("Should delete a record", async () => {
    const recordId = 1; 
    const res = await app.request(`/api/record/${recordId}`, { method: "DELETE" ,  { collection_name: "Test"}});
    expect(res.status).toBe(200); // 200 is successful deletion
  });
});

describe("Testing Record Reading", () => {
  it("Should read a record", async () => {
    const recordId = 1;
    const res = await app.request(`/api/records/?collection_name=Test&query=${recordId}`);
    expect(res.status).toBe(200); 
    expect(res.body).toHaveProperty("id", recordId);
  });
});