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
    
    Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    };
    
    function getNames(str) {
        if (str.length === 0)
            return [];
        
        return str.split(' ');
    }

    // jQuery methods
    $.extend({
        stateBindings: {
            // Stores the current state
            state: '',

            // Stores the list of jQuery obejcts which the plugin is managing
            objects: [],

            liveObjects: [],

            // A method to set the state, and as a result of doing so, alter
            // the bindings active on the managed objects.
            setState: function(newState) {
                var newStates = getNames(newState);
                var previousState = $.stateBindings.state;
                var previousStates = getNames(previousState);
                var i, j, events, eventName, handlers;

                // Handle the live bindings
                for(i = 0; i < $.stateBindings.liveObjects.length; i++) {
                    var $liveObj = $.stateBindings.liveObjects[i];

                    for (var j = 0; j < previousStates.length; j++) {
                        // Remove the bindings for the previous state
                        var state = previousStates[j];
                        if (! newStates.contains(state)) {
                            events = $liveObj.stateBindings[state];
                            for (eventName in events) {
                                handlers = events[eventName];

                                iterate(handlers, function(handler) {
                                    $liveObj.die(eventName, handler);
                                });
                            }
                        }
                    }
                    
                    for (var j = 0; j < newStates.length; j++) {
                        var state = newStates[j];
                        if (! previousStates.contains(state)) {
                            // Add the bindings for the new state
                            events = $liveObj.stateBindings[state];
                            for (eventName in events) {
                                handlers = events[eventName];

                                iterate(handlers, function(handler) {
                                    $liveObj.live(eventName, handler);
                                });
                            }
                        }
                    }
                }

                // Handle the normal bindings
                for (i = 0; i < $.stateBindings.objects.length; i++) {
                    var $obj = $.stateBindings.objects[i];
                    
                    for (var j = 0; j < previousStates.length; j++) {
                        var state = previousStates[j];
                        
                        if (! newStates.contains(state)) {
                            // Remove the bindings for the previous state
                            events = $obj.stateBindings[state];
                            for (eventName in events) {
                                handlers = events[eventName];
                                iterate(handlers, function(handler) {
                                    $obj.unbind(eventName, handler);
                                });
                            }
                        }
                    }
                    
                    for (var j = 0; j < newStates.length; j++) {
                        var state = newStates[j];
                        if (! previousStates.contains(state)) {
                            // Add the bindings for the new state
                            events = $obj.stateBindings[state];
                            for (eventName in events) {
                                handlers = events[eventName];
                                iterate(handlers, function(handler) {
                                    $obj.bind(eventName, handler);
                                });
                            }
                        }
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
                stateNames = getNames(stateName);
                for (var i = 0; i < stateNames.length; i++) {
                    events = bindings[stateName];
                    finalEvents = {};
                    for(eventName in events) {
                        eventNames = getNames(eventName);
                        for (var j = 0; j < eventNames.length; j ++) {
                            finalEvents[eventNames[j]] =
                                bindings[stateName][eventName];
                        }
                    }
                    finalBindings[stateNames[i]] = finalEvents;
                }
            }
            
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