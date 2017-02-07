
import $ from 'jquery';
import 'styles/main.scss';

import tweezer from 'pages/timerTD';
import observation from 'pages/timerObs';
import vdt from 'pages/visualDesigns';
import info from 'pages/informationForm';

$(function() {

  var url = window.location.pathname;

  switch (url) {
    case '/pages/tweezerTimer.html':
      tweezer.init();
    break;
    case '/pages/observationTimer.html':
      observation.init();
    break;
    case '/pages/visualDesigns.html':
      vdt.init();
    break;
    case '/pages/informationForm.html':
      info.init();
    break;

    default: break;
  }
});
