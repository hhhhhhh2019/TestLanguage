"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lexer_1 = __importDefault(require("./lexer"));
const syntax_1 = __importDefault(require("./syntax"));
const code = `
	$x = -5;
	while ($x <= 5) {
		$y = $x;
		if ($x < 0) {
			$y = $x * 0.01;
		};
		if ($x > 1) {
			$y = 0.01 * $x + 1;
		};
		$x = $x + .5;

		print($y);
	};
`;
const lexer = new lexer_1.default();
const syntax = new syntax_1.default();
const code_lex = lexer.parse(code);
const compile_code = syntax.parse(code_lex);
syntax.run(compile_code);
