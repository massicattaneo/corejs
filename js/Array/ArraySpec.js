/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: ArraySpec
 Created Date: 24 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

describe('Array', function () {

    describe('fillWithIndex', function () {

        it('should create a new array with indexes', function () {
            var array = cjs.Array.createWithIndexes(2);
            expect(array).toEqual([0,1,2]);
        });

        it('should permit to start from a different index', function () {
            expect(cjs.Array.createWithIndexes(9, 5)).toEqual([5,6,7,8,9]);
        })

    });

    describe('clone', function () {
        var original, clone;
        beforeEach(function () {
            original = [0,1,2,3];
            clone = cjs.Array.clone(original);
        });

        it('should not modify the original', function () {
            original[0] = 1;
            expect(clone[0]).toEqual(0);
        });

    })

});
