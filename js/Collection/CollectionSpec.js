describe('GLOBAL - COLLECTION', function () {

    it('should exist a function Promise', function () {
        expect(Collection).toBeDefined();
    });

    describe('On having a Collection', function () {

        var coll, item;

        beforeEach(function () {
            coll = Collection(String);
            item = 'string';
        });

        it("should be empty", function () {
            expect(coll.isEmpty()).toBeTruthy();
        });

        it("should get the size", function () {
            expect(coll.size()).toEqual(0);
        });

        it("should clone it", function () {
            var clone = coll.clone();
            expect(clone).toBeDefined();
            coll.add('string');
            expect(coll.size()).toEqual(1);
            expect(clone.size()).toEqual(0);
        });

        it("should create new items to collection", function () {
            var item = coll.newItem();
            expect(coll.size()).toEqual(1);
            expect(item instanceof String).toBeTruthy();
        });

        it("should add elements to the collection", function () {
            expect(coll.add(item, "index1")).toEqual("index1");
            expect(coll.size()).toEqual(1);
        });

        it("should have method forEach", function () {
            var count = 0, indexes = '', values = '';
            coll.add(item);
            coll.add(item);
            coll.forEach(function (value, key, index) {
                count++;
                indexes += index;
                values += value;
            });
            expect(count).toEqual(2);
            expect(indexes).toEqual('01');
            expect(values).toEqual('stringstring');
        });

        it("should have the methods indexOf", function () {
            var obj = {};
            coll.add(1);
            coll.add(obj);
            coll.add(2);
            expect(coll.indexOf(2)).toEqual(2);
            expect(coll.indexOf(5)).toEqual(-1);
            expect(coll.indexOf(obj)).toEqual(1);
        });

        it("should add a Collection", function () {
            var MyClass = function () {
                return {i: 1}
            };
            var coll1 = Collection(MyClass);
            coll1.newItem();
            coll.addCollection(coll1);
            expect(coll.size()).toEqual(1);
        });

        it("should have method get and remove", function () {
            coll = Collection(String);
            var itemStr = new String('ciao');
            coll.add(item, 'first');
            coll.add(item, 'second');
            coll.add(itemStr);
            expect(coll.get('first')).toEqual(item);
            expect(coll.size()).toEqual(3);
            expect(coll.removeAt(0)).toEqual(item);
            expect(coll.remove('second')).toEqual(item);
            expect(coll.removeItem(itemStr)).toEqual(itemStr);
            expect(coll.size()).toEqual(0);
        });

        it("should empty the collection with clear", function () {
            coll = Collection(String);
            coll.add(item);
            coll.add(item);
            expect(coll.isEmpty()).toBeFalsy();
            coll.clear();
            expect(coll.isEmpty()).toBeTruthy();
        });

        it("should retrieve a collecion of objects", function () {
            var Person = function (name) {
                return {name: name}
            };
            var coll1 = Collection(Person);
            var item1 = Person('item1'),
                item2 = Person('item2'),
                item3 = Person('item1');
            coll1.add(item1);
            coll1.add(item2);
            coll1.add(item3);
            var filtered = coll1.getCollection('name', 'item1');
            expect(filtered.size()).toEqual(2);
        });

        it("should filter by key and return a new collection filtered", function () {
            coll.clear();
            coll.add(1, 1);
            coll.add(2, 1);
            coll.add(3, 3);
            coll.add(4, 4);
            expect(coll.filter(1).size()).toEqual(2);
            expect(coll.filter(1).getAt(1)).toEqual(2);
            expect(coll.filter(4).size()).toEqual(1);
        });

        it("should have the method toArray", function () {
            coll.add(1);
            coll.add(2);
            expect(coll.toArray()).toEqual([1, 2]);
        });

        it("should have the method toJSON", function () {
            coll.add(1);
            coll.add(2);
            expect(coll.toJSON()).toEqual({0: 1, 1: 2});
        });

        it("should sort the collection by Item", function () {
            var sortable = Collection([2, 1, 3, 4]);
            sortable.sortByItem();
            expect(sortable.toArray()).toEqual([1, 2, 3, 4]);
            sortable.sortByItem(sortable.VERSUS.descending);
            expect(sortable.toArray()).toEqual([4, 3, 2, 1]);
        });

        it("should sort the collection by key", function () {
            var sortable = Collection(Number);
            sortable.add(1, 1);
            sortable.add(2, 2);
            sortable.add(3, 4);
            sortable.add(4, 3);
            sortable.sortByKey();
            expect(sortable.toArray()).toEqual([1, 2, 4, 3]);
            sortable.sortByKey(sortable.VERSUS.descending);
            expect(sortable.toArray()).toEqual([3, 4, 2, 1]);
        });

        it("should sort the collection by an attribute of the objects", function () {
            var Cl = function (value) {return {value: value}};
            var sortable = Collection(Cl);
            sortable.add(Cl(2));
            sortable.add(Cl(4));
            sortable.add(Cl(1));
            sortable.sortBy('value');
            expect(sortable.getAt(0).value).toEqual(1);
            sortable.sortBy('value', sortable.VERSUS.descending);
            expect(sortable.getAt(0).value).toEqual(4);
        });

        it("should swap elements", function () {
            coll = Collection();
            coll.add('0');coll.add('1');coll.add('2');coll.add('3');
            expect(coll.getAt(0)).toEqual('0');
            coll.swap(1,3);
            expect(coll.getAt(3)).toEqual('1');
        });

    });

});