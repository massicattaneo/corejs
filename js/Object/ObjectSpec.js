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
                b1 = {getName: function () {return this.name;}}
            var obj = {};
            obj.extend(a1,b1);
            expect(obj.name).toEqual('a1');
            obj.name = 'new';
            expect(obj.getName()).toEqual('new');
            expect(a1.name).toEqual('a1');
            expect(b1.getName()).toEqual(undefined);
        });

    });

});