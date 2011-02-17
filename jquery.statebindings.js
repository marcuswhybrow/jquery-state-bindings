(function($) {

    // Accepts a function or an array of functions an calls an
    // anonymous function with each as the only argument.
    function iterate(handlerInput, f) {
        if (handlerInput instanceof Array) {
            for (var i = 0; i < handlerInput.length; i++) {
                f(handlerInput[i]);
            }
        } else {
            f(handlerInput);
        }
    }

    // jQuery methods
    $.extend({
        stateBindings: {
            // Stores the current state
            state: null,

            // Stores the list of jQuery obejcts which the plugin is managing
            objects: [],

            liveObjects: [],

            // A method to set the state, and as a result of doing so, alter
            // the bindings active on the managed objects.
            setState: function(newState) {
                var previousState = $.stateBindings.state;
                var i, j, events, eventName, handlers;

                // Handle the live bindings
                for(i = 0; i < $.stateBindings.liveObjects.length; i++) {
                    var $liveObj = $.stateBindings.liveObjects[i];

                    // Remove the bindings for the previous state
                    if (previousState !== null) {
                        events = $liveObj.stateBindings[previousState];
                        for (eventName in events) {
                            handlers = events[eventName];

                            iterate(handlers, function(handler) {
                                $liveObj.die(eventName, handler);
                            });
                        }
                    }

                    // Add the bindings for the new state
                    events = $liveObj.stateBindings[newState];
                    for (eventName in events) {
                        handlers = events[eventName];

                        iterate(handlers, function(handler) {
                            $liveObj.live(eventName, handler);
                        });
                    }
                }

                // Handle the normal bindings
                for (i = 0; i < $.stateBindings.objects.length; i++) {
                    var $obj = $.stateBindings.objects[i];

                    // Remove the bindings for the previous state
                    if (previousState !== null) {
                        events = $obj.stateBindings[previousState];
                        for (eventName in events) {
                            handlers = events[eventName];
                            iterate(handlers, function(handler) {
                                $obj.unbind(eventName, handler);
                            });
                        }
                    }

                    // Add the bindings for the new state
                    events = $obj.stateBindings[newState];
                    for (eventName in events) {
                        handlers = events[eventName];
                        iterate(handlers, function(handler) {
                            $obj.bind(eventName, handler);
                        });
                    }
                }

                $.stateBindings.state = newState;
            }
        }
    });

    // jQuery object methods
    $.fn.extend({
        stateBindings: function(bindings, options) {
            var stateName, stateNames, finalBindings, events, eventName,
                eventNames, finalEvents;
            
            // Split apart state and event names.
            finalBindings = {};
            for (stateName in bindings) {
                stateNames = stateName.split(' ');
                for (var i = 0; i < stateNames.length; i++) {
                    events = bindings[stateName];
                    finalEvents = {};
                    for(eventName in events) {
                        eventNames = eventName.split(' ');
                        for (var j = 0; j < eventNames.length; j ++) {
                            finalEvents[eventNames[j]] =
                                bindings[stateName][eventName];
                        }
                    }
                    finalBindings[stateNames[i]] = finalEvents;
                }
            }
            
            console.log(finalBindings);
            
            var defaults = {
                live: false
            };
            
            var opts = $.extend(defaults, options);
            
            if (opts.live === true) {
                this.stateBindings = finalBindings;
                $.stateBindings.liveObjects.push(this);
            } else {
                // For each element which this method is executed upon
                return this.each(function() {
                    var $this = $(this);
                    $this.stateBindings = finalBindings;
                    $.stateBindings.objects.push($this);
                });
            }
        }
    });
})(jQuery);