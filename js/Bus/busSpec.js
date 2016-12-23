/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: Bus Specification
 Created Date: 24 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

describe('cjs.bus', function () {

    it('should have fire and on methods', function () {
        expect(cjs.bus.fire).toBeDefined();
        expect(cjs.bus.on).toBeDefined();
    });

    describe('On using the bus', function () {

        var fired = false;
        var callback = function (p) {
            fired = p || true;
        };

        beforeEach(function () {
            cjs.bus.on('test', callback)
        });

        afterEach(function () {
            cjs.bus.clear();
        });

        it('should "on" a callback', function () {
            cjs.bus.on('test', function () {});
        });

        it('should "fire" the callback when called', function () {
            expect(fired).toEqual(false);
            cjs.bus.fire('test');
            expect(fired).toEqual(true);
            cjs.bus.fire('test', 'value');
            expect(fired).toEqual('value');
        });

        it('should "off" the callback', function () {
            fired = false;
            cjs.bus.off('test', callback);
            cjs.bus.fire('test');
            expect(fired).toEqual(false);
        });

        it('should execute "once" a callback', function () {
            cjs.bus.clear();
            cjs.bus.once('test', callback);
            expect(fired).toEqual(false);
            cjs.bus.fire('test');
            expect(fired).toEqual(true);
            cjs.bus.fire('test', 'value');
            expect(fired).toEqual(true);
        });

        describe('On setting a priority', function () {

            var fired = false;

            beforeEach(function () {
                cjs.bus.clear();
                cjs.bus.on('test', function () {
                    fired = 2;
                }, 2);

                cjs.bus.on('test', function () {
                    fired = 1;
                }, 1);

                cjs.bus.on('test', function () {
                    fired = 3;
                }, 2);
            });

            it('should respect the order', function () {
                cjs.bus.fire('test');
                expect(fired).toEqual(3);
            });

        });

    });

});
