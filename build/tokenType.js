"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenTypes = void 0;
class TokenType {
    constructor(name, regex) {
        this.name = name;
        this.regex = regex;
    }
}
exports.default = TokenType;
exports.TokenTypes = {
    "SPACE": new TokenType("SPACE", "[\\n\\t\\r\\ ]*"),
    "NUMBER": new TokenType("NUMBER", "-?\\d*\\.?\\d+"),
    "BOOLEAN": new TokenType("BOOLEAN", "true|false"),
    "VARIABLE": new TokenType("VARIABLE", "\\$[A-z0-9]*"),
    "INVERSE_VARIABLE": new TokenType("VARIABLE", "\\-\\$[A-z0-9]*"),
    "WHILE": new TokenType("WHILE", "while"),
    "COND": new TokenType("COND", "if"),
    "COMMAND": new TokenType("COMMAND", "[A-z0-9]*"),
    "ASSIGN": new TokenType("ASSING", "\\="),
    "SEMICOLON": new TokenType("SEMICOLON", "\\;"),
    "SUM": new TokenType("SUM", "\\+"),
    "SUB": new TokenType("SUB", "\\-"),
    "MUL": new TokenType("MUL", "\\*"),
    "DIV": new TokenType("DIV", "\\/"),
    "LPAR": new TokenType("LPAR", "\\("),
    "RPAR": new TokenType("RPAR", "\\)"),
    "COMMA": new TokenType("COMMA", "\\,"),
    "LBRACE": new TokenType("LBRACE", "\\{"),
    "RBRACE": new TokenType("RBRACE", "\\}"),
    "LESS": new TokenType("LESS", "\\<"),
    "MORE": new TokenType("MORE", "\\>"),
    "EQU": new TokenType("EQU", "\\=\\="),
    "LESSOrEQU": new TokenType("LESSOrEQU", "\\<\\="),
    "MOREOrEQU": new TokenType("MOREOrEQU", "\\<\\="), // >=
};
