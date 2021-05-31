"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const token_1 = __importDefault(require("./token"));
const tokenType_1 = require("./tokenType");
function isType(text, type) {
    const temp = text.match(new RegExp(type.regex));
    if (temp && temp[0].length == text.length)
        return true;
    return false;
}
function isSpace(text) {
    return isType(text, tokenType_1.TokenTypes.SPACE);
}
function getTokenType(text) {
    const types = Object.values(tokenType_1.TokenTypes);
    for (let i = 0; i < types.length; i++) {
        if (isType(text, types[i])) {
            return types[i];
        }
    }
    throw new Error(`Ошибка в чтении типа токена(${text})`);
}
class Lexer {
    constructor() {
        this.tokenList = [];
        this.pos = 0;
        this.code = "";
    }
    parse(code) {
        this.code = code;
        let symbol = this.next();
        let word = "";
        while (symbol) {
            if (isSpace(symbol)) {
                if (word.length > 0)
                    this.tokenList.push(new token_1.default(getTokenType(word), word, this.pos - word.length));
                word = "";
            }
            else if (isType(symbol, tokenType_1.TokenTypes.SEMICOLON)) {
                this.tokenList.push(new token_1.default(getTokenType(word), word, this.pos - word.length));
                word = "";
                this.tokenList.push(new token_1.default(tokenType_1.TokenTypes.SEMICOLON, symbol, this.pos - word.length));
            }
            else if (isType(symbol, tokenType_1.TokenTypes.LPAR)) {
                this.tokenList.push(new token_1.default(getTokenType(word), word, this.pos - word.length));
                word = "";
                this.tokenList.push(new token_1.default(tokenType_1.TokenTypes.LPAR, symbol, this.pos - word.length));
            }
            else if (isType(symbol, tokenType_1.TokenTypes.RPAR)) {
                this.tokenList.push(new token_1.default(getTokenType(word), word, this.pos - word.length));
                word = "";
                this.tokenList.push(new token_1.default(tokenType_1.TokenTypes.RPAR, symbol, this.pos - word.length));
            }
            else if (isType(symbol, tokenType_1.TokenTypes.COMMA)) {
                this.tokenList.push(new token_1.default(getTokenType(word), word, this.pos - word.length));
                word = "";
                this.tokenList.push(new token_1.default(tokenType_1.TokenTypes.COMMA, symbol, this.pos - word.length));
            }
            else {
                word += symbol;
            }
            symbol = this.next();
        }
        return this.tokenList.filter(token => token.type.name != tokenType_1.TokenTypes.SPACE.name);
    }
    next() {
        if (this.pos >= this.code.length)
            return null;
        return this.code[this.pos++];
    }
}
exports.default = Lexer;
