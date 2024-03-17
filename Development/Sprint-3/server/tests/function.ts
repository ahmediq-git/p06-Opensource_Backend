import { describe, expect, it } from "bun:test";
import { app } from "@src/index";

describe("Testing Function Creation", () => {
    it("Should create a new function", async () => {
      const res = await app.request(`/api/functions/register_function `, { method: "POST", {type: "export", "outName": "test", export: "test"} });
      expect(res.status).toBe(201);
    });
  });
  
  describe("Testing Function Deletion", () => {
    it("Should delete a function", async () => {
      const res = await app.request(`/api/functions/delete_function`, { method: "DELETE" {type: "export", "outName": "test", export: "test"}});
      expect(res.status).toBe(200); 
    });
  });
  
  describe("Testing Function Fetching", () => {
    it("Should fetch functions", async () => {
      const res = await app.request("/api/get_registered_functions");
      expect(res.status).toBe(200); 
      expect(res.body).toHaveLength(3);
    });
  });