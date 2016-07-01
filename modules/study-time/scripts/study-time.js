/*
 * JavaScript for handling OEI Online Readiness Tutorial #4
 * Online Study Skills and Managing Time
 *
 */

/*
  Personality Profile Timing Map
  Questions:
    Q1 = 2:10.000
    Q2 = 2:15.000
    Q3 = 2:20.000
    Q4 = 2:25.000
    Q5 = 2:30.000
    Q6 = 2:35.000
  Scores:
    6 = 2:40.000
    7 = 2:45.000
    8 = 2:50.000
    9 = 2:55.000
    10 = 3:00.000
    11 = 3:05.000
    12 = 3:10.000
    13 = 3:15.000
    14 = 3:20.000
    15 = 3:25.000
    16 = 3:30.000
    17 = 3:35.000
    18 = 3:40.000
    19 = 3:45.000
    20 = 3:50.000
    21 = 3:55.000
    22 = 4:00.000
    23 = 4:05.000
    24 = 4:10.000

    "Time management styles" iFrame Preview = 4:15.000
    iFrame (add iFrame as overlay) = 4:33.000
    Add "Next" button to bottom of iframe at 4:37.767
    Pause at 4:39.500 - 4:45.000

    Next chapter "Step 2" begins at 4:45

    At 7:03.333 expose links and pause

    Procrastination Checklist

      - each question has audio prompt
      - Expose radio buttons at indicated time (after audio prompt); include legend

    Row 1 = Audio starts at 00:10:39.567; form exposed at 10:45.000
    Row 2 = Audio starts at 00:10:50.000; form exposed at 10:55.733
    Row 3 = Audio starts at 00:11:00.000; form exposed at 11:10.000
    Row 4 = Audio starts at 00:11:15.000; form exposed at 11:19.533
    Row 5 = Audio starts at 00:11:25.000; form exposed at 11:31.000
    Row 6 = Audio starts at 00:11:35.000; form exposed at 11:43.600
    Results = 11:45.000

    Procrastination Pie
      When a pie slice has focus, display its hover background image
      Pie slices attain focus as follows:
      Slice 1 = clickable at 12:16.000; content appears at 12:17.000
      Slice 2 = clickable at 12:36.000; content appears at
      Slice 3 = clickable at 12:50.000;
      Slice 4 = 13:05.000;



*/
$(document).on('ready',function() {

  $('#begin-quiz').on('click',function() {
    player.seekToChapter(4);
  });
  $('#next-after-quiz').on('click',function() {
    player.seekToChapter(5);
    player.playMedia();
  });

  // Personality Profile quiz may need a nudge to trigger metadata
  var video = $video[0];
  var seconds = 0;
  $video.on('timeupdate',function() {
    seconds = player.getElapsed();
    if (seconds == 130) {
      if (!$('form#personality-profile fieldset:visible').length) {
        // none of the fieldsets are visible. Time for a gentle nudge...
        player.playMedia();
      }
    }
  });

  // handle clicks on faux radio buttons
  $('div.radio').on('click',function() {
    $(this).attr('data-checked','true');
    var radioId = $(this).attr('id').substr(5,2);
    var questionNumber = radioId.substr(0,1);
    // set data-checked to false for all radio buttons for this question
    $('#radio' + questionNumber + 'a').attr('data-checked','false');
    $('#radio' + questionNumber + 'b').attr('data-checked','false');
    $('#radio' + questionNumber + 'c').attr('data-checked','false');
    $('#radio' + questionNumber + 'd').attr('data-checked','false');
    // now set data-checked to true for the button that was just clicked
    $('#radio' + radioId).attr('data-checked','true');
    // click the corresponding real radio button
    $('#q' + radioId).click().focus();
  });

  // handle space and enter on faux radio buttons
  $('input[type="radio"]').on('keydown',function(event) {
    if (event.which === 32 || event.which === 13) { // space or enter
      var radioId = $(this).attr('id').substr(1,2);
      $('#radio' + radioId).click();
      event.stopPropagation();
    }
  });

  // mirror focus between real radio buttons and faux radio buttons
  $('input[type="radio"]').on('focus',function() {
    var radioId = $(this).attr('id').substr(1,2);
    var questionNumber = radioId.substr(0,1);
    // set data-focus to false for all radio buttons for this question
    $('#radio' + questionNumber + 'a').attr('data-focus','false');
    $('#radio' + questionNumber + 'b').attr('data-focus','false');
    $('#radio' + questionNumber + 'c').attr('data-focus','false');
    $('#radio' + questionNumber + 'd').attr('data-focus','false');
    // now set data-focus to true for the button that just received focus
    $('#radio' + radioId).attr('data-focus','true');
  });

  // when Next or Prev button receives focus, blur all faux radio buttons
  $('.next, .prev').on('focus',function(event) {
    var questionNumber = $(this).attr('id').substr(1,1);
    $('#radio' + questionNumber + 'a').attr('data-focus','false');
    $('#radio' + questionNumber + 'b').attr('data-focus','false');
    $('#radio' + questionNumber + 'c').attr('data-focus','false');
    $('#radio' + questionNumber + 'd').attr('data-focus','false');
  });

  $('.next, .prev').on('click',function(event) {
    event.preventDefault();
    var whichButton = $(this).text().toLowerCase();
    var buttonId = $(this).attr('id');
    if (buttonId == 'scrolling-next') {
      player.seekTo(285);
      player.playMedia();
    }
    else {
      var thisQuestion = parseInt(buttonId.substr(1,1));
      if (whichButton == 'prev') {
        var nextQuestion = thisQuestion - 1;
      }
      else {
        var nextQuestion = thisQuestion + 1;
        var thisAnswer = parseInt($('input[name=q' + thisQuestion + ']:checked').first().val());
        ppAnswers[thisQuestion] = thisAnswer;
      }
      switch (nextQuestion) {
        case 1:
          player.seekTo(130);
          break;
        case 2:
          player.seekTo(135);
          break;
        case 3:
          player.seekTo(140);
          break;
        case 4:
          player.seekTo(145);
          break;
        case 5:
          player.seekTo(150);
          break;
        case 6:
          player.seekTo(155);
          break;
        case 7:
          var ppScore = 0;
          for (var i=1; i<ppAnswers.length; i++) {
            ppScore += ppAnswers[i];
          }
          // there is no question 7!
          // route user to results page based on final score
          switch (ppScore) {
            case 6:
              player.seekTo(160);
              break;
            case 7:
              player.seekTo(165);
              break;
            case 8:
              player.seekTo(170);
              break;
            case 9:
              player.seekTo(175);
              break;
            case 10:
              player.seekTo(180);
              break;
            case 11:
              player.seekTo(185);
              break;
            case 12:
              player.seekTo(190);
              break;
            case 13:
              player.seekTo(195);
              break;
            case 14:
              player.seekTo(200);
              break;
            case 15:
              player.seekTo(205);
              break;
            case 16:
              player.seekTo(200);
              break;
            case 17:
              player.seekTo(215);
              break;
            case 18:
              player.seekTo(220);
              break;
            case 19:
              player.seekTo(225);
              break;
            case 20:
              player.seekTo(230);
              break;
            case 21:
              player.seekTo(235);
              break;
            case 22:
              player.seekTo(240);
              break;
            case 23:
              player.seekTo(245);
              break;
            case 24:
              player.seekTo(250);
              break;
          }
          break;
        }
      player.pauseMedia();
      $('.able-big-play-button').hide().attr('aria-hidden','true');
    } // end if not scrolling-next button
  });

  // handle click on procrastination checkbox
  // quiz is just to encourage thought; responses aren't scored
  $('.procras-checkbox').on('click',function() {
    $(this).attr('aria-checked','true');
    // be sure the other box is unchecked
    var whichQuestion = $(this).attr('name');
    var whichBox = $(this).attr('id').substr(3,1);
    if (whichBox == 'a') {
      $('#' + whichQuestion + 'b').attr('aria-checked','false');
    }
    else {
      $('#' + whichQuestion + 'a').attr('aria-checked','false');
    }
    // checking a box automatically advances to next question
    switch (whichQuestion) {
      case 'pq1':
        player.seekTo(650); // 10:50
        break;
      case 'pq2':
        player.seekTo(660); // 11:00
        break;
      case 'pq3':
        player.seekTo(675); // 11:15
        break;
      case 'pq4':
        player.seekTo(685); // 11:25
        break;
      case 'pq5':
        player.seekTo(695); // 11:35
        break;
      case 'pq6':
        player.seekTo(705); // 11:45; show results segment
        break;
    }
    player.playMedia();
  });

  // handle space and enter on procrastination checkbuttons
  $('.procras-checkbox').on('keydown',function(event) {
    if (event.which === 32 || event.which === 13) { // space or enter
      event.stopPropagation();
      $(this).click();
    }
  });

  // handle clicks on yummy slices of Procrastination Pie
  // slices must be consumed in order, 1-5
  // clicking anywhere on the pie = clicking on a slice
  $('#pie').on('click',function() {
    var newClass = 'ate' + pieSlice;
    $(this).attr('class',newClass);
    if (pieSlice == 1) {
      player.seekTo(737); // 12:17
    }
    if (pieSlice == 2) {
      player.seekTo(756); // 12:36
    }
    if (pieSlice == 3) {
      player.seekTo(770); // 12:50
    }
    if (pieSlice == 4) {
      player.seekTo(785); // 13:05
    }
    if (pieSlice == 5) {
      player.seekTo(800); // 13:20
    }
    pieSlice++;
    $(this).attr({
      'aria-label': 'Pie slice ' + pieSlice,
      'title': 'Pie slice ' + pieSlice
    });
    player.playMedia();
  });

  // handle space and enter on procrastination pie
  $('#pie').on('keydown',function(event) {
    if (event.which === 32 || event.which === 13) { // space or enter
      event.stopPropagation();
      $(this).click();
    }
  });


  // disable big play button during quiz chapters
  var video = $video[0];
  $video.on('timeupdate',function() {
    if (chapter == 4 || chapter == 9 || chapter == 10) {
      $('.able-big-play-button').hide().attr('aria-hidden','true');
    }
  });


});