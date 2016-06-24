$(document).ready(function() {

  var windowWidth = $(window).width();
  var windowHeight = $(window).height();

  if (windowWidth < 1020) {
    // window is too narrow for tabs & video to exist side-by-side
    mobile = true;
  }
  else {
    mobile = false;
  }

  var iPhone, userAgent;
  userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.indexOf('iphone') !== -1) {
    iPhone = true;
    // show iPhone-specific help
    $('#help-iphone').show();
    $('#help-keyboard').hide();
  }
  else {
    iPhone = false;
    $('#help-iphone').hide();
    $('#help-keyboard').show();
  }

  // get hash from URL (#menu, #transcript, #resources, or #help)
  var hash;
  if(window.location.hash) {
    hash = window.location.hash.substring(1);
    if (hash === 'video' && !mobile) {
      // there is no video tab in non-mobile view
      hash = 'menu';
    }
    selectTab(hash, mobile);
  }
  else {
    hash = null;
    selectTab('menu', mobile); // default
  }

  // if user has been here before, prompt them about continuing where they left off
  if (hasCookie()) {
    promptUserAtStart(hash,mobile);
  }

  // calculate width and height of various elements

  var defaultWrapperWidth, videoDefaultWidth, videoDefaultHeight, aspectRatio,
    videoWidth, videoHeight;

  defaultWrapperWidth = 1250;

  $(window).on('load resize',function(event) {

    if (event.type === 'load') {
      // initializing for the first time
      videoDefaultWidth = $('#video1').attr('width');
      videoDefaultHeight = $('#video1').attr('height');
      aspectRatio = videoDefaultWidth/videoDefaultHeight;
    }

    // get current state
    windowWidth = $(window).width();
    // use #content to get video width
    // querying video width directly is less reliable across browsers
    // #content is reliable, and video spans 100% of its width
    videoWidth = $('#content').width();

    // calculate video height using known aspectRatio
    videoHeight = Math.round(videoWidth/aspectRatio);

    // asign calculated width and height values to wrapper
    $('#video-wrapper').css({
      'width': videoWidth + 'px',
      'height': videoHeight + 'px'
    });

    // make adjustments to other elements based on window size

    if (windowWidth < 1020) {
      // window is too narrow for tabs & video to exist side-by-side
      mobile = true;
    }
    else {
      mobile = false;
    }
    if (mobile) {
      // Assist responsive CSS with adjusting CSS sizes and visibility
      var wrapperHeight = windowHeight - $('header').height() - 10;
      var panelHeight = wrapperHeight - 10;
      var transcriptHeight = panelHeight - 5;
      var videoWidth = Math.min($video.attr('width'),windowWidth);
      if (currentTab === 'video') {
        // be sure video area is visible
        $('#content').show().attr('aria-hidden', 'false');
      }
      else {
        // be sure video area is hidden
        $('#content').hide().attr('aria-hidden', 'true');
        // adjust C
        $('#tabs-wrapper').css({
          'width': '100%',
          'height': windowHeight + 'px'
        });
        $('.panel').css({
          'height': panelHeight + 'px'
        });
        $('.able-transcript').css({
          'height': transcriptHeight + 'px'
        });
        $('#wrapper').css({
          'width': '98%',
          'height': 'auto'
        });
      }
    }
    else { // not mobile
      var videoWidth = $video.attr('width');
      var wrapperWidth = $('#wrapper').width();
      // be sure video area is visible
      $('#content').show().attr('aria-hidden', 'false');
      if (windowWidth < defaultWrapperWidth) {
        // this is a very narrow window; wrapper is no longer wide enough
        // need to resize #wrapper so it fits within window
        wrapperWidth = windowWidth - 5;
        $('#wrapper').css({
          'width': wrapperWidth + 'px',
          'height': 'auto'
        });
      }
      else {
        $('#wrapper').removeAttr('style');
      }
      if (currentTab === 'video') {
        // video can't be a tab in non-mobile view
        selectTab('menu',mobile);
      }

      // now calculate available width and height for #tabs-wrapper
      var tabsWrapperWidth = wrapperWidth - videoWidth - 45;
      var tabsWrapperHeight = $('.able-wrapper').outerHeight();
      // substract estimated height of #tablist
      var panelHeight = tabsWrapperHeight - 20;
      // subtract height of window toolbar, plus leave some cushion at bottom
      var transcriptHeight = panelHeight - 80;
      $('#tabs-wrapper').css({
        'width': tabsWrapperWidth + 'px',
        'height': tabsWrapperHeight + 'px'
      });
      var wrapperHeight = tabsWrapperHeight + $('header').height() + 100;
      $('#wrapper').css('height',wrapperHeight + 'px');
      if (currentTab === 'video') {
        // video can't be the selected tab in the non-mobile view
        selectTab('menu',mobile);
      }
      $('.able-transcript').css({
        'height': transcriptHeight + 'px'
      });
    }
  });

  // add a listener that checks for chapter changes
  $video.on('timeupdate',function() {
    if (chapter !== player.currentChapter.id) {
      // new chapter!
      // mark previous chapter as finished
      chapter = player.currentChapter.id;
      if (chapter) { // not null
        updateCookie(module,chapter,player.currentChapter.id);
        hideBigPlayButton(module,chapter);
      }
    }
  });

  // handle clicks on interactive elements within tab panels (mobile only)
  // Able Player advances the player based on these actions
  // but this code is needed to switch to the Video tab panel
  if (mobile) {
    $('#panel-menu').on('click','button',function() {
      selectTab('video', mobile);
      player.playMedia();
    });
    $('span.able-transcript-seekpoint').on('click',function() {
      selectTab('video', mobile);
      player.playMedia();
    });
  }

  // handle clicks on mobile-menu icon
  $('#mobile-menu').on('click',function() {
    if ($('#tablist').is(':hidden')) { // show it
      $('#tablist').addClass('mobile-visible').slideDown().attr({
        'aria-hidden': 'false'
      });
      $('#mobile-menu').attr({
        'aria-label': 'Hide menu',
        'aria-expanded': 'true'
      });
      // place focus on the first item in the menu
      $('#tablist li:first-child').focus();
    }
    else { // hide it
      $('#tablist').slideUp().attr({
        'aria-hidden': 'true'
      }).removeClass('mobile-visible');
      $('#mobile-menu').attr({
        'aria-label': 'Show menu',
        'aria-expanded': 'false'
      }).focus();
    }
  })

});

