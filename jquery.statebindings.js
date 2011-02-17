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
    
    Array.prototype.remove = function(element) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === element) {
                this.splice(i, 1);
            }
        }
    }
    
    Array.prototype.subtract = function(element) {
        // Create a new version of the array
        var a = this.slice();
        a.remove(element);
        return a;
    }
    
    function getNames(str) {
        if (str.length === 0)
            return [];
        
        return str.split(' ');
    }
    
    function forStateNotIn($obj, existingArray, newArray, f) {
        for (var j = 0; j < existingArray.length; j++) {
            // Remove the bindings for the previous state
            var state = existingArray[j];
            if (! newArray.contains(state)) {
                events = $obj.stateBindings[state];
                for (eventName in events) {
                    handlers = events[eventName];

                    iterate(handlers, function(handler) {
                        f($obj, eventName+'.stateBindings.'+state, handler);
                    });
                }
            }
        }
    }

    // jQuery methods
    $.extend({
        stateBindings: {
            // Stores the current state
            activeStates: [],

            // Stores the list of jQuery obejcts which the plugin is managing
            objects: [],

            liveObjects: [],

            // A method to set the state, and as a result of doing so, alter
            // the bindings active on the managed objects.
            setState: function(newState) {
                var newStates;
                if (newState instanceof Array) {
                    newStates = newState;
                } else {
                    newStates = getNames(newState);
                }
                var previousStates = $.stateBindings.activeStates;
                var i, j, events, eventName, handlers;

                // Handle the live bindings
                for(i = 0; i < $.stateBindings.liveObjects.length; i++) {
                    var $liveObj = $.stateBindings.liveObjects[i];
                    
                    forStateNotIn(
                        $liveObj, previousStates, newStates,
                        function($obj, eventName, handler) {
                            $obj.die(eventName, handler);
                        }
                    )
                    
                    forStateNotIn(
                        $liveObj, newStates, previousStates,
                        function($obj, eventName, handler) {
                            $obj.live(eventName, handler);
                        }
                    )
                }

                // Handle the normal bindings
                for (i = 0; i < $.stateBindings.objects.length; i++) {
                    var $obj = $.stateBindings.objects[i];
                    
                    forStateNotIn(
                        $obj, previousStates, newStates,
                        function($obj, eventName, handler) {
                            console.log('unbinding ' + eventName + ' ' + handler);
                            $obj.unbind(eventName, handler);
                        }
                    )
                    
                    forStateNotIn(
                        $obj, newStates, previousStates,
                        function($obj, eventName, handler) {
                            console.log('binding ' + eventName + ' ' + handler);
                            $obj.bind(eventName, handler);
                        }
                    )
                }

                $.stateBindings.activeStates = newStates;
            },
            
            addState: function(state) {
                if ($.stateBindings.activeStates.contains(state)) {
                    return false;
                } else {
                    var newStates =
                        $.stateBindings.activeStates.concat([state]);
                    $.stateBindings.setState(newStates);
                }
            },
            
            removeState: function(state) {
                var newStates = $.stateBindings.activeStates.subtract(state);
                $.stateBindings.setState(newStates);
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