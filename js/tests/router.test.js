const test = require('node:test');
const assert = require('node:assert/strict');
const { parseCategoryFromHash, buildHashForCategory } = require('../router.js');

const VALID_IDS = ['branding', 'content-creator', 'b2b-design', 'web-design', 'ai-creator'];

test('parseCategoryFromHash returns the id when valid', () => {
  assert.equal(parseCategoryFromHash('#branding', VALID_IDS), 'branding');
  assert.equal(parseCategoryFromHash('web-design', VALID_IDS), 'web-design');
});

test('parseCategoryFromHash returns null for empty or unknown hash', () => {
  assert.equal(parseCategoryFromHash('', VALID_IDS), null);
  assert.equal(parseCategoryFromHash('#', VALID_IDS), null);
  assert.equal(parseCategoryFromHash('#not-a-category', VALID_IDS), null);
});

test('buildHashForCategory prefixes the id with #', () => {
  assert.equal(buildHashForCategory('branding'), '#branding');
});