function hideBigPlayButton(module,chapter) {

  // some chapters are comprised of still images, not video
  // for these chapters, hide the Big Play Button
  var hideButton = false;
  if (module === 'studyTime') {
    if (chapter == 4) {
      hideButton = true;
    }
  }
  if (hideButton) {
    // Big Play Button is added dynamically
    // given a chance to be added before hiding it
    setTimeout(function() {
      $('.able-big-play-button').hide().attr('aria-hidden','true');
    }, 500);
  }
};

function selectTab(tab, mobile) {

  currentTab = tab;

  // hide all panels
  $('.panel').hide().attr('aria-hidden','true');

  // de-select all tabs
  $('.tab').removeClass('selected').attr({
    'tabindex': '-1',
    'aria-selected': 'false'
  });

  // then show the selected panel
  if (mobile) {
    if (tab === 'video') {
      $('#tabs-wrapper').css('height','2em');
      $('#content').show().attr('aria-hidden', 'false');
    }
    else {
      $('#content').hide().attr('aria-hidden', 'true');
      $('#panel-' + tab).show().attr('aria-hidden','false');
    }
  }
  else {
    $('#panel-' + tab).show().attr('aria-hidden','false');
  }

  // and select the selected tab
  $('#tab-' + tab).addClass('selected').attr({
    'tabindex': '0',
    'aria-selected': 'true'
  }).focus();
};

function setCookie (cookieValue) {

  // set the cookie with a lifetime of 90 days
  Cookies.set('OEI', cookieValue, { expires:90 });
};

