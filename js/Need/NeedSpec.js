describe('GLOBAL - NEED', function () {

    it('should exist a function Promise', function () {
        expect(Need).toBeDefined();
    });

    describe('On creating a need', function () {
        var p;
        beforeEach(function () {
            p = Need();
        });

        it("should return an object", function () {
            expect(p).toBeDefined();
        });

        it("should have resolve, fail, then, status, onFail method", function () {
            expect(p.resolve).toBeDefined();
            expect(p.fail).toBeDefined();
            expect(p.then).toBeDefined();
            expect(p.onFail).toBeDefined();
            expect(p.status).toBeDefined();
        });

        it("should call then when everything ok", function () {
            var done = false, failed = false;
            p.then(function (test) {done = test;});
            p.onFail(function () {failed = true;});
            expect(done).toBeFalsy();
            p.resolve(true);
            expect(done).toBeTruthy();
            expect(failed).toBeFalsy();
        });

        it("should call then and pass arguments", function () {
            var result = '';
            p.then(function(string) {result = string});
            expect(result).toEqual('');
            p.resolve('data');
            expect(result).toEqual('data');
        });

        it("should call then when it resolves before assigning the done function", function () {
            var done = false, failed = false;
            p.resolve(true);
            p.then(function(test) {done = test;});
            p.onFail(function() {failed = true});
            expect(done).toBeTruthy();
            expect(failed).toBeFalsy();
        });

        it("should call onFail when fails", function () {
            var done = false, failed = false;
            p.then(function() {done = true;});
            p.onFail(function() {failed = true});
            expect(done).toBeFalsy();
            p.fail();
            p.resolve();
            expect(done).toBeFalsy();
            expect(failed).toBeTruthy();
        });

        it("should call much than one callback - case 1", function () {
            var done1 = false, done2 = false;
            p.then(function() {done1=true;});
            p.then(function() {done2=true;});
            p.resolve(); //After
            expect(done1).toBeTruthy();
            expect(done2).toBeTruthy();
        });

        it("should call much than one callback - case 2", function () {
            var done1 = false, done2 = false;
            p.resolve(); //Before
            p.then(function() {done1=true;});
            p.then(function() {done2=true;});
            expect(done1).toBeTruthy();
            expect(done2).toBeTruthy();
        });

    });

    describe('On creating a multi need - passing an array', function () {
        var ps, p1, p2;
        beforeEach(function () {
            p1 = Need(), p2 = Need(), ps = Need([p1,p2]);
        });

        it("should call then when all promises are done ", function () {
            var done=false;
            ps.then(function() {done=true;});
            p2.resolve();
            expect(done).toBeFalsy();
            p1.resolve();
            expect(done).toBeTruthy();
        });





    });
    
    // describe('On creating a need - passing a function', function () {
    //     var p, needInner, need1, need2, executed = false;
    //     beforeEach(function () {
    //         p = Need(function (need) {
    //             needInner = need;
    //             need1 = Need();
    //             need2 = Need();
    //             need(need1);
    //             need(need2);
    //
    //             return function () {
    //                 executed = true;
    //             };
    //
    //         });
    //     });
    //
    //     it('should pass an object to get other needs', function () {
    //         expect(needInner).toBeDefined();
    //     });
    //
    //     it('should not execute the inner function', function () {
    //         expect(executed).toEqual(false);
    //     });
    //
    //     it('should have the status to wait', function () {
    //         expect(p.status()).toEqual(0)
    //     });
    //
    //
    //
    // });

});