import assert from "node:assert/strict";
import test from "node:test";
import { loadRegistryItems } from "../registry-utils.mjs";

test("registry has at least one item", async () => {
  const items = await loadRegistryItems();
  assert.ok(items.length >= 1);
});

test("registry item names are unique", async () => {
  const items = await loadRegistryItems();
  const names = items.map(({ item }) => item.name);
  const unique = new Set(names);
  assert.equal(names.length, unique.size);
});
