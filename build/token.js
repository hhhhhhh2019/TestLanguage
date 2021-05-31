"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Token {
    constructor(type, value, pos) {
        this.value = value;
        this.pos = pos;
        this.type = type;
    }
}
exports.default = Token;
