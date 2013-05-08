var lastSlideId = 'image-view-1',
    artworkInfo = '',
    tombstoneTimeout = '',
    tombstoneDuration = 3000,
    introTimeout = '',
    introDuration = 60000;
    
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

$(document).ready(function() {
    
    displayTombstone();
    
    var data1 = { title: "Title1",artist: "artist1",year: "year1",text: "text1"}
    var data2 = { title: "Title2",artist: "artist2",year: "year2",text: "text2",video_src: "http://video-js.zencoder.com/oceans-clip.mp4" }
    var video_template = _.template($('#video').html());
    var zoomer_template = _.template($('#zoomer').html());
    $(".swipe-wrap").append(zoomer_template(data1));
    $(".swipe-wrap").append(video_template(data2));
      
      window.mySwipe = new Swipe(document.getElementById('slider'), {
          callback: function(index,slide) {
              //console.log(slide.id)
              if (Zoomer.zoomers[lastSlideId]) {
                  Zoomer.zoomers[lastSlideId].map.centerImageAtExtents();
              }
              var videoId = lastSlideId+"_player";
              if ($('#'+videoId).length) {
                  var myPlayer = _V_(videoId);
                  if (myPlayer) {
                      myPlayer.pause();
                      //myPlayer.currentTime(0); // removes image? Maybe poster would help?
                  }
              }
              lastSlideId = slide.id; // record this so we know what we're leaving next time
          }
      });
      L.DomUtil.disableTextSelection();
      //Zoomer.zoom_image_by_class({"container":"image-view-2", "tileURL": "https://stewart.walkerart.org/zoomtest/wac_786/{z}_{x}_{y}.jpg", "imageWidth": 4000, "imageHeight": 3187});
      Zoomer.zoom_image_by_class({"container":"image-view-1", "tileURL": "http://cdn{s}.walkerart.org/wac_786/{z}_{x}_{y}.jpg", "imageWidth": 4000, "imageHeight": 3187});
      //Zoomer.zoom_image_by_class({"container":"image-view-1", "tileURL": 'https://stewart.walkerart.org/zoomtest/wac_1729/{z}_{x}_{y}.jpg', "imageWidth": 2560, "imageHeight": 1702});
      //Zoomer.zoom_image_by_class({"container":"image-view-3", "tileURL": "https://stewart.walkerart.org/zoomtest/wac_3691/{z}_{x}_{y}.jpg", "imageWidth": 1445, "imageHeight": 1920});
      //Zoomer.zoom_image_by_class({"container":"image-view-4", "tileURL": "https://stewart.walkerart.org/zoomtest/wac_11156/{z}_{x}_{y}.jpg", "imageWidth": 5920, "imageHeight": 3893});
      
    MediaElement('player1');
    
    $(document).click(function() {
        displayTombstone();
        hideIntro();
    });
    
    $('.info-link').click(function(event) {
        event.stopPropagation();
        event.preventDefault();
        //artworkInfo = $(this).parent().children('.info').html();
        artworkInfo = '<article class="info">\
                           <p>Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. <em>Praesent id metus massa, ut blandit odio.</em> Proin quis tortor orci. Etiam at risus et lorem ipsum.</p>\
                           <p>Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.</p>\
                       </article>';
        $.colorbox({
            transition: 'none',
            width: '60%',
            initialWidth: '50%',
            fadeOut: 250,
            opacity: 0.8,
            html: artworkInfo
        });
    });

});