function hasCookie () {

  // returns true if cookie is found; otherwise false
  if (Cookies.getJSON('OEI')) {
    return true;
  }
  else {
    return false;
  }
};

function getCookie () {

  // each array in cookie corresponds with a module
  // values stored in each array are the completed chapter indexes
  // this could ultimately be used to place a checkmark after each completed module
  // the last-session array is unique: It preserves the open tab, module name, and chapter index
  // where user left off (so user can be prompted to resume there)
  var defaultCookie = {
    lastChapter: 0,
    intro: [],
    tech: [],
    organizing: [],
    studyTime: [],
    communication: [],
    reading: [],
    career: [],
    educational: [],
    instructional: [],
    personal: [],
    financial: []
  };

  var cookie;
  try {
    cookie = Cookies.getJSON('OEI');
  }
  catch (err) {
    // Original cookie can't be parsed; update to default
    Cookies.getJSON(defaultCookie);
    cookie = defaultCookie;
  }
  if (cookie) {
    return cookie;
  }
  else {
    return defaultCookie;
  }
};

function getLastChapter () {

  // returns user's most recent chapter within the current module
  var cookie = getCookie();
  var moduleHistory = cookie[window.module]; // same as cookie.intro, cookie.tech, etc.
  if (typeof moduleHistory === 'undefined') {
    return 1;
  }
  var chaptersCompleted = moduleHistory.length;
  var lastChapter = moduleHistory[chaptersCompleted-1];
  return lastChapter;
};

function updateCookie (module, oldChapter, newChapter) {

    // Rebuild cookie for current cookie, replacing values passed to this function
    var cookie = getCookie();

    switch (module) {

      case 'intro':
        cookie.intro.push(oldChapter);
        break;

      case 'tech':
        cookie.tech.push(oldChapter);
        break;

      case 'organizing':
        cookie.organizing.push(oldChapter);
        break;

      case 'studyTime':
        cookie.studyTime.push(oldChapter);
        break;

      case 'communication':
        cookie.communication.push(oldChapter);
        break;

      case 'reading':
        cookie.reading.push(oldChapter);
        break;

      case 'career':
        cookie.career.push(oldChapter);
        break;

      case 'educational':
        cookie.educational.push(oldChapter);
        break;

      case 'instructional':
        cookie.instructional.push(oldChapter);
        break;

      case 'personal':
        cookie.personal.push(oldChapter);
        break;

      case 'financial':
        cookie.financial.push(oldChapter);
        break;
    }
    cookie.lastChapter = newChapter;
    cookie.lastModule = module;
    setCookie(cookie);
  };

  function promptUserAtStart(hash,mobile) {

    var defaultTab, lastChapter, $promptDiv, $promptLabel, $buttonDiv, $yesButton, $noButton, dialog;

    if (hash) {
      defaultTab = hash;
    }
    else {
      defaultTab = 'menu';
    }
    lastChapter = getLastChapter();
    $promptDiv = $('<div>',{
      'id': 'continue-dialog'
    });
    $promptP = $('<p>').attr('id','continue-prompt').text('Do you want to continue where you left off?');
    $buttonDiv = $('<div>').attr('id','yesNoButtons');
    $yesButton = $('<button>', {
      'type': 'button',
      'value': 'Yes'
    }).text('Yes').on('click',function() {
      player.seekToChapter(lastChapter);
      dialog.hide();
      selectTab(defaultTab,mobile);
    });;
    $noButton = $('<button>', {
      'type': 'button',
      'value': 'No'
    }).text('No').on('click',function() {
      dialog.hide();
      selectTab(defaultTab,mobile);
    });
    $buttonDiv.append($yesButton,$noButton);
    $promptDiv.append($promptP,$buttonDiv);
    $('body').append($promptDiv);
    dialog = new AccessibleDialog($promptDiv, $('#tab-menu'), 'dialog', 'Welcome back!', $promptP, 'Close', '32em');
    dialog.show();
  };
