export default class TokenType {
    name: string;
    regex: string;

    constructor(name: string, regex: string) {
        this.name = name;
        this.regex = regex;
    }
}


export const TokenTypes = {
    "SPACE": new TokenType("SPACE", "[\\n\\t\\r\\ ]*"),
    "NUMBER": new TokenType("NUMBER", "-?\\d*\\.?\\d*"),
    "VARIABLE": new TokenType("VARIABLE", "\\$[A-z0-9]*"),
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
}
