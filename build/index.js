"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = __importDefault(require("./lexer"));
const syntax_1 = __importDefault(require("./syntax"));
const code = `
	print(pow(-0.3, 2));
	print(pow(-0.2, 2));
	print(pow(-0.1, 2));
	print(pow(0, 2));
	print(pow(0.1, 2));
	print(pow(0.2, 2));
	print(pow(0.3, 2));
`;
const lexer = new lexer_1.default();
const syntax = new syntax_1.default();
const code_lex = lexer.parse(code);
const compile_code = syntax.parse(code_lex);
syntax.run(compile_code);
