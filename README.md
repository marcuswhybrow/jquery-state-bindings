jQuery State Bindings
=====================

This is a plugin for the JavaScript library jQuery, which allows your to group 
you event bindings. These groups can then be enabled or disabled based upon 
the global "state" of your page.

Usage
-----

Just like any other jQuery plugin, ensure you are including jQuery before 
including the plugin, here I am using the Google CDN version of jQuery and the 
Github hosted version of the plugin.

    <script src="<script src="//ajax.googleapis.com/ajax/libs/jquery/1.5/jquery.js"></script>"
    <script src="https://github.com/marcuswhybrow/jquery-state-bindings/raw/0.9/jquery.statebindings.js"></script>

Alternatively you can download the latest version of the plugin if you wish to
host it yourself or use it locally.

Examples
--------

For example imagine you have an element on your page with an ID of 
"littleMan". When we click on him and he is in an *angry* state, then he may 
turn red. On the other hand if he is in a *happy* state when we click, he 
might turn green.

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
    $.stateBindings.isEnabled('angry');     // returns true or false

*State Bindings* work by watching out for whenever you make a change to the 
global state. When you do the plugin will unbind any events for a state if it 
has been disabled, and bind to events which have been enabled, all based upon 
the definitions you set up via the `$('#...').stateBindings({...})` method.

Getting More Advanced
---------------------

*State Bindings* are useful for more complicated tasks. In a web application 
that allows people to edit and then view a grid of images this plugin might be 
used to separate the logic of and edit mode and the logic of a viewing mode:

    $('.gridTile').stateBindings({
        'viewing': {
            'click': function(event) {
                // Maybe display some meta information regarding the image
            }
        },
        'editing': {
            'click': function(event) {
                // Display a context mentu of actions for this image
            }
        }
    });
    
    $.stateBindings.addState('viewing');
    
    $('#toggleModeButton').click(function(event) {
        $.stateBindings.toggleState('viewing');
        $.stateBindings.toggleState('editing');
    });

**Binding to State Changes**

You can make your logic simpler by binding to state change events which are 
fired by the *State Bindings* plugin, whenever a state is enabled or disabled:

    ...

    $(window).bind('editing.stateEnabled', function(event) {
        $.stateBindings.removeState('viewing');
        // Here you could highlight the fact visually that you are editing
    });
    
    $(window).bind('editing.stateDisabled', function(event) {
        $.stateBindings.addState('viewing');
        // And then remove the visual sign since we are out of that state.
    });
    
    $('#toggleModeButton').click(function(event) {
        //$.stateBindings.toggleState('viewing');
        //$.stateBindings.toggleState('editing');
        
        $.stateBindings.toggleState('editing');
    });

If there are multiple ways to enter or exit a state in your page, then this 
approach helps to stop you repeating your logic all over the place, by 
defining it in one place.

**Complicated States**

If you have states which just should not be enabled unless another state is, 
then *state hierarchies* are the solution. You define a state as the child of
another using the `>` character:

    $('.gridTile').stateBindings({
        'viewing': {...},
        'editing': {...},
        'editing>draggingPicture': {...}
    });

Doing this gives several assurances:

1. A call to `$.stateBindings.addState('editing>draggingPicture')` will only 
succeed if `$.stateBindings.isEnabled('editing') === true`.
2. A call to `$.stateBindings.removeState('editing')` will also disable any 
state which starts with `editing>`.

Live Binding
------------

If the elements you are defining state bindings for are not at the time of the 
plugin call selectable (i.e. they will in the future dynamically be added to 
the page) then you might wish to set the live binding option to true:

    $('#id').stateBindings({...}, {live: true});

This uses calls tojQuery's [live][2] and [die][3], instead of the regular 
[bind][4] and [unbind][5] methods.

Interesting Notes
-----------------

**Namspacing**

*State Binding* uses [event namespaces][1] to segregate its binding and 
unbinding actions from other bindings which are active. It does this using the 
`.stateBindings` namespace.

**Multiple States in One Go**

When defining event names in a call to `$('#...').stateBindings({...})` it is
possible to bind the same events to multiple states by separating multiple 
state names with a space:

    $('#id').stateBindings({
        'stateOne stateTwo stateThree': function(event) {...}
    });

If you are only binding to one state it is possible to omit the quotations:

    $('#id').stateBindings({
        stateOne: function(event) {...}
    });

**Array Prototyping**

Currently this plugin defines three new prototype methods on `Array`. These 
are `contains`, `remove` and `subtract`. This can cause a problem with for 
each loops, where by the prototypical methods are included in the loop:

    var things = ['a', 'b', 'c'];
    for (thing in things)
        console.log(thing);
    
    // a
    // b
    // c
    // contains
    // remove
    // subtract

The solution is to use a for loop instead:

    for (var i = 0; i < things.length; i++)
        console.log(things[i]);
    
    // a
    // b
    // c
    

[1]: http://docs.jquery.com/Namespaced_Events
[2]: http://api.jquery.com/live/
[3]: http://api.jquery.com/die
[4]: http://api.jquery.com/bind
[5]: http://api.jquery.com/unbind