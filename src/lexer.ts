import Token from "./token";
import TokenType, { TokenTypes } from "./tokenType";


function isType(text: string, type: TokenType): boolean {
	const temp = text.match(new RegExp(type.regex));
	if (temp && temp[0].length == text.length)
		return true;
	return false;
}

function isSpace(text: string): boolean {
	return isType(text, TokenTypes.SPACE);
}

function getTokenType(text: string): TokenType {
	const types = Object.values(TokenTypes);
	for (let i = 0; i < types.length; i++) {
		if (isType(text, types[i])) {
			return types[i];
		}
	}
	throw new Error(`Ошибка в чтении типа токена(${text})`);
}


export default class Lexer {
	tokenList: Token[] = [];
	pos: number = 0;
	code: string = "";

	constructor() {}

	parse(code: string): Token[] {
		this.code = code;

		let symbol = this.next();
		let word = "";

		while (symbol) {
			if (isSpace(symbol)) {
				if (word.length > 0)
					this.tokenList.push(new Token(getTokenType(word), word, this.pos - word.length));
				word = "";
			} else if (isType(symbol, TokenTypes.SEMICOLON)) {
				this.tokenList.push(new Token(getTokenType(word), word, this.pos - word.length));
				word = "";
				this.tokenList.push(new Token(TokenTypes.SEMICOLON, symbol, this.pos - word.length));
			} else if (isType(symbol, TokenTypes.LPAR)) {
				this.tokenList.push(new Token(getTokenType(word), word, this.pos - word.length));
				word = "";
				this.tokenList.push(new Token(TokenTypes.LPAR, symbol, this.pos - word.length));
			} else if (isType(symbol, TokenTypes.RPAR)) {
				this.tokenList.push(new Token(getTokenType(word), word, this.pos - word.length));
				word = "";
				this.tokenList.push(new Token(TokenTypes.RPAR, symbol, this.pos - word.length));
			} else if (isType(symbol, TokenTypes.COMMA)) {
				this.tokenList.push(new Token(getTokenType(word), word, this.pos - word.length));
				word = "";
				this.tokenList.push(new Token(TokenTypes.COMMA, symbol, this.pos - word.length));
			} else {
				word += symbol;
			}

			symbol = this.next();
		}

		return this.tokenList.filter(token => token.type.name != TokenTypes.SPACE.name);
	}

	next(): string | null {
		if (this.pos >= this.code.length) return null;
		return this.code[this.pos++];
	}
}