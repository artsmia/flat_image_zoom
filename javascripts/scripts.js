var lastSlideId = 'image-view-1',
    artworkInfo = '';

$(document).ready(function() {
    
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
    Zoomer.zoom_image_by_class({"container":"image-view-2", "tileURL": "https://stewart.walkerart.org/zoomtest/wac_786/{z}_{x}_{y}.jpg", "imageWidth": 4000, "imageHeight": 3187});
    Zoomer.zoom_image_by_class({"container":"image-view-1", "tileURL": "http://cdn{s}.walkerart.org/wac_786/{z}_{x}_{y}.jpg", "imageWidth": 4000, "imageHeight": 3187});
    //Zoomer.zoom_image_by_class({"container":"image-view-1", "tileURL": 'https://stewart.walkerart.org/zoomtest/wac_1729/{z}_{x}_{y}.jpg', "imageWidth": 2560, "imageHeight": 1702});
    Zoomer.zoom_image_by_class({"container":"image-view-3", "tileURL": "https://stewart.walkerart.org/zoomtest/wac_3691/{z}_{x}_{y}.jpg", "imageWidth": 1445, "imageHeight": 1920});
    Zoomer.zoom_image_by_class({"container":"image-view-4", "tileURL": "https://stewart.walkerart.org/zoomtest/wac_11156/{z}_{x}_{y}.jpg", "imageWidth": 5920, "imageHeight": 3893});
    
    //MediaElement('player1', {success: function(me) {
    //    me.play();
    //
    //    me.addEventListener('timeupdate', function() {
    //        document.getElementById('time').innerHTML = me.currentTime;
    //    }, false);
    //
    //    document.getElementById('pp')['onclick'] = function() {
    //        if (me.paused)
    //            me.play();
    //        else
    //            me.pause();
    //    };
    //
    //}});
    
    $('.tombstone').click(function() {
        //artworkInfo = $(this).parent().children('.info').html();
        artworkInfo = '<article class="info">\
                           <p>Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et.</p>\
                           <p>Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus. Mauris.</p>\
                       </article>';
        $.colorbox({
            transition: 'fade',
            width: '50%',
            height: '90%',
            speed: 150,
            fadeOut: 250,
            opacity: 0.6,
            html: artworkInfo
        });
    });

});