const test = require('node:test');
const assert = require('node:assert/strict');
const CATEGORIES = require('../categories-data.js');

test('exports an array of exactly 5 categories', () => {
  assert.equal(Array.isArray(CATEGORIES), true);
  assert.equal(CATEGORIES.length, 5);
});

test('category ids are unique and match the expected slugs', () => {
  const ids = CATEGORIES.map((c) => c.id);
  const expected = ['branding', 'content-creator', 'b2b-design', 'web-design', 'ai-creator'];
  assert.deepEqual(ids.slice().sort(), expected.slice().sort());
  assert.equal(new Set(ids).size, ids.length);
});

test('every category has the required shape', () => {
  for (const category of CATEGORIES) {
    assert.equal(typeof category.id, 'string');
    assert.equal(typeof category.label, 'string');
    assert.equal(typeof category.title, 'string');
    assert.equal(typeof category.description, 'string');
    assert.equal(typeof category.featuredImage, 'string');
    assert.equal(Array.isArray(category.projects), true);
    assert.equal(category.projects.length, 4);
    for (const project of category.projects) {
      assert.equal(typeof project.title, 'string');
      assert.equal(typeof project.image, 'string');
      assert.equal(typeof project.link, 'string');
    }
    assert.equal(Array.isArray(category.largeBlocks), true);
    assert.equal(category.largeBlocks.length, 2);
    for (const block of category.largeBlocks) {
      assert.equal(typeof block.title, 'string');
      assert.equal(typeof block.image, 'string');
      assert.equal(typeof block.link, 'string');
    }
  }
});
