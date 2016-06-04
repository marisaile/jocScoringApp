
import $ from 'jquery';
import 'styles/main.scss';
import mainPage from 'components/mainPage';
import todos from 'pages/todo-backbone';
import funnySquares from 'pages/funnySquares';
import project from 'pages/project';
import jsTimer from 'pages/jsTimer';
import d3 from 'pages/d3';
import three from 'pages/three';

$(function() {

  mainPage.init();


  var url = window.location.pathname;

  // our first javascript router!
  switch (url) {
    case '/pages/todo.html':
      todos.render();
    break;
    case '/pages/funnySquares.html':
      funnySquares.init();
    break;
    case '/pages/projectHome.html':
      project.init();
    break;
    case '/pages/d3.html':
      d3.init();
    break;
    case '/pages/three.html':
      three.init();
    break;
    case '/pages/jsTimer.html':
      jsTimer.init();
    break;
  }

  // Fancy Console Message for Developers
  console.log("===========I am looking for a job!============");
  console.log("==============================================");
  console.log("=========check out my github account==========");
  console.log("==============================================");
  console.log("==============================================");
  

});
