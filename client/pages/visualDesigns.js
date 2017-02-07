import $ from 'jquery';
import Handlebars from 'handlebars';
import vdtItems from 'templates/vdtItems.html';


var itemsTemplate;
var items = require('components/vdtItems');
var currentIndex = 0;
var array = [];

var app = {
  init: function(){
    app.compileTemplates();
    app.render();
  },
  render: function(){
    app.bindEvents();
  },
  compileTemplates: function(){
    itemsTemplate = Handlebars.compile(vdtItems);
  },
  advancePage: function(){
    currentIndex++
    $('.vdt-container').html(itemsTemplate(items[currentIndex]));
  },
  startTest: function(){
    $('.btn-start').on('click', function(){
      $('.vdt-container').html(itemsTemplate(items[currentIndex]));
    });
  },
  selectImage: function(){
    $(document).on("click", ".vdt-item", function(){
        var choice = this.id;
        var itemNumber = currentIndex + 1;
        array.push(itemNumber, choice);
        app.advancePage();
    });
  },
  bindEvents: function(){
    app.startTest();
    app.selectImage();
  }
};

module.exports = app;
