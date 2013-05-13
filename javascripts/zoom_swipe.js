/*jslint nomen: true, sloppy: true */
/*global $: false, Swipe: false, Zoomer: false, L: false, console: false, clearInterval: false, clearTimeout: false, document: false, event: false, frames: false, history: false, Image: false, location: false, name: false, navigator: false, Option: false, parent: false, screen: false, setInterval: false, setTimeout: false, window: false, XMLHttpRequest: false */

// swipe.js compatibility for swiping / panning logic
// override select methods in Leaflet and Swipe.js to allow control over who gets the drag events

// unfortunately have to use class here, so...

var Zoomer = Zoomer || {};
Zoomer.guidCounter = 0; // use this to generate unique IDs for containers

Zoomer.zoom_image_by_class = function (zoomoptions) {
    Zoomer.loadExtraTiles = window.location.href.indexOf('longSwipe') !== -1 ? 2 : 6; // load full zoom extents 
    var baseContainer = zoomoptions['container'];
    $('.' + zoomoptions['container']).each(function() {
        var containerId = baseContainer + Zoomer.guidCounter++;
        $(this).attr('id', containerId);
        var savedHtml = $(this).innerHTML;
        zoomoptions['container'] = containerId;
        Zoomer.zoom_image(zoomoptions);
        if (savedHtml) {
            this.insertBefore(savedHtml, this.firstChild);
        }
    });
}

// override Draggable so we can control who gets the panning events: swipe library or leaflet
L.Draggable = L.Draggable.extend({
    _onDown: function (e) {
        // WAC_START 
        this._verticalPan = undefined;
        // WAC_END 
        if ((!L.Browser.touch && e.shiftKey) ||
                ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }

        // WAC_START 
        var map = Zoomer.getParentMapForElement(e.target);
        if (!L.Browser.touch || typeof Swipe !== 'function' || map._zoom > map.getMinZoom()) {
            // this is our event, we're going to drag. Don't pass to swipe library.
            // NS - actually, swipe can have the start: we ignore the move if we need to.
            L.DomEvent.preventDefault(e);
            L.DomEvent.stopPropagation(e);
        }
        // WAC_END 

        if (L.Draggable._disabled) { return; }

        this._simulateClick = true;

        if (e.touches && e.touches.length > 1) {
            this._simulateClick = false;
            clearTimeout(this._longPressTimeout);
            return;
        }

        var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
            el = first.target;

        if (L.Browser.touch && el.tagName.toLowerCase() === 'a') {
            L.DomUtil.addClass(el, 'leaflet-active');
        }

        this._moved = false;
        if (this._moving) { return; }

        this._startPoint = new L.Point(first.clientX, first.clientY);
        this._startPos = this._newPos = L.DomUtil.getPosition(this._element);

        //Touch contextmenu event emulation
        if (e.touches && e.touches.length === 1 && L.Browser.touch && this._longPress) {
            this._longPressTimeout = setTimeout(L.bind(function () {
                var dist = (this._newPos && this._newPos.distanceTo(this._startPos)) || 0;

                if (dist < L.Draggable.TAP_TOLERANCE) {
                    this._simulateClick = false;
                    this._onUp();
                    this._simulateEvent('contextmenu', first);
                }
            }, this), 1000);
        }

        L.DomEvent.on(document, L.Draggable.MOVE[e.type], this._onMove, this);
        L.DomEvent.on(document, L.Draggable.END[e.type], this._onUp, this);
    },
    _onMove: function (e) {
        if (e.touches && e.touches.length > 1) { return; }

        var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
            newPoint = new L.Point(first.clientX, first.clientY),
            diffVec = newPoint.subtract(this._startPoint);

        if (!diffVec.x && !diffVec.y) { return; }

        // WAC_START 
        var map = null;
        
        if (e.target) {
            if ( typeof e.target._layer !== "undefined") {
                map = e.target._layer._map;
            } else if (Zoomer.zoomers[e.target.id]) {
                map = Zoomer.zoomers[e.target.id].map;
            }
        }
        if (!L.Browser.touch || typeof Swipe !== 'function') {
            L.DomEvent.preventDefault(e);
        }
        if (map && this._verticalPan === undefined) {
            this._verticalPan = !!(this._verticalPan || ((map.isAtEastEdge() && map.isAtWestEdge()) && Math.abs(diffVec.x) < Math.abs(diffVec.y)));
        }
        if (L.Browser.touch && (!map || (diffVec.x > 0 && map.isAtEastEdge()) || (diffVec.x < 0 && map.isAtWestEdge()))) {
            // they are at the edge or otherwise not panning leaflet any more. Skip the pan animation
            if (map && this._verticalPan && (map._zoom > map.getMinZoom())) {
                // vertical panning is allowed on vertical images if they're zoomed at all.
                // not a swipe event, we want it but remove the X
                diffVec.x = 0;
            } else {
                this._simulateClick = false; // this prevents click action
                return;
            }
        }
        // WAC_END

        if (!this._moved) {
            this.fire('dragstart');
            this._moved = true;

            this._startPos = L.DomUtil.getPosition(this._element).subtract(diffVec);

            if (!L.Browser.touch) {
                L.DomUtil.disableTextSelection();
                this._setMovingCursor();
            }
        }

        this._newPos = this._startPos.add(diffVec);
        this._moving = true;

        L.Util.cancelAnimFrame(this._animRequest);
        this._animRequest = L.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
    }
});

