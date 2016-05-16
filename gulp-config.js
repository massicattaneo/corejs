/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: config
 Created Date: 16 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016 - The Workshop  All rights reserved.
 //////////////////////////////////////////////////////////////////////////////
 */

module.exports = (function () {

    var config = {
        files: [
            'js/String/String.js',
            'js/Object/Object.js',
            'js/Collection/Collection.js',
            'js/Need/Need.js'
        ],
        tests: ['js/**/*Spec.js']
    };

    return config;

})();