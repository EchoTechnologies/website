const htmlMap = {};
let loading = null;

const updateGfm = (page, callback) => {
  $.get('https://www.gofundme.com/echo-technology', res => {
    const $html = $(res);
    const raised = $html.find('.show-for-large .goal strong')[0].innerText;
    const total = $html.find('.show-for-large .goal .smaller').text().match(/\$[\d,]+/)[0];
    const donators = $html.find('.donations-column-contain .supporters-list .supporter-name').map((i, el) => $(el).text().replace(/ +/g, ' ')).get().join(', ');
    page.find('#raised').text(raised);
    page.find('#total').text(total);
    page.find('#donators').text(donators);

    const percentage = parseInt(raised.replace(/[\$,]/g, '')) / parseInt(total.replace(/[\$,]/g, '')) * 100;
    page.find('#meter').width(`${percentage}%`);
    callback(page.html().trim());
  });
};

const fetchPage = (path, callback) => {
  $.get(path, res => {
    const $main = $($(res)[4]);
    if (path === '/donate.html') {
      updateGfm($main, data => callback(data));
    } else {
      callback($main.html().trim());
    }
  });
};

const updatePage = path => {
  if (path.startsWith('#') || loading === path) return false;

  loading = path;
  $('main').animate({opacity: 0}, () => {
    if (htmlMap[path]) {
      $('main').html(htmlMap[path]);
      $('main').animate({opacity: 1});
    } else {
      fetchPage(path, res => {
        htmlMap[path] = res;
        $('main').html(htmlMap[path]);
        $('main').animate({opacity: 1});
      });
    }
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
  const $main = $('main');
  if (loading === '/donate.html') {
    updateGfm($main, data => {
      $main.html(data);
      htmlMap[loading] = $main.html().trim();
    });
  } else {
    htmlMap[loading] = $main.html().trim();
  }
});
