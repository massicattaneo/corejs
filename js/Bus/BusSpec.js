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

    it('should have fire and on methods', function () {
        expect(Bus.fire).toBeDefined();
        expect(Bus.on).toBeDefined();
    });

    describe('On using the bus', function () {

        var fired = false;
        var callback = function (p) {
            fired = p || true;
        };

        beforeEach(function () {
            Bus.on('test', callback)
        });

        afterEach(function () {
            Bus.clear();
        });

        it('should "on" a callback', function () {
            Bus.on('test', function () {});
        });

        it('should "fire" the callback when called', function () {
            expect(fired).toEqual(false);
            Bus.fire('test');
            expect(fired).toEqual(true);
            Bus.fire('test', 'value');
            expect(fired).toEqual('value');
        });

        it('should "off" the callback', function () {
            fired = false;
            Bus.off('test', callback);
            Bus.fire('test');
            expect(fired).toEqual(false);
        });

        it('should execute "once" a callback', function () {
            Bus.clear();
            Bus.once('test', callback);
            expect(fired).toEqual(false);
            Bus.fire('test');
            expect(fired).toEqual(true);
            Bus.fire('test', 'value');
            expect(fired).toEqual(true);
        });

        describe('On setting a priority', function () {

            var fired = false;

            beforeEach(function () {
                Bus.clear();
                Bus.on('test', function () {
                    fired = 2;
                }, 2);

                Bus.on('test', function () {
                    fired = 1;
                }, 1);

                Bus.on('test', function () {
                    fired = 3;
                }, 2);
            });

            it('should respect the order', function () {
                Bus.fire('test');
                expect(fired).toEqual(3);
            });

        });

    });

});
