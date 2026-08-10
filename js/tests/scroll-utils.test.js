const test = require('node:test');
const assert = require('node:assert/strict');
const { clamp, mapProgressToTime } = require('../scroll-utils.js');

test('clamp keeps values within bounds', () => {
  assert.equal(clamp(0.5, 0, 1), 0.5);
  assert.equal(clamp(-1, 0, 1), 0);
  assert.equal(clamp(2, 0, 1), 1);
});

test('mapProgressToTime scales progress by duration', () => {
  assert.equal(mapProgressToTime(0, 8), 0);
  assert.equal(mapProgressToTime(1, 8), 8);
  assert.equal(mapProgressToTime(0.5, 8), 4);
});

test('mapProgressToTime clamps out-of-range progress', () => {
  assert.equal(mapProgressToTime(-0.2, 8), 0);
  assert.equal(mapProgressToTime(1.5, 8), 8);
});
