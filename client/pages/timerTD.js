
import $ from 'jquery';
import moment from 'moment';
import Handlebars from 'handlebars';
import lscache from 'lscache';
import _ from 'lodash';
import template from 'templates/tweezerTemplate.html';
import json2csv from 'json2csv';
import d3 from 'd3';
import dataTable from 'templates/dataTable.html';


var twzRows = require('components/tweezerRow');
var tweezerTemplate;
var timerRunning = false;
var interval; 
var startTime;
var time;
var minutes;
var hundredths;
var $startStop = $('.start-stop-button');
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
var extraTime = 0;
var pinDropped = 0;
var rowTime;
var pickedUp = 0;


var model = {
  init: function(){
    testData = [];
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
    app.compileTemplates();
    app.render();
  }, 
  render: function(){
    app.bindClickEvents(); 
  },
  compileTemplates: function(){
    tweezerTemplate = Handlebars.compile(template);
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
        app.showRow();
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
    times.unshift(time);
    time = (times[0] - times[1]).toFixed(2);  
    app.addPoints(); 
    itemData = {
      row: currentIndex,
      time: time,
      dropped: pinDropped,
      pickedUp: pickedUp,
      penalty: extraTime,
      rowTime: rowTime,
      points: points
    };    
    testData.push(itemData);
    model.save();
  },
  splitTimer: function(){  
    var $split = $('.misc-button');
    $split.on('click', function(){
      times.unshift(time);
      if (times.length === 1) {
        time = time;
      } else {
        time = (times[0] - times[1]).toFixed(2);
      }
      console.log(times);
      console.log(time);   
      app.addPoints();   
      itemData = {
        row: currentIndex,
        time: time,
        dropped: pinDropped,
        pickedUp: pickedUp,
        penalty: extraTime,
        rowTime: rowTime,
        points: points
      }     
      app.showRow();
      testData.push(itemData);  
      model.save();      
    });     
  },
  showRow: function(){
    $('.item-container').html(tweezerTemplate(twzRows[currentIndex]));
    currentIndex++;   
    app.droppedPin();
    app.pickedUp();
  },
  resetTimer: function(){
    $reset.on('click', function(){
      if (timerRunning === false) {
        app.clearEverything(); 
      } 
    });   
  },
  addPoints: function(){
    (function assignPoints(){      
      if (extraTime > 0.0) {
        rowTime = (time + extraTime).toFixed(2);
      } else {
        rowTime = time;
      }
      console.log(rowTime);
      if (rowTime <= 0.32) {
        points = 8;
      } else if (rowTime == 0.33 || rowTime == 0.34) {
        points = 7;
      } else if (rowTime == 0.35 || rowTime == 0.36) {
        points = 6;
      } else if (rowTime == 0.37 || rowTime == 0.38) {
        points = 5;
      } else if (rowTime == 0.39 || rowTime == 0.40) {
        points = 4;
      } else if (rowTime == 0.41 || rowTime == 0.42 || rowTime == 0.43) {
        points = 3;
      } else if (rowTime > 0.43 && rowTime < 0.48) {
        points = 2;
      } else if (rowTime > 0.47) {
        points = 1;
      }
      // index++;
    }());    
    pointsArray.push(points);
    pointsTotal = _.sum(pointsArray);
    $('.score').html('Score = ' + pointsTotal);  
  }, 
  droppedPin: function(){
    $('.dropped-pin').click(function(){
      pinDropped++;
      extraTime += 0.5;
    });  
    pinDropped = 0;
    extraTime = 0;
  },
  pickedUp: function(){
    $('.picked-up').click(function(){
      pickedUp++;
      extraTime -= 0.5;
    });
    pickedUp = 0;
    extraTime = 0;
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
      var fields = ['row', 'time', 'dropped', 'pickedUp', 'penalty', 'rowTime', 'points'];
      try {
        result = json2csv({ data: testData, fields: fields });
        app.createTable();
      } catch (err) {
        console.log(err);
      }
    }); 
  },
  clearEverything: function(){
    interval = clearInterval(interval);
    testData = [];
    pointsArray = [];
    minutes = 0;
    hundredths = 0;
    currentIndex = 0;
    extraTime = 0;
    pinDropped = 0;
    pickedUp = 0;

    $('.item-container').html('');
    $('.timer').html('00.00')
    $('.score').html('Score = ');
  },
  bindClickEvents: function(){
    app.startTimer();
    app.splitTimer();
    app.resetTimer();
    app.createCSV();
  }
};

module.exports = app;
