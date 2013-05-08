var artworkInfo = '',
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
    
    $(document).on('click', function(event){
        displayTombstone();
        hideIntro();
    });
    
    $('.info-link').on('click', function(event) {
        event.stopPropagation();
        event.preventDefault();
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