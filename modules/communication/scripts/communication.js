/*
 * JavaScript for handling OEI Online Readiness Tutorial #5
 * Communication Skills for Online Learning
 *
 */

// checked box background color = #8cb3e4
// "Correct" background = #66851D
// "Incorrect" background = #7F2725
/*
  Email Netiquette Exercise Timing Map

  Questions:
    Q1 = 11:54.000
    Q2 = 12:35.000 (755s)
    Q3 = 13:30.000 (810s)

  Answers to each question:
    Q1 correct = 12:00.000 (720s)
    Q1 incorrect = 12:20.000 (740s)

    Q2 correct = 12:38.000 (758s)
    Q2 incorrect = 13:05.000 (785s)

    Q3 correct = 13:32.000 (812s)
    Q3 incorrect = 13:45.000 (825s)

  Scores:
    100% 14:00.000 (840s)
    66.66% 14:15.567 (855.567s)
    33.33% 14:27.833 (867.833s)
    0% 14:42.133 (882.133s)

  End times for first three score segements:
    when these times are reached, need to scrub ahead to 14:56.400 to complete RAR! segment
   14:15.567 ( end of 100% segment)
   14:27.833 (end of 66.66% segment)
   14:42.133 (end of 33.33% segment)

*/
$(document).on('ready',function() {

  // handle click on radio button
  $('div[role="radio"]').on('click',function(event) {
    var whichButton = $(this).attr('id');
    var buttonName = $(this).attr('name');
    var buttonNumber = buttonName.substr(5,1);
    var pointsIndex = buttonNumber - 1;
    var buttonChoice = whichButton.substr(6,1);
    // simple quiz - the first option is ALWAYS right
    $(this).attr('aria-checked','true');
    if (buttonChoice === 'a') { // correct!
      points[pointsIndex] = 1;
      // be sure the other button is unchecked
      $('#radio' + buttonNumber + 'b').attr('aria-checked','false');
    }
    else { // incorrect!
      points[pointsIndex] = 0;
      // be sure the other button is unchecked
      $('#radio' + buttonNumber + 'a').attr('aria-checked','false');
    }
  });

  // handle space or enter on radio button as clicks
  $('div[role="radio"]').on('keydown',function(event) {
    if (event.which === 32 || event.which === 13) { // space or enter
      $(this).click();
      event.stopPropagation();
    }
  });

  // handle click on submit button for each question
  $('button.submit').on('click',function(event) {
    var whichQuestion = $(this).attr('id').substr(6,1);
    if (whichQuestion == 1) {
      if (points[0] == 1) {
        player.seekTo(720);
      }
      else {
        player.seekTo(740);
      }
    }
    else if (whichQuestion == 2) {
      if (points[1] == 1) {
        player.seekTo(758);
      }
      else {
        player.seekTo(785);
      }
    }
    else if (whichQuestion == 3) {
      if (points[2] == 1) {
        player.seekTo(812);
      }
      else {
        player.seekTo(825);
      }
    }
    player.playMedia();
  });

  // handle click on Continue button
  $('button.continue').on('click',function(event) {
    var whichQuestion = $(this).attr('id').substr(8,1);
    if (whichQuestion == '1') {
      // go to question 2
      player.seekTo(755);
    }
    else if (whichQuestion == '2') {
      // go to question 3
      player.seekTo(810);
    }
    else if (whichQuestion == '3') {
      // calculate score and go to summary
      score = 0;
      for (var i=0; i<points.length; i++) {
        score += points[i];
      }
      if (score == 3) {
        player.seekTo(840);
      }
      else if (score == 2) {
        player.seekTo(855.567);
      }
      else if (score == 1) {
        player.seekTo(867.833);
      }
      else {
        player.seekTo(882.133);
      }
    }
    player.playMedia();
  });

  // add timeupdate event listener
  // to splice non-consecutive RAR segments together
  var sensitivity = 0.25; // watch for target end time within this range
  var timeX = 855.567;
  var timeY = 867.833;
  var timeZ = 882.133;
  var tx1 = timeX - sensitivity;
  var tx2 = timeX;
  var ty1 = timeY - sensitivity;
  var ty2 = timeY;
  var tz1 = timeZ - sensitivity;
  var tz2 = timeZ;
  var t = 0; // current time

  var video = $video[0];
  $video.on('timeupdate',function() {
    t = player.getElapsed();
    if ((score == 3 && (t >= tx1 && t <= tx2)) || (score == 2 && (t >= ty1 && t <= ty2)) || (score == 1 && (t >= tz1 && t <= tz2))) {
      player.seekTo(896.4);
    }
  });

});