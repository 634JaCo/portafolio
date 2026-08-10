(function (global) {
  function parseCategoryFromHash(hash, validIds) {
    const id = (hash || '').replace(/^#/, '').trim();
    if (!id) return null;
    return validIds.includes(id) ? id : null;
  }

  function buildHashForCategory(id) {
    return '#' + id;
  }

  const Router = { parseCategoryFromHash, buildHashForCategory };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Router;
  } else {
    global.Router = Router;
  }
})(typeof window !== 'undefined' ? window : globalThis);
