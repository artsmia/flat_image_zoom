var lastSlideId = 'image-view-1',
    artworkInfo = '',
    tombstoneTimeout = '',
    tombstoneDuration = 3000,
    introTimeout = '',
    slides = {},
    introDuration = 60000,
    zoomer_template = _.template($('#zoomer').html());

function displayTombstone() {
   clearTimeout(tombstoneTimeout);
   $('.tombstone').stop(true, true).delay(250).fadeIn(150);
   tombstoneTimeout = setTimeout(function() {
       $('.tombstone').stop(true, true).fadeOut(250);
   }, tombstoneDuration);
}

function hideIntro() {
   clearTimeout(introTimeout);
   $('.intro-wrapper').hide();
   introTimeout = setTimeout(function() {
       $('.intro-wrapper').show();
   }, introDuration);
}
        
function slideInit(){
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

}   
    
    
$.getJSON('javascripts/test.json', function(data) {
  slides = data.slides;

  for (variable in slides) {
    var clss = "test_class" + variable;
    slides[variable].zoomer_class = clss;
    $(".swipe-wrap").append(zoomer_template(slides[variable]));
    if(slides[variable].type == "zoomer"){
      Zoomer.zoom_image_by_class({"container":slides[variable].zoomer_class, "tileURL": slides[variable].zoomer_url, "imageWidth": slides[variable].zoomer_width, "imageHeight": slides[variable].zoomer_height});
    }else if(slides[variable].type == "video"){
      MediaElement(slides[variable].player_id);
    }
    
  };
  slideInit();
});

       




$(document).ready(function() {   
    displayTombstone();
    L.DomUtil.disableTextSelection();
});

$(document).on("click", function(event){
  displayTombstone();
  hideIntro();
});

$('.info-link').on("click", function(event) {
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