import TokenType from "./tokenType";

export default class Token {
    pos: number;
    value: string;
    type: TokenType;

    constructor(type: TokenType, value: string, pos: number) {
        this.value = value;
        this.pos = pos;
        this.type = type;
    }
}