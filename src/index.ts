import Lexer from "./lexer";
import Syntax from "./syntax";


const code = `
	print(pow(-0.3, 2));
	print(pow(-0.2, 2));
	print(pow(-0.1, 2));
	print(pow(0, 2));
	print(pow(0.1, 2));
	print(pow(0.2, 2));
	print(pow(0.3, 2));
`;


const lexer = new Lexer();
const syntax = new Syntax();

const code_lex = lexer.parse(code);
const compile_code = syntax.parse(code_lex);
syntax.run(compile_code);