Swipe.prototype.handleEvent = function(e) {
    switch (e.type) {
      case 'touchstart': this.onTouchStart(e); break;
      case 'touchmove': this.onTouchMove(e); break;
      case 'touchend': this.onTouchEnd(e); break;
      case 'webkitTransitionEnd':
      case 'msTransitionEnd':
      case 'oTransitionEnd': // opera 11 and below
      case 'otransitionend': // opera 12 (and above?)
      case 'transitionend': this.onTransitionEnd(e); break;
      case 'resize': this.setup(); break;
    }
    
    //e.stopPropagation();
};

// custom current slide ID
Swipe.prototype.getCurrentSlideId = function () {
    if (!this.slides) {
        return this.element.children[0].id;
    }
    return this.slides[this.index].id;
}
Swipe.prototype.getPreviousSlideId = function () {
    return this.previousSlideId;
}
// custom START: gutter extension
Swipe.prototype.setup = function() {
    // WAC CUSTOM START
    if (this.element.children.length < 2) {
        this.container.style.visibility = 'visible';
        return;
    }
    if (!this.slides) {
        this.element.appendChild(this.element.children[0].cloneNode(true))
        this.element.insertBefore(this.element.children[this.element.children.length-2].cloneNode(true), this.element.firstChild);
        this.index++;
    }
    this.gutter = 10;
    this.currentSlideId = this.element.children[0].id;
    this.previousSlideId = this.element.children[0].id;
    
    this.slideDuration = window.location.href.indexOf('longSwipe') !== -1 ? 500 : 250; // 250 if small, 500 if big
    // WAC CUSTOM END

    // get and measure amt of slides
    this.slides = this.element.children;
    this.length = this.slides.length;
    this.cache = new Array(this.length);

    // return immediately if their are less than two slides
    if (this.length < 2) return;

    // determine width of each slide
    this.width = this.container.getBoundingClientRect().width + (this.gutter * 2) || this.container.offsetWidth;

    // return immediately if measurement fails
    if (!this.width) return;

    // store array of slides before, current, and after
    var refArray = [[],[],[]];

    this.element.style.width = (this.slides.length * this.width) + 'px';

    // stack elements
    for (var index = this.length - 1; index > -1; index--) {

      var elem = this.slides[index];

      elem.style.width = this.width - (this.gutter * 2) + 'px';
      elem.setAttribute('data-index', index);
      elem.style.marginLeft = this.gutter +'px';
      elem.style.marginRight = this.gutter + 'px';

      if (this.browser.transitions) {
        elem.style.left = (index * -this.width) - this.gutter + 'px';
      }

      // add this index to the reference array    0:before 1:equal 2:after
      refArray[this.index > index ? 0 : (this.index < index ? 2 : 1)].push(index);

    }

    if (this.browser.transitions) {
      
      // stack left, current, and right slides
      this._stack(refArray[0],-1);
      this._stack(refArray[1],0);
      this._stack(refArray[2],1);

    } else {
      // move "viewport" to put current slide into view
      this.element.style.left = (this.index * -this.width)+"px";
    }

    this.container.style.visibility = 'visible';

};
Zoomer.isPinching = undefined;
Swipe.prototype.onTouchMove = function(e) {
    var _this = this;

    // ensure swiping with one touch and not pinching
    if(e.touches.length > 1 || e.scale && e.scale !== 1) {
        // WAC CUSTOM START
        Zoomer.isPinching = true;
        return;
        // WAC CUSTOM END
    }
    if (Zoomer.isPinching) {
        _this.start.pageX = e.touches[0].pageX;
        Zoomer.isPinching = undefined;
    }
    _this.deltaX = e.touches[0].pageX - _this.start.pageX;

    // determine if scrolling test has run - one time test
    if ( typeof _this.isScrolling == 'undefined') {
      _this.isScrolling = !!( _this.isScrolling || Math.abs(_this.deltaX) < Math.abs(e.touches[0].pageY - _this.start.pageY) );
    }

    // custom START
    if (e.target && typeof e.target._layer !== "undefined") {
        var map = e.target._layer._map;
        map._getEdgeDeltas(); // load these once
        if (map && !((_this.deltaX > 0 && map.isAtEastEdge()) || (_this.deltaX < 0 && map.isAtWestEdge()))) {
            // they are inside the image and the touch should go to leaflet to pan.
            e.preventDefault();
            return this.onTouchStart(e);
        }
    }
    // custom END

    // if user is not trying to scroll vertically
    if (!_this.isScrolling) {

      // prevent native scrolling 
      e.preventDefault();

      // cancel slideshow
      _this.delay = 0;
      clearTimeout(_this.interval);

      // increase resistance if first or last slide
      _this.deltaX = 
        _this.deltaX / 
          ( (!_this.index && _this.deltaX > 0               // if first slide and sliding left
            || _this.index == _this.length - 1              // or if last slide and sliding right
            && _this.deltaX < 0                            // and if sliding at all
          ) ?                      
          ( Math.abs(_this.deltaX) / _this.width + 1 )      // determine resistance level
          : 1 );                                          // no resistance if false
      
      // translate immediately 1:1
      _this._move([_this.index-1,_this.index,_this.index+1],_this.deltaX);

    } else if (_this.disableScroll) {

      // prevent native scrolling 
      e.preventDefault();

    }
};

