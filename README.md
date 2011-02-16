jQuery State Bindings
=====================

This is a plugin for the JavaScript library jQuery. It is not yet complete but will however work in the following way:

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