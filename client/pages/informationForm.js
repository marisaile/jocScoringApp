var $ = require('jquery');
// legacy loading for bootstrap
window.jQuery = window.$ = $;
require('bootstrap');
import _ from 'underscore';
import Handlebars from 'handlebars';
import lscache from 'lscache';

import welcome from 'templates/welcome.html';
import personal from 'templates/personalInfo.html';
import helperPersonal from 'templates/helperPersonal.html';
import helperWelcome from 'templates/helperWelcome.html';

function Client(){
  this.id = Math.floor(Math.random() * 10000);
  this.firstName = $('#firstName').val();
  this.lastName = $('#lastName').val();
  this.dateOfBirth = $('#dob').val();
  this.gender = $("input[name='gender']:checked").val();
  this.email = $('#email').val();
  this.phone = $('#phone').val();
  this.location = $('#city-state').val();
  this.referral = $('.referral-source').val();
}


var app = {
  init: function(){
    $('.form-container').html(welcome);
    $('.helper-container').html(helperWelcome);
    app.render();
  },
  render: function(){
    $('.btn-start-info').on('click', function(e){
      e.preventDefault();
      $('.form-container').html(personal);
      $('.helper-container').html(helperPersonal);
    });
    $('.btn-submit').on('click', function(e){
      e.preventDefault();      
      var client = new Client();
    }); 
  }
};

module.exports = app;
