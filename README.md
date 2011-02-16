jQuery State Bindings
=====================

This is a plugin for the JavaScript library jQuery. 

Example usage
-------------

    $('#myElement').stateBindings({
        'editing': {
            'click': function(e) {
                console.log('Just clicked my element whilst editing');
            }
        },
        'viewing': {
            'click': function(e) {
                console.log('Just clicked my element whilst viewing');
            }
        }
    });

You should then set the initial state for your bindings:

    $.stateBindings.setState('viewing');

And then in the future you can change the state using the same method:

    $.stateBindings.setState('editing');

What This Plugin Does
---------------------

When you call `$('#myElement').stateBindings({...});` you are specifying a bunch of jQuery event handlers which will be attached to events originating from the selected jQuery object only when the state is changed (via a special method) to a particular string.

This allows you to define separate event handlers to be used in different circumstances within your web application or page. Event handlers are swapped in or out whenever the global *state* of the plugin is changed as follows:

    $.stateBindings.setState('newState');

This call will first unbind all of the event handlers specified under the current **state name**, and then bind all event handlers specified under the 'newState' state name.

The `stateBindings({...})` method accepts an object literal of the following format:

    {
        'stateName1': {
            'eventName1': function() { alert('eventName1 fired'); },
            'eventName2': someOtherfunctionName,
            'eventName3': [functionName1, functionName2, functionName3],
            ...
            'eventNameN': []
        },
        'stateName2': {},
        'stateName3': {},
        ...
        'stateNameN': {}
    }

For each event name (which corresponds to the jQuery event names) you can specify one of three things:

* An anonymous function
* A function name
* A array containing any of the above.

More Information
----------------

This is currently the only documentation for this plugin, for more information you could always end me (Marcus Whybrow) an email at [mailto:jquery-state-bindings@marcuswhybrow.net](jquery-state-bindings@marcuswhybrow.net).