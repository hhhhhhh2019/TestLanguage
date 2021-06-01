"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.functions = void 0;
const readline = require('readline');
var functions = {
    "print": function (text) { console.log(text); },
    "cos": function (a) { return Math.cos(a); },
    "sin": function (a) { return Math.sin(a); },
    "pow": function (a, b) { return Math.pow(a, b); },
};
exports.functions = functions;
