window.onload = function () {
  var items;
  var i;
  items = document.getElementsByClassName('menu-item');
  for (i = 0; i < items.length; i += 1) {
    items[i].addEventListener('mouseenter', function () {
      console.log(items[i]);
    });
  }
};
