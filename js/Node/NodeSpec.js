describe("HTML node", function () {

    it("should have the addStyle method", function () {
        var htmlNode = document.createElement("div");
        htmlNode.id = 'id';
        document.body.appendChild(htmlNode);
        var node = cjs.Node('#id');
        node.addStyle('first');
        expect(document.getElementById('id').className).toEqual('first');
        node.addStyle('second');
        expect(document.getElementById('id').className).toEqual('first second');
        node.addStyle('first');
        expect(document.getElementById('id').className).toEqual('first second');
        node.addStyle('third', ' fourth     ');
        expect(document.getElementById('id').className).toEqual('first second third fourth');
        node.addStyle('  first', 'fifth');
        expect(document.getElementById('id').className).toEqual('first second third fourth fifth');
        document.body.removeChild(htmlNode);
    });

    it("should have the clearStyles method", function () {
        var htmlNode = document.createElement("div");
        htmlNode.id = 'id';
        document.body.appendChild(htmlNode);
        var node = cjs.Node('#id');
        node.addStyle('first');
        document.body.appendChild(htmlNode);
        expect(document.getElementById('id').className).toEqual('first');
        node.clearStyles();
        expect(document.getElementById('id').className).toEqual('');
        node.addStyle('first second');
        expect(document.getElementById('id').className).toEqual('first second');
        node.clearStyles();
        expect(document.getElementById('id').className).toEqual('');
        document.body.removeChild(htmlNode);
    });

    it("should have the removeStyle method", function () {
        var htmlNode = document.createElement("div");
        htmlNode.id = 'id';
        document.body.appendChild(htmlNode);
        var node = cjs.Node('#id');
        node.addStyle('first', 'second');
        document.body.appendChild(htmlNode);
        expect(document.getElementById('id').className).toEqual('first second');
        node.removeStyle('first');
        node.removeStyle('first');
        expect(document.getElementById('id').className).toEqual('second');
        node.removeStyle('second');
        expect(document.getElementById('id').className).toEqual('');
        node.addStyle('first', 'second', 'third');
        node.removeStyle('first', 'third     ');
        expect(document.getElementById('id').className).toEqual('second');
    });

    it("should have the hasStyle method", function () {
        var htmlNode = document.createElement("div");
        htmlNode.id = 'id';
        document.body.appendChild(htmlNode);
        var node = cjs.Node('#id');
        node.addStyle('first', 'second');
        expect(node.hasStyle('first')).toBeTruthy();
        expect(node.hasStyle('third')).toBeFalsy();
    });

    it("should have the toggleStyle method", function () {
        var htmlNode = document.createElement("div");
        htmlNode.id = 'id';
        document.body.appendChild(htmlNode);
        var node = cjs.Node('#id');
        node.removeStyle('first');
        node.toggleStyle('first');
        expect(node.hasStyle('first')).toBeTruthy();
        node.toggleStyle('first');
        expect(node.hasStyle('first')).toBeFalsy();
    });

    it("should have the addListener method", function () {
        var htmlNode = document.createElement("div");
        htmlNode.id = 'id';
        document.body.appendChild(htmlNode);
        var node = cjs.Node('#id');
        var a = {
            callback: function () {}
        };
        spyOn(a, 'callback');
        node.addListener('click',a.callback);
        node.fire('click');
        expect(a.callback).toHaveBeenCalled();
    });

    it('should have the removeListener method', function () {
        var htmlNode = document.createElement("div");
        htmlNode.id = 'id';
        document.body.appendChild(htmlNode);
        var node = cjs.Node('#id');
        var a = {
            callback: function () {}
        };
        spyOn(a, 'callback');
        node.addListener('click', a.callback);
        node.removeListener('click', a.callback);
        node.fire('click');
        expect(a.callback).not.toHaveBeenCalled();
    });

    it('should have the clearListeners method', function () {
        var htmlNode = document.createElement("div");
        htmlNode.id = 'id';
        document.body.appendChild(htmlNode);
        var node = cjs.Node('#id');
        var a = {
            callback: function () {}
        };
        spyOn(a, 'callback');
        node.addListener('click', a.callback);
        node.addListener('click', a.callback);
        node.clearListeners('click', a.callback);
        node.fire('click'),
        expect(a.callback).not.toHaveBeenCalled();
    });

    it("should have the getTarget method", function () {
        var button = document.createElement('button'), x = {};
        button.addEventListener('click', function (ev) {
            x = cjs.Node(ev);
        });
        document.body.appendChild(button);
        button.click();
        expect(x.get(0)).toBe(button);
    });

    it("should have the setValue method", function () {
        var htmlNode = document.createElement("div");
        htmlNode.id = 'id';
        document.body.appendChild(htmlNode);
        var span = cjs.Node('#id');
        span.setValue('ciao');
        expect(span.get(0).innerText).toBe('ciao');
        expect(span.get(0).textContent).toBe('ciao');
        expect(span.getValue()).toBe('ciao');
    });

    it('should have the fire method', function () {
        var htmlNode = document.createElement("div");
        htmlNode.id = 'id';
        document.body.appendChild(htmlNode);
        var span = cjs.Node('#id');
        var o = {};
        o.callback = function (event) {o.event = event;};
        spyOn(o, 'callback').and.callThrough();
        span.addListener('customClick', o.callback);
        span.fire('customClick');
        expect(o.callback).toHaveBeenCalledWith(o.event);
    });

    it('should create an object from html markup', function () {
        var c = cjs.Node('<div>ciao</div>');
        expect(c.getValue()).toEqual('ciao')
    });

    it('should have the removeAllChildren method', function () {
        var c = cjs.Node('<div><span>ciao</span></div>');
        expect(c.getValue()).toEqual('ciao');
        c.removeAllChildren();
        expect(c.getValue()).toEqual('');
    });

    describe("converting it toJSON", function () {

        it("should return a relative json", function () {
            var container = cjs.Node('<div><first-string>string</first-string><number>1</number></div>');
            expect(container.toJSON()).toEqual({firstString: 'string', number: 1});
        });

        it("should return also nested objects", function () {
            var container = cjs.Node('<div><object><string>string</string><number>1</number></object></div>');
            expect(container.toJSON()).toEqual({object: {string: 'string', number: 1}});
        });

        it("should return also arrays", function () {
            var container = cjs.Node('<div><string>string1</string><string>string2</string><string>string3</string></div>');
            expect(container.toJSON()).toEqual({string: ['string1', 'string2', 'string3']});
        });

        it("should return array of objects", function () {
            var container = cjs.Node('<div><string><a>1</a><b>2</b><c>3</c></string><string><s>1</s><z>a</z></string></div>');
            expect(container.toJSON()).toEqual({string: [{a: 1, b: 2, c: 3}, {s: 1, z: 'a'}]});
        });

        it("should return a complex json", function () {
            var container = cjs.Node('<div><string><a>1</a><b>2</b><c><suv>as</suv></c></string>' +
                '<string><s>1</s><s>2</s><s><a>1</a><b>2</b><b>asa</b></s><z>a</z></string></div>');
            expect(container.toJSON()).toEqual({
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
