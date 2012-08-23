SlideTabs = Class.create({
    initialize: function(myid, scroller, countItems, wheelScroll) {

        var elem = $(myid);
        if (!elem) {
            return;
        }

        var allSpans = $(myid).select('.slider-tabs .slider-tabs__header li span');
        var allContents = $(myid).select('.slider-tabs__content');
        if(allSpans.length >0){
            allSpans[0].up('li').addClassName('over');
        }

        this.countItems = countItems;
        this.wheelScroll = wheelScroll;

        if(allContents.length>0){
            allContents[0].addClassName('active');
            new SlideTabsScroller(allContents[0], countItems, this.wheelScroll);
        }



        allSpans.each(function(el, i){
            el.removeClassName('over');
            el.tabIdentifier = i;
            el.observe('click', this.showTab.bind(this));
        }.bind(this));

    },

    showTab: function (event) {
        var el = Event.element(event);
        var content_array = el.up('.slider-tabs').select('.slider-tabs__content');
        var tabs_array = el.up('li').up('ul').select('li');
        content_array.each(function(el){
            el.removeClassName('active');
        });

        tabs_array.each(function(el){
            el.removeClassName('over');
        });
        content_array[el.tabIdentifier].addClassName('active');

        el.up('li').addClassName('over');

        new SlideTabsScroller(content_array[el.tabIdentifier], this.countItems, this.wheelScroll);
    }
});

SlideTabsScroller = Class.create ({
    initialize: function(content, countItems, wheelScroll) {

        var width_slider  = 0;
        var width_feature = 0;

        // Focus on the slide area
        content.select('.slider-tabs__content__i').each(function(el, i){

            // To get the array of feature-products
            var array = el.select('.feature-products');

            if (width_feature == 0) {
                width_feature =  array[0].getWidth("width");
            }

            // Calculate the sliders width;
            width_slider = width_feature * array.length;

            // Set the width of slide area
            el.setStyle({
                width: width_slider + 'px'
                });

            var scrollBarBg  = el.up('.slider-tabs__content').select('.slider-tabs__scroller');
            var scrollHandle = el.up('.slider-tabs__content').select('.slider-tabs__scroller__handle');

            //$$('.slider-tabs__scroller').each(function(allSliderBase){allSliderBase.setStyle({display:'none'})});
            //$$('.slider-tabs__scroller__handle').each(function(allSliderHandle){allSliderHandle.setStyle({display:'none'})});

            if (array.length > countItems) {
                scrollHandle.each(function(handle){
                    handle.setStyle({
                        display:'block'
                    });
                });

                scrollBarBg.each(function(base){
                    base.setStyle({
                        display:'block'
                    });
                });

                var moveDistance = width_slider-width_feature*countItems;
                //alert(moveDistance);
                var test = new Control.Slider(scrollHandle[0], scrollBarBg[0], {
                    sliderValue: 0,
                    range: $R(0, moveDistance),
                    onSlide: function(v) {
                        el.setStyle({
                            left: (1-v) + 'px'
                            });
                    },
                    onChange: function(v) {
                        el.setStyle({
                            left: (1-v) + 'px'
                            });
                    }
                });

                function handle(delta) {
                    test.setValueBy(-delta*30);
                }

                function wheel(event){
                    var delta = 0;
                    if (!event)
                        event = window.event;
                    if (event.wheelDelta) {
                        delta = event.wheelDelta/120;
                        if (window.opera)
                            delta = delta;
                    } else if (event.detail) {
                        delta = -event.detail/3;
                    }

                    if (delta)
                        handle(delta);

                    if (event.preventDefault)
                        event.preventDefault();

                    event.returnValue = false;
                }

                if (wheelScroll == true) {
                    Event.observe(content, 'DOMMouseScroll', wheel);
                    Event.observe(content, 'mousewheel', wheel);
                }
            }

        });

    }

});

document.observe("dom:loaded", function() {
    $$(".cms-slider-tabs").each(function(el){
        new SlideTabs(el, false, 0);
    });
});