// use slideDuration to allow for bigger screen interaction
Swipe.prototype.onTouchEnd = function (e) {

    var _this = this;

    // determine if slide attempt triggers next/prev slide
    var isValidSlide = 
          Number(new Date()) - _this.start.time < _this.slideDuration      // if slide duration is less than 250ms
          && Math.abs(_this.deltaX) > 20                   // and if slide amt is greater than 20px
          || Math.abs(_this.deltaX) > _this.width/2,        // or if slide amt is greater than half the width

    // determine if slide attempt is past start and end
        isPastBounds = 
          !_this.index && _this.deltaX > 0                          // if first slide and slide amt is greater than 0
          || _this.index == _this.length - 1 && _this.deltaX < 0,    // or if last slide and slide amt is less than 0
        
        direction = _this.deltaX < 0; // true:right false:left

    // if not scrolling vertically
    if (!_this.isScrolling) {

      if (isValidSlide && !isPastBounds) {
        if (direction) {
          _this._stack([_this.index-1],-1);
          _this._slide([_this.index,_this.index+1],-_this.width,_this.speed);
          _this.index += 1;
        } else {
          _this._stack([_this.index+1],1);
          _this._slide([_this.index-1,_this.index],_this.width,_this.speed);
          _this.index += -1;
        }
        _this.callback(_this.index, _this.slides[_this.index]);
      } else {
        _this._slide([_this.index-1,_this.index,_this.index+1],0,_this.speed);
      }

    }

  },


Swipe.prototype.onTransitionEnd = function (e) {
    if (this._getElemIndex(e.target) == this.index) { // only call transition end on the main slide item
        
        this.previousSlideId = this.slides[this.index].id;
        
        if (this.index == 0) this.slide(this.slides.length-2, 0)
        if (this.index == this.slides.length-1) this.slide(1, 0)
        if (this.delay) this.begin();

        this.transitionEnd(this.index, this.slides[this.index]);
        this.currentSlideId = this.slides[this.index].id;
    }
};

Swipe.prototype.getPos = function() {
    // return current index position with awareness it may be called on "dummy slide"
    var index = this.index;
    if (this.index == 0) index = this.slides.length-2;
    if (this.index == this.slides.length-1) index = 1;
    return index-1;
};

