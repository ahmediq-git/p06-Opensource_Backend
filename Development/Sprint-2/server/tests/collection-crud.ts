import { describe, expect, it } from "bun:test";
import { app } from "@src/index";

describe("Testing Collection", () => {
  it("Should return Config and Users ", async () => {
    const res = await app.request("/api/collections");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });
});
