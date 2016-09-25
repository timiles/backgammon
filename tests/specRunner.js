(function () {
    'use strict';

    // Configure RequireJS to shim Jasmine
    require.config({
        baseUrl: '..',
        paths: {
            'jasmine': 'tests/lib/jasmine-2.0.0/jasmine',
            'jasmine-html': 'tests/lib/jasmine-2.0.0/jasmine-html',
            'boot': 'tests/lib/jasmine-2.0.0/boot',

            'BoardComponents/Board': 'play/js/backgammon',
            'Analysis/BoardEvaluator': 'play/js/backgammon',
            'Players/ComputerPlayer': 'play/js/backgammon',
            'Dice': 'play/js/backgammon',
            'DiceRollGenerator': 'play/js/backgammon',
            'Enums': 'play/js/backgammon',
            'Game': 'play/js/backgammon',
            'UI/GameUI': 'play/js/backgammon',
            'Move': 'play/js/backgammon',
            'StatusLogger': 'play/js/backgammon',
            'UI/EventBinders/StatusUIEventBinder': 'play/js/backgammon',
        },
        shim: {
            'jasmine': {
                exports: 'window.jasmineRequire'
            },
            'jasmine-html': {
                deps: ['jasmine'],
                exports: 'window.jasmineRequire'
            },
            'boot': {
                deps: ['jasmine', 'jasmine-html'],
                exports: 'window.jasmineRequire'
            }
        }
    });

    var specs = [
        'tests/specs/boardSpec',
        'tests/specs/uiSpec',
        'tests/specs/aiSpec',
        'tests/specs/moveSpec',
    ];

    // Because we are using RequireJS `window.onload()` has already been triggered so we have to manually call it again.
    // This will initialize the HTML Reporter and execute the environment.
    require(['boot'], function () {

        // Load the specs
        require(specs, function () {

            // Initialize the HTML Reporter and execute the environment (setup by `boot.js`)
            window.onload();
        });
    });
})();