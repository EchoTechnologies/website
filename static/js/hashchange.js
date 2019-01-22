const htmlMap = {};
let loading = null;

const fetchPage = (path, callback) => {
  $.get(path, function (res) {
    const $html = $(res)[3];
    callback($html.innerHTML.trim());
  });
};

const updatePage = path => {
  if (path.startsWith('#') || loading === path) return false;

  loading = path;
  $('main').animate({opacity: 0}, () => {
    if (htmlMap[path]) {
      $('main').html(htmlMap[path]);
    } else {
      fetchPage(path, res => {
        htmlMap[path] = res;
        $('main').html(htmlMap[path]);
      });
    }
    $('main').animate({opacity: 1});
  });
  return true;
};

window.addEventListener('popstate', () => {
  const path = window.location.pathname;
  updatePage(path);
});

$('#nav a, #sidenav a').click(function (e) {
  e.preventDefault();
  const path = $(this).attr('href');
  const updated = updatePage(path);
  if (updated) history.pushState({}, '', path);
});

$(window).ready(() => {
  loading = window.location.pathname;
});
