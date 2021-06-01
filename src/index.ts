import { functions } from "./functions";
import Lexer from "./lexer";
import Syntax from "./syntax";


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
		$x = $x + 0.5;

		print($y);
	};
`;


const lexer = new Lexer();
const syntax = new Syntax();

const code_lex = lexer.parse(code);
const compile_code = syntax.parse(code_lex);
syntax.run(compile_code);