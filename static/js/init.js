$(window).load(function () {
  trigger();
  setInterval(() => trigger(), 6000);
});

function trigger() {
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      $('#intro')
        .ripple({
          fixedPos: [
            $('#intro').innerWidth() / 3,
            $('#intro').innerHeight() / 2
          ],
          adaptPos: true
        })
        .trigger('mousedown')
        .ripple({
          unbind: true
        });
    }, 300 * i);
  }
  setTimeout(() => $.ripple.destroy(), 5000);
}

$('#sidenav-trigger').click(() => {
  $('#sidenav').animate({width: '100%'});
  $('#backdrop').show();
  $('body').css({overflow: 'hidden'});
});

$('#close, #backdrop').click(() => {
  $('#sidenav').animate({width: '0'});
  $('#backdrop').hide();
  $('body').css({overflow: 'scroll'});
});
