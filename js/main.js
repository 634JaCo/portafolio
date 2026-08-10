(function () {
  function renderServiceMenu() {
    const list = document.getElementById('service-menu-list');
    list.innerHTML = '';

    CATEGORIES.forEach((category) => {
      const li = document.createElement('li');
      li.className = 'menu-item';
      li.dataset.categoryId = category.id;

      const link = document.createElement('a');
      link.href = Router.buildHashForCategory(category.id);

      const arrow = document.createElement('span');
      arrow.className = 'arrow';
      arrow.textContent = '→';

      const label = document.createElement('span');
      label.textContent = category.label;

      link.appendChild(arrow);
      link.appendChild(label);
      li.appendChild(link);
      list.appendChild(li);
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderServiceMenu();
  });
})();
