

import $ from 'jquery';
import moment from 'moment';
import Handlebars from 'handlebars';
import lscache from 'lscache';
import _ from 'lodash';
import template from 'templates/obsItem.html';
import json2csv from 'json2csv';
import d3 from 'd3';
import dataTable from 'templates/dataTable.html';

var obsItems = require('components/observation');
var obsItemTemplate;
var timerRunning = false;
var interval; 
var startTime;
var time;
var minutes;
var hundredths;
var $startStop = $('.start-stop-button');
var $study = $('.misc-button');
var $reset = $('.reset-button');
var times = [];
var points;
var currentIndex = 0;
var index = 0;
var pointsArray = [];
var testData = [];
var itemData;
var result;
var pointsTotal;
// var testScore = [];

var model = {
  init: function(){
    var savedData = lscache.get('testData');
    if (savedData) {      
      testData = savedData;
    } else {
      testData = [];
    }
  },
  save: function(){
    var dataToSave = JSON.stringify(testData);
    lscache.set('testData', dataToSave);
  },
  get: function(){
    return testData;
  }
};

var app = {
  init: function(){
    model.init();
    app.compileTemplate();
    app.render();
  },
  render: function(){
    app.bindClickEvents();
  },
  compileTemplate: function(){
    obsItemTemplate = Handlebars.compile(template);
  },
  updateTimer: function(){
    var now = moment();
    var timeDiff = (now - startTime) / 1000;
    minutes = Math.floor(timeDiff / 60);
    hundredths = Math.floor(timeDiff / 0.6) % 100;
    app.stringify(minutes, hundredths);
    $('.timer').html(time);
  },
  stringify: function(){
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    if (hundredths < 10) {
      hundredths = '0' + hundredths;
    }
    time = (minutes + '.' + hundredths);
  },
  startTimer: function(){
    $startStop.on('click', function(){
      if (timerRunning === false) {
        timerRunning = true;  
        startTime = moment();     
        interval = setInterval(app.updateTimer, 150);
        $startStop.html('Stop');
        $startStop.css({
          'background-color': '#19284B'
        });
        app.showItem();
      } else {
        app.stopTimer();
      }
    });
  },
  stopTimer: function(){
    timerRunning = false;
    $startStop.html('Start');
    $startStop.css({
      'background-color': '#17B20A'
    });
    interval = clearInterval(interval);
    times.push(hundredths);
    app.addPoints();
    itemData = {
      itemNumber: index,
      time: hundredths,
      points: points,
      totalPoints: pointsTotal
    };
    testData.push(itemData);
    model.save();
  },
  addPoints: function(){
    (function assignPoints(){
      if (hundredths < 10) {
        points = 3;
      } else if (hundredths > 9 && hundredths < 20) {
        points = 2;
      } else if (hundredths > 19 && hundredths < 30) {
        points = 1;
      } else {
        points = 0;
      }
      index++;
    }());    
    pointsArray.push(points);
    pointsTotal = _.sum(pointsArray);
    $('.score').html('Score = ' + pointsTotal);
  },
  showItem: function(){
    $('.item-container').html(obsItemTemplate(obsItems[currentIndex]));
    currentIndex++;
  },
  createTable: function(){
    $('.stopwatch-container').html(dataTable);
    d3.text(result, function(data) {
      var parsedCSV = d3.csv.parseRows(result);
      var container = d3.select('.datatable')
        .append('table')
        .selectAll('tr')
          .data(parsedCSV).enter()
          .append('tr')
        .selectAll('td')
          .data(function(d) { return d; }).enter()
          .append('td')
          .text(function(d) { return d; });
    });
    localStorage.clear();
  },
  createCSV: function(){
    $('.create-csv').on('click', function(){
      var fields = ['itemNumber', 'time', 'points'];
      try {
        result = json2csv({ data: testData, fields: fields });
        app.createTable();
      } catch (err) {
        console.log(err);
      }
    }); 
  },
  studyPage: function(){
    $study.on('click', function(){
      if (timerRunning === false) {
        timerRunning = true;
        startTime = moment();
        interval = setInterval(app.updateTimer, 150);
        $study.css({
          'background-color': '#5D0A57'
        });   
      } else {
        timerRunning = false;
        interval = clearInterval(interval);
        $study.css({
          'background-color': '#089D9A'
        });
      }
    });
  },
  resetTimer: function(){
    $reset.on('click', function(){
      if (timerRunning === false) {
        app.clearEverything(); 
      } 
    });   
  },
  clearEverything: function(){
    interval = clearInterval(interval);
    testData = [];
    pointsArray = [];
    minutes = 0;
    hundredths = 0;
    index = 0;
    currentIndex = 0;
    
    $('.item-container').html('');
    $('.score').html('Score =');
    $('.timer').html('00.00');
  },
  bindClickEvents: function(){
    app.startTimer();
    app.studyPage();
    app.resetTimer();
    app.createCSV();
  }
};

module.exports = app;
