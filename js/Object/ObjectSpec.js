describe('GLOBAL - OBJECT', function () {

    describe('extend', function () {
        var o = {};

        it('should have the method extend', function () {
            expect(o.extend).toBeDefined();
        });

        it('should return itself', function () {
            expect(o.extend({name: 1})).toEqual({name: 1});
            expect(o.extend({})).toBe(o);
        });

        it('should accept multiple objects', function () {
            var a1 = {name: 'a1'},
                b1 = {getName: function () {return this.name;}};
            var obj = {};
            obj.extend(a1,b1);
            expect(obj.name).toEqual('a1');
            obj.name = 'new';
            expect(obj.getName()).toEqual('new');
            expect(a1.name).toEqual('a1');
            expect(b1.getName()).toEqual(undefined);
        });

    });

    describe('clone', function () {

        it('should return a new equal object', function () {
            var a = {o: {a: 1, b: 2, c: {s: 'asdas', a: [1,2,3,4]}}};
            expect(a.clone()).not.toBe(a);
            expect(a.clone()).toEqual(a);
        })

    })

    describe('toXML', function () {

        it("should render empty", function () {
            expect({}.toXML().innerHTML).toEqual('');
        });

        it("should render numbers", function () {
            expect({number: 1}.toXML().innerHTML).toEqual('<number>1</number>');
        });

        it("should render strings", function () {
            expect({string: 'some text'}.toXML().innerHTML).toEqual('<string>some text</string>');
        });

        it("should render objects", function () {
            var xml = {object: {id: 1, string: 'some text'}};
            expect(xml.toXML().innerHTML).toEqual('<object><id>1</id><string>some text</string></object>');
        });

        it("should render arrays", function () {
            var xml = {aNum: [1, 2, 3], astr: ['1', '2', '3']}.toXML();
            expect(xml.innerHTML).toEqual('<anum>1</anum><anum>2</anum><anum>3</anum><astr>1</astr><astr>2</astr><astr>3</astr>');
        });

        it("should render arrays of objects", function () {
            var xml = {oarr: [{id: 1, string: 'some text 1'}, {id: 2, string: 'some text 2'}]}.toXML();
            expect(xml.innerHTML).toEqual('<oarr><id>1</id><string>some text 1</string></oarr><oarr><id>2</id><string>some text 2</string></oarr>');
        });

        it("should render complex structures", function () {
            var xml = {oarr: [{id: 1, anum: [1, 2]}, {id: 2, obj: {id: 1, string: 'sadas'}}]}.toXML();
            expect(xml.innerHTML).toEqual('<oarr><id>1</id><anum>1</anum><anum>2</anum></oarr><oarr><id>2</id><obj><id>1</id><string>sadas</string></obj></oarr>');
        });

    });

});
