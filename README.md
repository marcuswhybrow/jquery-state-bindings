jQuery State Bindings
=====================

This is a plugin for the JavaScript library jQuery, which allows you to group 
you event bindings. These groups can then be enabled or disabled based upon 
the global "state" of your page.

For example imagine you have an element on you page with an ID of "littleMan". 
When we click on him and he is in an *angry* state, then he may turn red. On 
the other hand if he is in a *happy* state when we click, he might turn green.

    $('#littleMan').stateBindings({
        'angry': {
            'click': function(event) {
                // He's mad, make him turn red!
            }
        },
        'happy': {
            'click': function(event) {
                // Phew, the little man is relaxed, Make him turn green.
            }
        },
    });
    
    // Important - set the initial state of the little man
    $.stateBindings.addState('angry');

Events are bound to individual jQuery obejcts `$('#...')`, however state is 
controlled globally via methods under `$.stateBindings`.

    $.stateBindings.addState('happy');      // enables the 'happy' state
    $.stateBindings.removeState('angry');   // disables the 'angry' state
    $.stateBindings.toggleState('state');   // adds or removes
    $.stateBindings.isEnabled('angry);      // returns true or false

*State Bindings* works by watching out for whenever you make a change to the 
global state. When you do the plugin will unbind any events for a state if it 
has been disabled, and bind to events which have been enabled, all based upon 
the definitions you set up via the $('#...').stateBindings({...}) method.