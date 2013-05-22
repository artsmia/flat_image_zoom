var artworkInfo = '',
    slides = '',
    variable = '',
    clss = '',
    slideHasVideo = false,
    playing = false,
    tombstoneTimeout = '',
    introTimeout = '',
    zoomerTemplate = _.template($('#zoomer').html()),
    lastSlideId = 'image-view-1';
 
mejs.MediaFeatures.hasTouch = false;

function showTombstone() {
    clearTimeout(tombstoneTimeout);
    if (slideHasVideo === true) {
        $('.tombstone').addClass('on-video-slide');
    } else {
        $('.tombstone').removeClass('on-video-slide');
    }
    $('.tombstone').stop(true, true).delay(250).fadeIn(150);
    tombstoneTimeout = setTimeout(function() {
        $('.tombstone').stop(true, true).fadeOut(250);
    }, 5000);
}

function hideIntro() {
    clearTimeout(introTimeout);
    $('.intro').stop(true, true).fadeOut(500);
    introTimeout = setTimeout(function() {
          $('.intro').show();
          mySwipe.slide(1, 0);
    }, 9000);
}

function swapInfo(index, slide) {
    var $el = $(slide);
    $('.tombstone').html($el.children('.meta').html());
    $('#info').html($el.children('.slide-article').html());
}

lastSlideStack = [];

function slideInit() {
    window.mySwipe = new Swipe(document.getElementById('slider'), {
        callback: function(index, slide) {
            if ($(slide).hasClass('video')) {
                slideHasVideo = true;
            } else {
                slideHasVideo = false;
            }
            showTombstone();
            swapInfo(index, slide);
            if (Zoomer.zoomers[lastSlideId]) {
                lastSlideStack.push(lastSlideId);
                setTimeout(function() {
                    var lastId = lastSlideStack.pop();
                    if (lastId.indexOf('_dummy') < 0) {
                        console.log("recenter: " +lastId);
                        Zoomer.zoomers[lastId].map.centerImageAtExtents();
                    }
                }, 500);
            }
            for (var i = 0; i < $('.video-container video').length; i++) {
              $('.video-container video')[i].pause();
              $('.video-container video')[i].setCurrentTime(0);
            }
            var videoId = '#' + lastSlideId;
            if ($(videoId).hasClass('video')) {
                $el = $(videoId);
                $el.find('.mejs-poster').css("display", "block");
                $el.find('.mejs-overlay-button').css("display", "block");
                $el.find('.mejs-overlay-play').css("display", "block");
            }
            
            
            lastSlideId = slide.id; // record this so we know what we're leaving next time
        }
    });
    lastSlideId = window.mySwipe.slides[window.mySwipe.index].id;
    swapInfo(1, '.slide-index-0');
    setTimeout(initDone,500);
}

function initDone() {
    console.log('init done');
    console.log(window.mySwipe.slides);
    console.log(Zoomer.zoomers[window.mySwipe.slides[0].id]);
    console.log(Zoomer.zoomers[window.mySwipe.slides[window.mySwipe.slides.length-1].id]);
    var z = Zoomer.zoomers[window.mySwipe.slides[0].id];
    z.map.options.touchZoom = false;
    z.map.options.dragging = false;
    z.map.options.doubleClickZoom = false;
    z = Zoomer.zoomers[window.mySwipe.slides[window.mySwipe.slides.length-1].id];
    z.map.options.touchZoom = false;
    z.map.options.dragging = false;
    z.map.options.doubleClickZoom = false;
    
    $('.video-container video').on('playing',function(e) {
      clearTimeout(introTimeout);
    }).on('pause',function(e) {
      hideIntro();
    }).on('ended',function(e) {
      hideIntro();
    });
}


$.getJSON('javascripts/garden.json', function(data) {
    slides = data.slides;
    for (var variable in slides) {
        if (slides[variable]) {
            slides[variable].zoomer_class = 'slide-index-' + variable;
            slides[variable].id = 'video'+variable;
            slides[variable].player_id = 'player'+variable;
            $('.swipe-wrap').append(zoomerTemplate(slides[variable]));
            if (slides[variable].type === 'zoomer') {
                Zoomer.zoom_image_by_class({'container': slides[variable].zoomer_class, 'tileURL': slides[variable].zoomer_url, 'imageWidth': slides[variable].zoomer_width, 'imageHeight': slides[variable].zoomer_height});
            }
        }
    }
    
    $('.video-container video').mediaelementplayer({
        videoWidth: 1920,
        videoHeight: 1080,
        startVolume: 1,
        features: ['progress'],
        alwaysShowControls: true
    });
    setTimeout(slideInit, 500); // don't initialize swipe until the zoomers are loaded
});

$(document).ready(function() {

    showTombstone();

    if (Modernizr.touch) {
        $(document).on('touchstart', function() {
            showTombstone();
            hideIntro();
        });
        $('body').attr('oncontextmenu', 'return false');
    } else {
        $(document).on('mousedown', function() {
            showTombstone();
            hideIntro();
        });
    }

    $('nav a').on('click', function(event) {
        event.stopPropagation();
    });

    $('#colorbox').on('click', function(event) {
        event.stopPropagation();
    });

    $('.info-link').on('click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        
        for (var i = 0; i < $('.video-container video').length; i++) {
          $('.video-container video')[i].pause();
        }
        
        $.colorbox({
            transition: 'none',
            width: '60%',
            initialWidth: '60%',
            fadeOut: 250,
            opacity: 0.8,
            inline: true,
            href: '#info',
            onComplete: function() {
                $('#cboxLoadedContent article').scroller({
                    customClass: 'walker-scroller',
                    trackMargin: 8,
                    handleSize: 60
                });
                if (!$('#cboxLoadedContent article').hasClass('scroller-active')) {
                    $('#cboxLoadedContent .info-wrapper').addClass('locked');
                }
            },
            onClosed: function() {
                $('.locked').removeClass('locked');
            }
        });
    });

});
