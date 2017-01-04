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
    var isMuted = false;

    obj.init = function (sds) {
        sounds = sds;
    };

    obj.play = function (type) {
        var sound = sounds[type];
        if (sound && !isMuted) {
            var audio = new Audio(sound.url);
            audio.play();
        }
    };

    obj.mute = function () {
        isMuted = true;
    };

    obj.unmute = function () {
        isMuted = false;
    };

    return obj;
};
