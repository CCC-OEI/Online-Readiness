/*
 * JavaScript for handling OEI Online Readiness Tutorial #6
 * Online Reading Strategies
 *
 */

// checked box background color = #8cb3e4
// "Correct" background = #66851D
// "Incorrect" background = #7F2725
/*

  *** Why? What? How? Timing Map ***

  Home screen: 03:28.000
  Why: 03:35.000 (215s)
  What: 03:47.000 (227s)
  How: 04:02.000 (242s)
  Summary: 04:15.000 (255s)

  *** Exploring a Webpage Timing Map ***

  NOTE: Each article feedback segment concludes with a home screen,
  & pauses via metadata track so user can pick another article
  (or pick Next to move on)

  Home screen: 04:52.500
  Article 1 Feedback: 05:11.000 (311s)
  Article 2: 05:24.000 (324s)
  Article 3: 05:37.000 (337s)
  Article 4: 05:46.000 (346s)
  Article 5: 06:07.500 (367.5s)
  Article 6: 06:17.500 (377.5s)
  Article 7: 06:29.500 (389.5s)
  Article 8: 06:46.500 (406.5s)
  Summary/next segement: 00:06:57.500 (417.5s)

*/
$(document).on('ready',function() {

  // handle click on why, what, or how button
  $('.wwh-button').on('click',function(event) {
    var whichButton = $(this).attr('id');
    event.preventDefault();
    if (whichButton == 'why') {
      player.seekTo(215);
    }
    else if (whichButton == 'what') {
      player.seekTo(227);
    }
    else if (whichButton == 'how') {
      player.seekTo(242);
    }
    player.playMedia();
    $('.able-big-play-button').hide().attr('aria-hidden','true');
  });

  // handle click on webpage headlines
  $('.webpage-article').on('click',function() {
    var article = $(this).attr('id').substr(7,1);
    switch (article) {
      case '1':
        player.seekTo(311);
        break;
      case '2':
        player.seekTo(324);
        break;
      case '3':
        player.seekTo(337);
        break;
      case '4':
        player.seekTo(346);
        break;
      case '5':
        player.seekTo(367.5);
        break;
      case '6':
        player.seekTo(377.5);
        break;
      case '7':
        player.seekTo(389.5);
        break;
      case '8':
        player.seekTo(406.5);
        break;
    }
    player.playMedia();
  });

  // handle click on Next button
  $('.next').on('click',function(event) {
    var whichButton = $(this).attr('id');
    event.preventDefault();
    if (whichButton === 'wwh-next') {
      player.seekTo(255);
    }
    else if (whichButton === 'webpage-next') {
      player.seekTo(417.5);
    }
    player.playMedia();
  });

});