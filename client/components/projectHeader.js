var $ = require('jquery');
window.jQuery = window.$ = $;
require('bootstrap');

import projectLearnMenu from 'components/projectLearnMenu'; 

var app = {
  init: function() {
    app.render();
  },
  render: function() {
    projectLearnMenu.init();
    $('.nav-list.learn').on('click', function(){
      $('.header-container ul.learn-menu').animate({
        top: 200   
      }, 1000, 'swing');
    }); 
  }
};
module.exports = app;