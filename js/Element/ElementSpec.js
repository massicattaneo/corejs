describe("HTML node", function () {

    it("should have the addClass method", function () {
        var node = document.createElement("div");
        node.id = 'id';
        node.addClass('first');
        document.body.appendChild(node);
        expect(document.getElementById('id').className).toEqual('first');
        node.addClass('second');
        expect(document.getElementById('id').className).toEqual('first second');
        node.addClass('first');
        expect(document.getElementById('id').className).toEqual('first second');
        node.addClass('third', ' fourth     ');
        expect(document.getElementById('id').className).toEqual('first second third fourth');
        node.addClass('  first', 'fifth');
        expect(document.getElementById('id').className).toEqual('first second third fourth fifth');
        document.body.removeChild(node);
    });

    it("should have the clearClass method", function () {
        var node = document.createElement("div");
        node.id = 'id';
        node.addClass('first');
        document.body.appendChild(node);
        expect(document.getElementById('id').className).toEqual('first');
        node.clearClass();
        expect(document.getElementById('id').className).toEqual('');
        node.addClass('first second');
        expect(document.getElementById('id').className).toEqual('first second');
        node.clearClass();
        expect(document.getElementById('id').className).toEqual('');
        document.body.removeChild(node);
    });

    it("should have the removeClass method", function () {
        var node = document.createElement("p");
        node.id = 'id';
        node.addClass('first', 'second');
        document.body.appendChild(node);
        expect(document.getElementById('id').className).toEqual('first second');
        node.removeClass('first');
        node.removeClass('first');
        expect(document.getElementById('id').className).toEqual('second');
        node.removeClass('second');
        expect(document.getElementById('id').className).toEqual('');
        node.addClass('first', 'second', 'third');
        node.removeClass('first', 'third     ');
        expect(document.getElementById('id').className).toEqual('second');
    });

    it("should have the hasClass method", function () {
        var node = document.createElement("input");
        node.id = 'id';
        node.addClass('first', 'second');
        expect(node.hasClass('first')).toBeTruthy();
        expect(node.hasClass('third')).toBeFalsy();
    });

    it("should have the toggleClass method", function () {
        var node = document.createElement("li");
        node.id = 'id';
        node.toggleClass('first');
        expect(node.hasClass('first')).toBeTruthy();
        node.toggleClass('first');
        expect(node.hasClass('first')).toBeFalsy();
    });

    it("should have the addListener method", function () {
        var node = document.createElement("div");
        var a = {
            callback: function () {}
        };
        spyOn(a, 'callback');
        node.addListener('click',a.callback);
        $(node).click();
        expect(a.callback).toHaveBeenCalled();
    });

    it('should have the removeListener method', function () {
        var node = document.createElement("div");
        var a = {
            callback: function () {}
        };
        spyOn(a, 'callback');
        node.addListener('click', a.callback);
        node.removeListener('click', a.callback);
        $(node).click();
        expect(a.callback).not.toHaveBeenCalled();
    });

    it('should have the resetListeners method', function () {
        var node = document.createElement("div");
        var a = {
            callback: function () {}
        };
        spyOn(a, 'callback');
        node.addListener('click', a.callback);
        node.addListener('click', a.callback);
        node.resetListeners('click', a.callback);
        $(node).click();
        expect(a.callback).not.toHaveBeenCalled();
    });

    it("should have the getTarget method", function () {
        var button = document.createElement('button'), x = {};
        button.addEventListener('click', function (ev) {
            x = ev.getTarget()
        });
        document.body.appendChild(button);
        button.click();
        expect(x).toBe(button);
    });

    it("should have the setInnerText method", function () {
        var span = document.createElement('span');
        document.body.appendChild(span);
        span.setInnerText('ciao');
        expect(span.innerText).toBe('ciao');
        expect(span.textContent).toBe('ciao');
    });

    it('should have the fire method', function () {
        var span = document.createElement('span');
        document.body.appendChild(span);
        var o = {};
        o.callback = function (event) {o.event = event;};
        spyOn(o, 'callback').and.callThrough();
        span.addEventListener('customClick', o.callback);
        span.fire('customClick');
        expect(o.callback).toHaveBeenCalledWith(o.event);
    });

    describe("converting it toJSON", function () {
        var container = document.createElement('div');

        it("should return a relative json", function () {
            container.innerHTML = '<string>string</string><number>1</number>';
            expect(container.toJSON()).toEqual({string: 'string', number: 1});
        });

        it("should return also nested objects", function () {
            container.innerHTML = '<object><string>string</string><number>1</number></object>';
            expect(container.toJSON()).toEqual({object: {string: 'string', number: 1}});
        });

        it("should return also arrays", function () {
            container.innerHTML = '<string>string1</string><string>string2</string><string>string3</string>';
            expect(container.toJSON()).toEqual({string: ['string1', 'string2', 'string3']});
        });

        it("should return array of objects", function () {
            container.innerHTML = '<string><a>1</a><b>2</b><c>3</c></string><string><s>1</s><z>a</z></string>';
            expect(container.toJSON()).toEqual({string: [{a: 1, b: 2, c: 3}, {s: 1, z: 'a'}]});
        });

        it("should return a complex json", function () {
            container.innerHTML = '<string><a>1</a><b>2</b><c><suv>as</suv></c></string>' +
                '<string><s>1</s><s>2</s><s><a>1</a><b>2</b><b>asa</b></s><z>a</z></string>';
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
