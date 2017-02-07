import $ from 'jquery';
import Handlebars from 'handlebars';
import template from 'templates/word.html';

var WordAssociationList = require('components/wordAssociationWords');
var wordTemplate;
var currentIndex = 0;
var significantResponse = 0;

var app = {
  init: function(){
    app.compileTemplate();
    app.render();
  },
  render: function() {   
    $('.word-container').html(wordTemplate(WordAssociationList[currentIndex]));
    currentIndex++;
    app.bindEvents();    
  },
  bindEvents: function(){
    app.noResponse();
    app.countSignificantResponses();     
  },
  compileTemplate: function(){
    wordTemplate = Handlebars.compile(template);
  },
  countSignificantResponses: function(){
    var $response = $('.submit');
    $response.on('click', function(){
      significantResponse++;
      $('.sig-response').html('Significant Responses: ' + significantResponse);
      app.nextWord(); 
    });
  },
  nextWord: function(){
    $('.word-container').html(wordTemplate(WordAssociationList[currentIndex]));
    currentIndex++;
  },
  noResponse: function(){
    var $noResponse = $('.sig-no');
    $noResponse.on('click', function(){
      app.nextWord();
    });
  }
};
  
module.exports = app;
