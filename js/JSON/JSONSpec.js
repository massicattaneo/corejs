/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: JSONSpec
 Created Date: 14 July 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */


xdescribe('JSON.toXML', function () {
    var json;

    it("should render empty", function () {
        json = {};
        var xml = JSON.toXML(json, 'Model');
        expect(xml.nodeName).toEqual('MODEL');
    });

    it("should render numbers", function () {
        json = {number: 1};
        var xml = JSON.toXML(json, 'Model');
        expect(xml.innerHTML).toEqual('<number>1</number>');
    });

    it("should render strings", function () {
        json = {string: 'some text'};
        var xml = JSON.toXML(json, 'Model');
        expect(xml.innerHTML).toEqual('<string>some text</string>');
    });

    it("should render objects", function () {
        json = {object: {id: 1, string: 'some text'}};
        var xml = JSON.toXML(json, 'Model');
        expect(xml.innerHTML).toEqual('<object><id>1</id><string>some text</string></object>');
    });

    it("should render arrays", function () {
        json = {aNum: [1, 2, 3], astr: ['1', '2', '3']};
        var xml = JSON.toXML(json, 'Model');
        expect(xml.innerHTML).toEqual('<anum>1</anum><anum>2</anum><anum>3</anum><astr>1</astr><astr>2</astr><astr>3</astr>');
    });

    it("should render arrays of objects", function () {
        json = {oarr: [{id: 1, string: 'some text 1'}, {id: 2, string: 'some text 2'}]};
        var xml = JSON.toXML(json, 'Model');
        expect(xml.innerHTML).toEqual('<oarr><id>1</id><string>some text 1</string></oarr><oarr><id>2</id><string>some text 2</string></oarr>');
    });

    it("should render complex structures", function () {
        json = {oarr: [{id: 1, anum: [1, 2]}, {id: 2, obj: {id: 1, string: 'sadas'}}]};
        var xml = JSON.toXML(json, 'Model');
        expect(xml.innerHTML).toEqual('<oarr><id>1</id><anum>1</anum><anum>2</anum></oarr><oarr><id>2</id><obj><id>1</id><string>sadas</string></obj></oarr>');
    });

});
