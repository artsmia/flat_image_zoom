var artworkInfo = '',
    tombstoneTimeout = '',
    tombstoneDuration = 4000,
    introTimeout = '',
    introDuration = 90000;
    
mejs.MediaFeatures.hasTouch = false;

function displayTombstone() {
    clearTimeout(tombstoneTimeout);
    $('.tombstone').stop(true, true).delay(250).fadeIn(150);
    tombstoneTimeout = setTimeout(function() {
        $('.tombstone').stop(true, true).fadeOut(250);
    }, tombstoneDuration);
}

function hideIntro() {
    clearTimeout(introTimeout);
    $('.intro').stop(true, true).fadeOut(500);
    introTimeout = setTimeout(function() {
        $('.intro').show();
    }, introDuration);
}

function swapInfo(index,slide){
    var $el = $(slide);
    $('.tombstone').html($el.children('.meta').html());  
    $('#myForm').html($el.children('.slide-article').html());
}

var zoomerTemplate = _.template($('#zoomer').html());
var lastSlideId = 'image-view-1';

function slideInit(){
   window.mySwipe = new Swipe(document.getElementById('slider'), {
       callback: function(index,slide) {
           displayTombstone();
           swapInfo(index,slide);
           if (Zoomer.zoomers[lastSlideId]) {
               Zoomer.zoomers[lastSlideId].map.centerImageAtExtents();
           }
           var videoId = lastSlideId + "_player";
           if ($('#' + videoId).length) {
               $(this).pause();
           }
           lastSlideId = slide.id; // record this so we know what we're leaving next time
       }
   });
   swapInfo(1, '.slide_index0');
}

$.getJSON('javascripts/test.json', function(data) {
    slides = data.slides;
    for (variable in slides) {
        var clss = "slide_index" + variable;
        slides[variable].zoomer_class = clss;
        $('.swipe-wrap').append(zoomerTemplate(slides[variable]));
        if (slides[variable].type == "zoomer") {
            Zoomer.zoom_image_by_class({"container":slides[variable].zoomer_class, "tileURL": slides[variable].zoomer_url, "imageWidth": slides[variable].zoomer_width, "imageHeight": slides[variable].zoomer_height});
        }
        $('.video-container video').mediaelementplayer({
            videoWidth: 1920,
            videoHeight: 1080,
            startVolume: 1,
            features: ['progress'],
            alwaysShowControls: true
        });
    };
    slideInit();
});

$(document).ready(function() {
    
    displayTombstone();
    
    $(document).on('click', function(event){
        displayTombstone();
        hideIntro();
    });
    
    $('#colorbox').on('click', function(event) {
        event.stopPropagation();
    });
    
    $('.info-link').on('click', function(event) {
        event.stopPropagation();
        event.preventDefault();

        $.colorbox({
            transition: 'none',
            width: '60%',
            initialWidth: '60%',
            fadeOut: 250,
            opacity: 0.8,
            inline:true, 
            href:"#myForm",
            onComplete: function() {
                $('#cboxLoadedContent article').scroller({
                    customClass: "walker-scroller",
                    trackMargin: 8,
                    handleSize: 60
                });
                if (!$('#cboxLoadedContent article').hasClass('scroller-active')) {
                    $('#cboxLoadedContent .article-wrapper').addClass('locked');
                }
            },
            onClosed: function() {
                $('.locked').removeClass('locked');
            }
        });
    });
    
});