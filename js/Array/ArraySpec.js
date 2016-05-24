/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: ArraySpec
 Created Date: 24 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016 - The Workshop  All rights reserved.
 //////////////////////////////////////////////////////////////////////////////
 */

describe('Array', function () {

    describe('fillWithIndex', function () {

        it('should modify and fill the array with indexes', function () {
            var original = [];
            var array = original.fillWithIndexes(2);
            expect(array).toEqual([0,1,2]);
            expect(array).toBe(original);
        });

        it('should permit to start from a different index', function () {
            expect([].fillWithIndexes(9, 5)).toEqual([5,6,7,8,9]);
        })

    });

    describe('clone', function () {
        var original, clone;
        beforeEach(function () {
            original = [].fillWithIndexes(4);
            clone = original.clone();
        });

        it('should not modifu the original', function () {
            original[0] = 1;
            expect(clone[0]).toEqual(0);
        });

    })

})