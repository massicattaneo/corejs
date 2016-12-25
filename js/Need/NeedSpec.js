describe('GLOBAL - NEED', function () {

    it('should exist a function Promise', function () {
        expect(cjs.Need).toBeDefined();
    });

    describe('On creating a need', function () {
        var p;
        beforeEach(function () {
            p = cjs.Need();
        });

        it("should return an object", function () {
            expect(p).toBeDefined();
        });

        it("should have resolve, fail, then, status, fail method", function () {
            expect(p.resolve).toBeDefined();
            expect(p.reject).toBeDefined();
            expect(p.done).toBeDefined();
            expect(p.fail).toBeDefined();
            expect(p.status).toBeDefined();
        });

        it("should call then when everything ok", function () {
            var done = false, failed = false;
            p.done(function (test) {
                done = test;
            });
            p.fail(function () {
                failed = true;
            });
            expect(done).toBeFalsy();
            p.resolve(true);
            expect(done).toBeTruthy();
            expect(failed).toBeFalsy();
        });

        it("should call then and pass arguments", function () {
            var result = '';
            p.done(function (string) {
                result = string
            });
            expect(result).toEqual('');
            p.resolve('data');
            expect(result).toEqual('data');
        });

        it("should call then when it resolves before assigning the done function", function () {
            var done = false, failed = false;
            p.resolve(true);
            p.done(function (test) {
                done = test;
            });
            p.fail(function () {
                failed = true
            });
            expect(done).toBeTruthy();
            expect(failed).toBeFalsy();
        });

        it("should call fail when fails", function () {
            var done = false, failed = false;
            p.done(function () {
                done = true;
            });
            p.fail(function () {
                failed = true
            });
            expect(done).toBeFalsy();
            p.reject();
            p.resolve();
            expect(done).toBeFalsy();
            expect(failed).toBeTruthy();
        });

        it("should call much than one callback - case 1", function () {
            var done1 = false, done2 = false;
            p.done(function () {
                done1 = true;
            });
            p.done(function () {
                done2 = true;
            });
            p.resolve(); //After
            expect(done1).toBeTruthy();
            expect(done2).toBeTruthy();
        });

        it("should call much than one callback - case 2", function () {
            var done1 = false, done2 = false;
            p.resolve(); //Before
            p.done(function () {
                done1 = true;
            });
            p.done(function () {
                done2 = true;
            });
            expect(done1).toBeTruthy();
            expect(done2).toBeTruthy();
        });

        it('should be resolved also more than 1 time', function () {
            var done = false, failed = false, over;
            p.resolve(1);
            p.resolve(2);
            p.resolve(3);
            p.resolve(4);
            p.done(function (test, id, not) {
                done = 1;
                over = not;
            });
            p.fail(function () {
                failed = true
            });
            expect(done).toEqual(1);
            expect(over).toBeUndefined();
        });

    });

    describe('On creating a multi need - passing an array', function () {
        var ps, p1, p2;
        beforeEach(function () {
            p1 = cjs.Need(), p2 = cjs.Need(), ps = cjs.Need([p1, p2]);
        });

        it("should call then when all promises are done ", function () {
            var done = false;
            ps.done(function () {
                done = true;
            });
            p2.resolve();
            expect(done).toBeFalsy();
            p1.resolve();
            expect(done).toBeTruthy();
        });

        it("should save retrieved data independently on the order resolution", function () {
            var number = 0, over;
            ps.done(function (s1, s2, s3, s4) {
                number = s1 + s2;
                over = s3
            });
            p2.resolve(1);
            p1.resolve(2);
            expect(number).toEqual(3);
            expect(over).toEqual(undefined);
        });

        it("should fail immediatly after one fails", function () {
            var fail = false;
            p1.resolve();
            ps.fail(function (error) {
                fail = error;
            });
            ps.done(function () {
            });
            p2.reject('error');
            expect(fail).toEqual('error');
        });

        it('should work with a lot of promises', function () {
            var done = false;
            var pros = cjs.Need([cjs.Need(), cjs.Need(), cjs.Need(), cjs.Need(), cjs.Need(), cjs.Need()]);
            pros.done(function () {
                done = true;
            });
            expect(done).toBeFalsy();
            pros.get(0).resolve();
            pros.get(1).resolve();
            pros.get(2).resolve();
            pros.get(3).resolve();
            pros.get(4).resolve();
            expect(done).toBeFalsy();
            pros.get(5).resolve();
            expect(done).toBeTruthy();
        });

        it('should work with a lot of promises resolving and failing', function () {
            var done = false;
            var newp = cjs.Need();
            var pros = cjs.Need([newp, cjs.Need(), cjs.Need(), cjs.Need(), cjs.Need(), cjs.Need()]);
            expect(done).toBeFalsy();
            pros.done(function () {
                done = true;
            });
            pros.get(1).resolve();
            pros.get(2).resolve();
            pros.get(5).resolve();
            newp.reject();
            pros.get(3).resolve();
            pros.get(4).resolve();
            expect(done).toBeFalsy();
            expect(done).toBeFalsy();
        });

        it("should work also with promise just resolved", function () {
            var _prs = cjs.Need([]), done = false,
                _p1 = cjs.Need(), _p2 = cjs.Need();

            _p1.resolve();
            _prs.add(_p1);
            _prs.add(_p2);

            _prs.done(function () {
                done = true;
            });
            expect(done).toBeTruthy();

        });

        it("should attach more than one callback", function () {
            var done1 = false, done2 = false;
            ps.done(function (a) {
                done1 = a;
            });
            ps.done(function (a) {
                done2 = a;
            });
            p2.resolve(true);
            p1.resolve(true);
            expect(done1).toBeTruthy();
            expect(done2).toBeTruthy();
        });

    });

    describe('On creating a queue', function () {

        var queueArray, queue, actions = {}, needs = {};
        beforeEach(function () {
            actions['a1'] = function () {return needs['a1'] = cjs.Need()};
            actions['a2'] = function () {return needs['a2'] = cjs.Need()};
            spyOn(actions, 'a1').and.callThrough();
            spyOn(actions, 'a2').and.callThrough();
            queueArray = [actions['a1'], actions['a2']];
            queue = cjs.Need(queueArray);
        });

        it('should have the method start', function () {
            expect(queue.start).toBeDefined();
        });

        it('should have the method add', function () {
            expect(queue.push).toBeDefined();
        });

        describe('When the queue is started', function () {

            beforeEach(function () {
                queue.start(1);
            });

            it('should call the 1 action', function () {
                expect(actions.a1).toHaveBeenCalledWith(jasmine.any(Object), 1);
            });

            describe('When the a1 is resolved', function () {

                beforeEach(function () {
                    needs['a1'].resolve(2);
                });

                it('should call the action 2', function () {
                    expect(actions['a2']).toHaveBeenCalledWith(jasmine.any(Object), 2);
                });

                describe('When all the actions are resolved', function () {

                    beforeEach(function () {
                        needs['a2'].resolve();
                    });

                    it('should clear the queue', function () {
                        expect(queue.isRunning()).toEqual(false);
                    });

                });

            });

            describe('When the a1 fails', function () {

                beforeEach(function () {
                    needs['a1'].reject();
                });

                it('should clear the queue', function () {
                    expect(queueArray.length).toEqual(0);
                });

                it('should not run the action2', function () {
                    expect(actions.a2).not.toHaveBeenCalled();
                });

            });

            describe('When the a1 is resolved and it was added a 3rd action', function () {

                beforeEach(function () {
                    actions['a3'] = function () {
                        return needs['a3'] = cjs.Need();
                    };
                    queue.push(actions['a3']);
                    needs['a1'].resolve(2);
                });

                it('should call the action 2', function () {
                    expect(actions['a2']).toHaveBeenCalledWith(jasmine.any(Object), 2);
                });

                describe('When all the actions are resolved', function () {

                    beforeEach(function () {
                        needs['a2'].resolve(3);
                    });

                    it('should clear the queue', function () {
                        expect(queue.isRunning()).toEqual(true);
                        needs['a3'].resolve();
                        expect(queue.isRunning()).toEqual(false);
                    });

                });

            });

        });

    });

});
