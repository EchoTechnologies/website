const htmlMap = {};
let loading = null;

const updateGfm = (page, callback) => {
  $.get('https://www.gofundme.com/echo-technology', res => {
    const $html = $(res);
    const raised = $html.find('.show-for-large .goal strong')[0].innerText;
    const total = $html.find('.show-for-large .goal .smaller').text().match(/\$[\d,]+/)[0];
    page.find('#raised').text(raised);
    page.find('#total').text(total);

    const donors = $html.find('.donations-column-contain .supporters-list .supporter-name').map((i, el) => $(el).text().replace(/ +/g, ' ')).get().join(', ');
    const nonGfm = page.find('#donors').text();
    page.find('#donors').text(`${nonGfm}, ${donors}`);

    const percentage = parseInt(raised.replace(/[\$,]/g, '')) / parseInt(total.replace(/[\$,]/g, '')) * 100;
    page.find('#meter').width(`${percentage}%`);
    callback(page.html().trim());
  });
};

const fetchPage = (path, callback) => {
  $.get(path, res => {
    const $main = $($(res)[4]);
    if (path === '/donate.html') {
      $('#loader').animate({opacity: 1});
      updateGfm($main, data => {
        callback(data);
        $('#loader').animate({opacity: 0});
      });
    } else {
      callback($main.html().trim());
    }
  });
};

const createChart = () => {
  $.getJSON('static/bom.json', json => {
    const data = json.data.map(o => o.amount);
    const labels = json.data.map(o => o.department);
    const backgroundColor = json.data.map(o => o.color);
    const chart = new Chart($('#chart'), {
      type: 'pie',
      data: {
        datasets: [{data, backgroundColor}],
        labels
      },
      options: {
        legend: {display: false},
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const dataset = data.datasets[tooltipItem.datasetIndex];
              const total = dataset.data.reduce((a, b) => a + b);
              const value = dataset.data[tooltipItem.index];
              const percentage = parseFloat((value / total * 100).toFixed(1));
              return `$${value} (${percentage}%)`;
            },
            title: (tooltipItem, data) => data.labels[tooltipItem[0].index]
          }
        }
      }
    });
  });
};

const updatePage = path => {
  if (path.startsWith('#') || loading === path) return false;

  loading = path;
  $('main').animate({opacity: 0}, () => {
    $('body').css({overflow: 'hidden'});
    if (htmlMap[path]) {
      if (path === '/donate.html') createChart();
      $('main').html(htmlMap[path]);
      $('main').animate({opacity: 1});
      $('body').css({overflow: 'scroll'});
    } else {
      fetchPage(path, res => {
        if (path === '/donate.html') createChart();
        htmlMap[path] = res;
        $('main').html(htmlMap[path]);
        $('main').animate({opacity: 1});
        $('body').css({overflow: 'scroll'});
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
  if (!path) return;
  const updated = updatePage(path);
  if (updated) history.pushState({}, '', path);
});

$(window).ready(() => {
  loading = window.location.pathname;
  const $main = $('main');
  if (loading === '/donate.html') {
    updateGfm($main, data => {
      createChart();
      $main.html(data);
      htmlMap[loading] = $main.html().trim();
    });
  } else {
    htmlMap[loading] = $main.html().trim();
  }
});
