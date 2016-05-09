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

        it("should save retrieved data independently on the order resolution", function () {
            var number = 0;
            ps.then(function(s1, s2) {number = s1+s2;});
            p2.resolve(1);
            p1.resolve(2);
            expect(number).toEqual(3);
        });

        it("should fail immediatly after one fails", function () {
            var fail=false;
            p1.resolve();
            ps.onFail(function(error) {fail=error;});
            ps.then(function() {});
            p2.fail('error');
            expect(fail).toEqual('error');
        });

        it('should work with a lot of promises', function () {
            var done =false;
            var pros = Need([Need(),Need(),Need(),Need(),Need(),Need()]);
            pros.then(function() {done=true;});
            expect(done).toBeFalsy();
            pros.get(0).resolve();pros.get(1).resolve();pros.get(2).resolve();
            pros.get(3).resolve();pros.get(4).resolve();
            expect(done).toBeFalsy();
            pros.get(5).resolve();
            expect(done).toBeTruthy();
        });

        it('should work with a lot of promises resolving and failing', function () {
            var done =false;
            var newp = Need();
            var pros = Need([newp, Need(), Need(), Need(), Need(), Need()]);
            expect(done).toBeFalsy();
            pros.then(function() {done=true;});
            pros.get(1).resolve();
            pros.get(2).resolve();
            pros.get(5).resolve();
            newp.fail();
            pros.get(3).resolve();
            pros.get(4).resolve();
            expect(done).toBeFalsy();
            expect(done).toBeFalsy();
        });

        it("should work also with promise just resolved", function () {
            var _prs = Need([]), done = false,
                _p1 = Need(), _p2 = Need();

            _p1.resolve();
            _prs.add(_p1); _prs.add(_p2);

            _prs.then(function() {
                done = true;
            });
            expect(done).toBeTruthy();

        });

        // it("should import packages", function () {
        //     var done=false;
        //     packages.create('test', function() {return true;});
        //
        //     ps
        //         .imports('test', packages)
        //         .onDone(function(test,a,b) {done='' + test + a+ b;});
        //
        //     p2.resolve('2');
        //     expect(done).toBeFalsy();
        //     p1.resolve('1');
        //     expect(done).toEqual('true12');
        // });
        
        // it("should import packages also loaded after", function () {
        //     var done=false;
        //     ps
        //         .imports('test', packages)
        //         .onDone(function(test) {done=test;});
        //     packages.create('test', function() {return true;});
        //
        //
        //     p2.resolve();
        //     expect(done).toBeFalsy();
        //     p1.resolve();
        //     expect(done).toBeTruthy();
        // });



    });
    
    describe('On creating a need - passing a function', function () {
        var p, needInner, t3 = false;
        beforeEach(function () {

            Need('t2', function () {
                return function () {

                }
            });
            
            p = Need('t3', function (need) {
                needInner = need;
                var t1 = need('t1');
                var t2 = need('t2');

                return function () {
                    t3 = true;
                };

            });
        });

        it('should pass an object to get other needs', function () {
            expect(needInner).toBeDefined();
        });

        it('should not execute the inner function', function () {
            expect(t3).toEqual(false);
            Need('t1', function () {
                return function () {

                }
            });
            expect(p.status()).toEqual(1);
        });

    });

});