/**
 * Created by max on 12/12/16.
 */

describe('Core', function () {
    var FirstClass, firstObj, SecondClass, secondObj, ThirdClass, thirdObj, FourthClass, fourthObj;

    beforeEach(function () {
        FirstClass = cjs.create({
            test: 1,
            testFunc: function () {return 1;},
            testFuncArgs: function (arg) {return arg;},
            constructor: function(name) {
                this.name = name;
            }
        });
        firstObj = new FirstClass('name');

        SecondClass = cjs.extend(FirstClass).create({
            testFunc: function() {return this.parent();},
            testFuncArgs: function (arg) {return arg +1;},
            testFuncSecond: function(int) {return 2+int;}
        });
        secondObj = new SecondClass('name');

        ThirdClass = cjs.extend(SecondClass).create({
            test: 3
        });
        thirdObj = new ThirdClass('name');

        FourthClass = cjs.extend(ThirdClass).create({
            constructor: function (name) {this.parent(name);},
            testFuncSecond: function(int) {
                var a = this.parent(int);
                return a + 2;}
        });
        fourthObj = new FourthClass('name');
    });

    describe("Creation", function () {

        it("you could create with no object", function () {
            expect(new cjs.create()).toBeDefined();
            expect(new cjs.extend(FirstClass).create()).toBeDefined();
            expect(firstObj instanceof cjs).toBeTruthy();
            expect(firstObj instanceof FirstClass).toBeTruthy();
            expect(secondObj instanceof FirstClass).toBeTruthy();
            expect(thirdObj instanceof SecondClass).toBeTruthy();
        });

        it("should merge constructor method", function () {
            expect(firstObj.name).toEqual('name');
            expect(secondObj.name).toEqual('name');
            expect(thirdObj.name).toEqual('name');
        });

        it("should have correct methods and attributes", function () {
            expect(firstObj.test).toEqual(1);
            expect(firstObj.testFunc()).toEqual(1);
            expect(firstObj.testFuncArgs(5)).toEqual(5);
        });
    });

    describe('Inheritance', function () {

        it("should extend with correct methods and attributes", function () {
            expect(secondObj.test).toEqual(1);
            expect(secondObj.testFuncArgs(5)).toEqual(6);
            expect(secondObj.testFuncSecond(0)).toEqual(2);
            expect(thirdObj.test).toEqual(3);
            expect(thirdObj instanceof ThirdClass).toBeTruthy();
        });

        it("should override parents methods", function () {
            expect(firstObj.testFunc()).toEqual(1);
            expect(thirdObj.testFunc()).toEqual(1);
        });

        it("should have super method in each method", function () {
            expect(fourthObj.testFuncSecond(2)).toEqual(6);
        });

    });

    xdescribe('CollectionOf cjs', function () {
        var MyClass1, MyColl1, coll, item;
        beforeEach(function () {
            MyClass1= cjs.create({
                name: '',
                constructor: function(name) {
                    this.name = name;
                },
                getName: function() {
                    return this.name;
                }
            });
        });

        describe("On creating a collection of a cjs", function () {

            beforeEach(function () {
                MyColl1 = cjs.CollectionOf(String).create();
                coll = new MyColl1();
                item = 'string';
            });

            it("should be able to create a collection extending an object", function () {
                var Ex = cjs.create({test: 1});
                var ExColl = cjs.extend(Ex).CollectionOf(String).create();
                var exColl = new ExColl();
                expect(exColl.test).toEqual(1);
            });

            it("should be empty", function () {
                expect(coll.isEmpty()).toBeTruthy();
            });

            it("should get the size", function () {
                expect(coll.size()).toEqual(0);
            });

            it("should clone it", function () {
                const clone = coll.clone();
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

            it("should have method each", function () {
                var count = 0, indexes='', values='';
                coll.add(item);coll.add(item);
                coll.each(function(index, key, value) {
                    count++;
                    indexes+=index;
                    values+=value;
                });
                expect(count).toEqual(2);
                expect(indexes).toEqual('01');
                expect(values).toEqual('stringstring');
            });

            it("should have the methods indexOf", function () {
                var obj = {};
                coll.add(1);coll.add(obj);coll.add(2);
                expect(coll.indexOf(2)).toEqual(2);
                expect(coll.indexOf(5)).toEqual(-1);
                expect(coll.indexOf(obj)).toEqual(1);
            });

            it("should add a Collection", function () {
                var MyColl1 = cjs.CollectionOf(MyClass1).create();
                var coll1 = new MyColl1([1,2,3,4]);
                coll.addCollection(coll1);
                expect(coll.size()).toEqual(4);
            });

            it("should have method get and remove", function () {
                coll = new MyColl1();
                var itemStr = new String('ciao');
                coll.add(item, 'first');coll.add(item, 'second');coll.add(itemStr);
                expect(coll.get('first')).toEqual(item);
                expect(coll.size()).toEqual(3);
                expect(coll.removeAt(0)).toEqual(item);
                expect(coll.remove('second')).toEqual(item);
                expect(coll.removeItem(itemStr)).toEqual(itemStr);
                expect(coll.size()).toEqual(0);
            });

            it("should empty the collection with clear", function () {
                coll = new MyColl1();
                coll.add(item);coll.add(item);
                expect(coll.isEmpty()).toBeFalsy();
                coll.clear();
                expect(coll.isEmpty()).toBeTruthy();
            });

            it("should retrieve a collecion of objects", function () {
                var MyClass1 = cjs.create({constructor: function(name) {this.name = name}});
                var MyColl1 = cjs.CollectionOf(MyClass1).create();
                var coll1 = new MyColl1();
                var item1 = new MyClass1('item1'), item2 = new MyClass1('item2'), item3 = new MyClass1('item1');
                coll1.add(item1); coll1.add(item2); coll1.add(item3);
                var filtered = coll1.getCollection('name', 'item1');
                expect(filtered.size()).toEqual(2);
            });

            it("should filter by key and return a new collection filtered", function () {
                coll.clear();
                coll.add(1,1);coll.add(2,1);
                coll.add(3,3);coll.add(4,4);
                expect(coll.filter(1).size()).toEqual(2);
                expect(coll.filter(1).getAt(1)).toEqual(2);
                expect(coll.filter(4).size()).toEqual(1);
            });

            it("should have the method toArray", function () {
                coll.add(1); coll.add(2);
                expect(coll.toArray()).toEqual([1,2]);
            });

            it("should have the method toJSON", function () {
                coll.add(1); coll.add(2);
                expect(coll.toJSON()).toEqual({0: 1, 1: 2});
            });

            it("should sort the collection by Item", function () {
                var sortable = new (cjs.CollectionOf(Number).create())([2,1,3,4]);
                sortable.sortByItem();
                expect(sortable.toArray()).toEqual([1,2,3,4]);
                sortable.sortByItem(sortable.VERSUS.descending);
                expect(sortable.toArray()).toEqual([4,3,2,1]);
            });

            it("should sort the collection by key", function () {
                var sortable = new (cjs.CollectionOf(Number).create())();
                sortable.add(1,1); sortable.add(2,2);sortable.add(3,4);sortable.add(4,3);
                sortable.sortByKey();
                expect(sortable.toArray()).toEqual([1,2,4,3]);
                sortable.sortByKey(sortable.VERSUS.descending);
                expect(sortable.toArray()).toEqual([3,4,2,1]);
            });

            it("should sort the collection by an attribute of the objects", function () {
                var Cl = cjs.create({constructor: function(value) {this.value=value;}});
                var sortable = new (cjs.CollectionOf(Cl).create())();
                sortable.add(new Cl(2)); sortable.add(new Cl(4)); sortable.add(new Cl(1));
                sortable.sortBy('value');
                expect(sortable.getAt(0).value).toEqual(1);
                sortable.sortBy('value', sortable.VERSUS.descending);
                expect(sortable.getAt(0).value).toEqual(4);
            });

            it("should swap elements", function () {
                coll = new MyColl1();
                coll.add('0');coll.add('1');coll.add('2');coll.add('3');
                expect(coll.getAt(0)).toEqual('0');
                coll.swap(1,3);
                expect(coll.getAt(3)).toEqual('1');
            });

        });

    });

});
