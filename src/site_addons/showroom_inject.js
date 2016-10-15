if (SrGlobal && SrGlobal.isLive) {
  $('.footer-menu>ul').append('<li id="gyaruppi-1x"><a><span style="font-size: 27px">1x</span></a></li>');
  $('.footer-menu>ul').append('<li id="gyaruppi-15x"><a><span style="font-size: 27px">1.5x</span></a></li>');
  $('.footer-menu>ul').append('<li id="gyaruppi-2x"><a><span style="font-size: 27px">2x</span></a></li>');

  $('#gyaruppi-2x').click(function(){
    $('#js-avatar').hide();
    $('#js-room-section').css('background-image', '');
    $('.l-room-video').css('transform', 'scale(2)').css('margin-left', '330px').css('top', '240px').css('left', '0px');
  });


  $('#gyaruppi-15x').click(function(){
    $('#js-avatar').hide();
    $('#js-room-section').css('background-image', '');
    $('.l-room-video').css('transform', 'scale(1.5)').css('margin-left', '170px').css('top', '150px').css('left', '0px');
  });

  $('#gyaruppi-1x').click(function(){
    $('#js-avatar').hide();
    $('#js-room-section').css('background-image', '');
    $('.l-room-video').css('transform', 'scale(1)').css('margin-left', '10px').css('top', '60px').css('left', '0px');
  });
}


