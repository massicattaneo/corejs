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
        var button = document.createElement('button'), x;
        button.addEventListener('click', function (ev) {
            x = ev.getTarget()
        });
        document.body.appendChild(button);
        button.click();
        expect(x).toBe(button);
    });

});
