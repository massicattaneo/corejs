/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: XMLSpec
 Created Date: 14 July 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

describe('XML to JSON', function () {

    var node = {};
    describe("On having an XML node", function () {
        var container = document.createElement('div');

        it("should return a relative json", function () {
            container.innerHTML = '<string>string</string><number>1</number>';
            expect(XML.toJSON(container)).toEqual({string: 'string', number: 1});
        });

        it("should return also nested objects", function () {
            container.innerHTML = '<object><string>string</string><number>1</number></object>';
            expect(XML.toJSON(container)).toEqual({object: {string: 'string', number: 1}});
        });

        it("should return also arrays", function () {
            container.innerHTML = '<string>string1</string><string>string2</string><string>string3</string>';
            expect(XML.toJSON(container)).toEqual({string: ['string1', 'string2', 'string3']});
        });

        it("should return array of objects", function () {
            container.innerHTML = '<string><a>1</a><b>2</b><c>3</c></string><string><s>1</s><z>a</z></string>';
            expect(XML.toJSON(container)).toEqual({string: [{a: 1, b: 2, c: 3}, {s: 1, z: 'a'}]});
        });

        it("should return a complex json", function () {
            container.innerHTML = '<string><a>1</a><b>2</b><c><suv>as</suv></c></string>' +
                '<string><s>1</s><s>2</s><s><a>1</a><b>2</b><b>asa</b></s><z>a</z></string>';
            expect(XML.toJSON(container)).toEqual({
                string: [{a: 1, b: 2, c: {suv: 'as'}}, {
                    s: [1, 2, {
                        a: 1,
                        b: [2, 'asa']
                    }], z: 'a'
                }]
            });
        });

    });

});
