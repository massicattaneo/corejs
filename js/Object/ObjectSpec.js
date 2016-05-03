describe('GLOBAL - OBJECT', function () {

    describe('extend', function () {

        it('should have the method extend', function () {
            expect(Object.extend).toBeDefined();
        });

        it('should return an object', function () {
            expect(Object.extend({})).toEqual({});
        });

        it('should accept multiple objects', function () {
            var a1 = {name: 'a1'},
                b1 = {getName: function () {return this.name;}}
            var obj = Object.extend(a1,b1);
            expect(obj.name).toEqual('a1');
            obj.name = 'new';
            expect(obj.getName()).toEqual('new');
            expect(a1.name).toEqual('a1');
            expect(b1.getName()).toEqual(undefined);
        });

    });

});