import { describe, expect, it } from "bun:test";
import { app } from "@src/index";

describe("Testing Log Fetching", () => {
    it("Should fetch logs", async () => {
      const res = await app.request("/api/logs/get_all_logs");
      expect(res.status).toBe(200);
      expect(res.body).toHaveLength(10); 
    });
  });