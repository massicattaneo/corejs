/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: audio
 Created Date: 04 January 2017
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016 - The Workshop  All rights reserved.
 //////////////////////////////////////////////////////////////////////////////
 */

cjs.Audio = function () {
    var obj = {};

    var sounds = {name: {url: ''}};
    var instances = {};
    var isMuted = false;

    obj.init = function (sds) {
        sounds = sds;
        Object.keys(sounds).forEach(function (type) {
            instances[type] = new Audio(sounds[type].url);
        });
    };

    obj.play = function (type) {
        var sound = sounds[type];
        if (sound && !isMuted) {
            instances[type].play();
        }
    };

    obj.stop = function (type) {
        instances[type].pause();
        instances[type].currentTime = 0;
    };

    obj.mute = function () {
        isMuted = true;
    };

    obj.unmute = function () {
        isMuted = false;
    };

    return obj;
};
