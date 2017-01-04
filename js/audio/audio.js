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

    obj.init = function (sds) {
        sounds = sds;
    };

    obj.play = function (type) {
        var audio = new Audio(sounds[type].url);
        audio.play();
    };

    return obj;
};
