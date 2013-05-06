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
    
    _V_('video1_player').ready(function(){
        // Store the video object
        var myPlayer = this; 
        // Make up an aspect ratio
        var aspectRatio = 264/640; 
        function resizeVideoJS(){
            var width = document.getElementById(myPlayer.id).parentElement.offsetWidth;
            var w=window.innerWidth;
            if (width > w){
                myPlayer.width(w).height( w * aspectRatio );
            } else {
                myPlayer.width(width).height( width * aspectRatio );
            }
        }
        // Initialize resizeVideoJS()
        resizeVideoJS();
        // Then on resize call resizeVideoJS()
        var id;
        $(window).resize(function() {
            clearTimeout(id);
            id = setTimeout(resizeVideoJS, 100);
        });
    });
    
    $('.tombstone').click(function() {
        artworkInfo = $(this).parent().children('.info').html();
        $.colorbox({
            html: artworkInfo
        });
    });

});