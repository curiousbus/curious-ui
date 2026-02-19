import test from "node:test";
import assert from "node:assert/strict";
import { loadRegistryItems } from "../registry-utils.mjs";

test("phase-1 has at least six registry items", async () => {
  const items = await loadRegistryItems();
  assert.ok(items.length >= 6);
});

test("registry item names are unique", async () => {
  const items = await loadRegistryItems();
  const names = items.map(({ item }) => item.name);
  const unique = new Set(names);
  assert.equal(names.length, unique.size);
});
