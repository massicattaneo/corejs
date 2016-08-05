/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: Bus Specification
 Created Date: 24 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

describe('Bus', function () {

    it('should have fire and listen methods', function () {
        expect(Bus.fire).toBeDefined();
        expect(Bus.listen).toBeDefined();
    });

    describe('On listening on an event', function () {

        var fired = false;
        var callback = function (p) {
            fired = p || true;
        };

        beforeEach(function () {
            Bus.listen('test', callback)
        });

        afterEach(function () {
            Bus.remove('test', callback);
        });

        it('should fire the callback when called', function () {
            expect(fired).toEqual(false);
            Bus.fire('test');
            expect(fired).toEqual(true);
            Bus.fire('test', 'value');
            expect(fired).toEqual('value');
        });

        it('should have the method to remove the callback', function () {
            fired = false;
            Bus.remove('test', callback);
            Bus.fire('test');
            expect(fired).toEqual(false);
        })

    });



    describe('On setting a priority', function () {

        var fired = false;

        beforeEach(function () {

            Bus.listen('test', function () {
                fired = 2;
            }, 2);

            Bus.listen('test', function () {
                fired = 1;
            }, 1);

            Bus.listen('test', function () {
                fired = 3;
            }, 2);
        });

        it('should respect the order', function () {
            Bus.fire('test');
            expect(fired).toEqual(3);
        })

    })

});
