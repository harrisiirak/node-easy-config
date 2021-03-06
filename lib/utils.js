'use strict';

var util = require('util');
var path = require('path');
var fs = require('fs');

/**
 * Function for creating a clone of an object
 *
 * @param o {Object}  object to clone
 * @return {Object}
 */
function clone(obj) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    var ret;
    if (util.isArray(obj)) {
        ret = [];
        obj.forEach(function (val) {
            ret.push(clone(val));
        });
        return ret;
    }
    ret = {};
    Object.keys(obj).forEach(function (key) {
        ret[key] = clone(obj[key]);
    });
    return ret;
}

/**
 * A extends B
 *
 * util.inherits works only with objects derived from Object
 *
 * @return {Object} Extended object
 */
function extend(a, b, noClone) { // A extends B
    a = a || {};

    if (typeof a !== 'object') {
        return noClone ? b : clone(b);
    }

    if (typeof b !== 'object') {
        return b;
    }

    if (!noClone) {
        a = clone(a);
    }

    var bk = Object.keys(b);
    var i, c;
    for (i = 0, c = bk.length; i < c; i++) {
        var key = bk[i];
        if (!a.hasOwnProperty(key) ||
            (!(typeof b[key] === 'object' && b[key].length === undefined) &&
                (typeof b[key] !== 'function'))) { // Simple types

            a[key] = b[key];
        } else { // Complex types
            a[key] = extend(a[key], b[key], noClone);
        }
    }
    return a;
}

/**
 * Function for mapping a folder and subfolders for certain file types
 * @param opts {Object} - path: folder to map, type: file extension to look for
 * @returns Object
 */
function mapFolder(opts) {
    var folders = [''];
    var map = {};
    Object.defineProperty(map, '_root', {value: opts.path});
    opts.sType = '.' + opts.type;
    var rel = '';
    function examine(file) {
        var stats = fs.statSync(path.join(map._root, rel, file));
        if(stats.isDirectory()) {
            folders.push(path.join(rel, file));
            return;
        }
        var ext = path.extname(file);
        if(ext === opts.sType || ext === opts.type) {
            map[path.join(rel, file)] = {
                _path: path.join(map._root, rel, file),
                _base: path.basename(file, path.extname(file))
            };
        }
    }
    folders.forEach(function (k) {
        rel = k !== '' ? k + path.sep : rel;
        var subfiles = fs.readdirSync(map._root + rel);
        subfiles.forEach(examine);
    });
    return map;
}


/**
 * Function for appending path.sep to the end of string if necessary
 * 
 * @param string {String}
 * @return {String}
 */
function fixPath(string) {
    if (string.charAt(string.length - 1) !== path.sep) {
        string += path.sep;
    }
    return string;
}

module.exports = {
    extend: extend,
    clone: clone,
    fixPath: fixPath,
    map: mapFolder
};