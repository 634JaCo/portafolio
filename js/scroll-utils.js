(function (global) {
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function mapProgressToTime(progress, duration) {
    return clamp(progress, 0, 1) * duration;
  }

  const ScrollUtils = { clamp, mapProgressToTime };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ScrollUtils;
  } else {
    global.ScrollUtils = ScrollUtils;
  }
})(typeof window !== 'undefined' ? window : globalThis);
