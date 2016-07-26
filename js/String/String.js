/*/
 ///////////////////////////////////////////////////////////////////////////
 Module: String
 Created Date: 03 May 2016
 Author: mcattaneo

 //////////////////////////////////////////////////////////////////////////////
 //       Copyright (c) 2016.
 //////////////////////////////////////////////////////////////////////////////
 */

String.prototype.replaceAt = function (start, length, string) {
    return this.substr(0, start) + string + this.substr(start + length);
};

String.prototype.insertAt = function (index, string) {
    return this.substr(0, index) + string + this.substr(index);
};

String.prototype.removeAt = function (index, length) {
    length = (typeof length === "undefined") ? 1 : length;
    return this.substr(0, index) + this.substr(index + length);
};

String.prototype.padLeft = function (size, char) {
    if (size === 0) {
        return '';
    }
    return (Array(size + 1).join(char) + this).slice(-size);
};

String.prototype.padRight = function (size, char) {
    if (size === 0) {
        return '';
    }
    return (this + Array(size + 1).join(char)).slice(0, size);
};

String.prototype.removeHTMLTags = function () {
    return this.replace(/<\/?[^>]+(>|$)/g, '');
};

String.prototype.startsWith = function (start) {
    return this.substr(0, start.length) === start;
};

String.prototype.highlightWord = function (wordToHighlight, tagName, cssClass) {
    tagName = tagName || 'strong';
    var regex = new RegExp('(' + wordToHighlight + ')', 'gi');
    strClass = (cssClass) ? ' class="' + cssClass + '"' : '';
    return this.replace(regex, '<' + tagName + strClass + '>$1</' + tagName + '>');
};

String.prototype.isTime = function () {
    return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(this);
};

String.prototype.isDate = function () {
    var separator = this.indexOf('-') !== -1 ? '-' : '/';
    var d = this.split(separator);
    if (d.join("-").length < 10) return false;

    var date = new Date(d.join("-"));
    // check if date if date is incomplete
    if (/Invalid|NaN/.test(date.toString())) return false;
    else if (date.getDate() !== parseInt(d[2], 10)) return false;
    else if (date.getFullYear() !== parseInt(d[0], 10)) return false;

    return true;
};

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toString().toLowerCase();
};

String.prototype.toDate = function () {
    if (!isNaN(this)) {
        return new Date(parseInt(this));
    }
    var array = this.split(this.match(/\D/));
    return new Date(parseInt(array[0], 10), parseInt(array[1], 10) - 1, parseInt(array[2], 10));
};

(function (proto) {

    proto.toCamelCase = function () {
        var self = this;
        if (self.match(/\s|-|_/)) {
            self = self.toLowerCase();
            var a = self.match(/([^\s|_|-]*)/g);
            return a.reduce(function (p, c) {
                return p + c.capitalize();
            });
        } else {
            return self;
        }
    };

    var convert = function (self, char) {
        if (self.match(/\s/)) {
            var a = self.match(/([^\s]*)/g);
            return a.reduce(function (p, c) {
                return p.toLowerCase() + (c ? char + c.toLowerCase() : '');
            });
        } else if (self.match(new RegExp(char))) {
            return self.toLowerCase();
        } else if (self.match(/_/)) {
            return self.toLowerCase().replace(/_/g, '-');
        } else if (self.match(/-/)) {
            return self.toLowerCase().replace(/-/g, '_');
        } else {
            return convert(self
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, function(str){ return str.toUpperCase(); }), char);
        }
    };

    proto.toKebabCase = function () {
        return convert(this, '-');
    };

    proto.toSnakeCase = function () {
        return convert(this, '_');
    };

})(String.prototype);


