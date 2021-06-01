import BinaryNode from "./AST/binaryNode";
import BooleanNode from "./AST/booleanNode";
import MainNode from "./AST/mainNode";
import Node from "./AST/node";
import NumberNode from "./AST/numberNode";
import UnarNode from "./AST/unarNode";
import VariableNode from "./AST/variableNode";
import { functions } from "./functions";
import Token from "./token";
import TokenType, { TokenTypes } from "./tokenType";

export default class Syntax {
	tokens: Token[] = [];
	pos: number = 0;
	scope: any = {
		"$PI": "3.1415926535897932384626433832795",
		"$E": "2.71828182846",
	};

	constructor() {}

	match(...expected: TokenType[]): Token | null {
		if (this.pos < this.tokens.length) {
			const currentToken = this.tokens[this.pos];
			for (let i = 0; i < expected.length; i++) {
				if (currentToken.type.name == expected[i].name) {
					this.pos += 1;
					return currentToken;
				}
			}
		}
		return null;
	}

	require(...expected: TokenType[]): Token {
		const token = this.match(...expected);
		if (!token) {
			throw new Error(`на позиции ${this.pos} ожидается ${expected[0].name}`)
		}
		return token;
	}

	parseVarOrNumOrBool() {
		const number = this.match(TokenTypes.NUMBER);
		if (number) return new NumberNode(number);
		const variable = this.match(TokenTypes.VARIABLE);
		if (variable) return new VariableNode(variable, false);
		const inv_variable = this.match(TokenTypes.INVERSE_VARIABLE);
		if (inv_variable) return new VariableNode(inv_variable, false);
		const bool = this.match(TokenTypes.BOOLEAN);
		if (bool) return new BooleanNode(bool);
		throw new Error(`Ошибка на позиции ${this.pos}`);
	}

	parsePerehenses(): Node {
		if (this.match(TokenTypes.LPAR)) {
			const node = this.parseFormula();
			this.require(TokenTypes.RPAR);
			return node;
		}
		else if (this.match(TokenTypes.COMMAND)) {
			return this.parseFunctionInFormula(this.tokens[this.pos-1]);
		}
		else {
			return this.parseVarOrNumOrBool();
		}
	}

	parseFormula(): Node {
		let leftNode = this.parsePerehenses();
		let operator = this.match(TokenTypes.SUM, TokenTypes.SUB, TokenTypes.MUL, TokenTypes.DIV, TokenTypes.LESS, TokenTypes.LESSOrEQU, TokenTypes.MORE, TokenTypes.MOREOrEQU);
		while (operator) {
			let rightNode = this.parsePerehenses();
			leftNode = new BinaryNode(operator, leftNode, rightNode);
			operator = this.match(TokenTypes.SUM, TokenTypes.SUB, TokenTypes.MUL, TokenTypes.DIV, TokenTypes.LESS, TokenTypes.LESSOrEQU, TokenTypes.MORE, TokenTypes.MOREOrEQU);
		}
		return leftNode;	
	}

	parseFunctionInFormula(func: Token): Node {
		this.require(TokenTypes.LPAR);
		let form = [this.parseFormula()];
		while (this.match(TokenTypes.COMMA)) {
			form.push(this.parseFormula());
		}
		const result = new UnarNode(func, form);
		this.require(TokenTypes.RPAR);
		return result;
	}

	parseFunction(): Node {
		const func = this.require(TokenTypes.COMMAND);
		const form = this.parseFormula();
		if (func) return new UnarNode(func, [form]);
		throw new Error(`Ошибка на позиции ${this.pos}`);
	}

	parseWhileOrCond(): Node {
		const operator = this.tokens[this.pos++];
		this.require(TokenTypes.LPAR);
		const expression = this.parseFormula();
		this.require(TokenTypes.RPAR);
		this.require(TokenTypes.LBRACE);

		let body_tokens: Token[] = [];

		let brance_count = 1;

		while (this.pos < this.tokens.length) {
			if (this.match(TokenTypes.RBRACE)) {
				if (brance_count == 1) {
					break;
				}
				else {
					brance_count -= 1;
					this.pos -= 1;
				}
			}

			if (this.match(TokenTypes.LBRACE)) {
				brance_count += 1;
				this.pos -= 1;
			}
			
			body_tokens.push(this.tokens[this.pos++]);
		}

		let last_pos = this.pos;
		let last_tokens = this.tokens;
		this.pos = 0;

		const node = new BinaryNode(operator, expression, this.parse(body_tokens));

		this.pos = last_pos;
		this.tokens = last_tokens;

		return node;
	}

	parseExpression(): Node {
		if (this.match(TokenTypes.VARIABLE)) {
			this.pos -= 1;
			const variable = this.parseVarOrNumOrBool();
			const assign = this.require(TokenTypes.ASSIGN);
			const rightNode = this.parseFormula();
			const node = new BinaryNode(assign, variable, rightNode);
			return node;
		} else if (this.match(TokenTypes.WHILE, TokenTypes.COND)) {
			this.pos -= 1;
			return this.parseWhileOrCond();
		}
		else {
			return this.parseFunction();
		}
	}

	parse(tokens: Token[]): MainNode {
		this.tokens = tokens;

		const root = new MainNode();

		while (this.pos < this.tokens.length) {
			const node = this.parseExpression();
			this.require(TokenTypes.SEMICOLON);
			root.addNode(node);
		}

		 return root;
	}

	run(node: Node): any {
		if (node instanceof NumberNode) {
			return parseFloat(node.number.value);
		}
		else if (node instanceof BooleanNode) {
			return node.bool.value == "true" ? true : false
		}
		else if (node instanceof UnarNode) {
			const func = node.operator;
			let param = [];
			for (let i = 0; i < node.rightNode.length; i++)
				param.push(this.run(node.rightNode[i]));
			return functions[func.value](...param);
		}
		else if (node instanceof BinaryNode) {
			switch (node.operator.type.name) {
				case TokenTypes.SUM.name:
					return this.run(node.leftNode) + this.run(node.rightNode)
				case TokenTypes.SUB.name:
					return this.run(node.leftNode) - this.run(node.rightNode)
				case TokenTypes.MUL.name:
					return this.run(node.leftNode) * this.run(node.rightNode)
				case TokenTypes.DIV.name:
					return this.run(node.leftNode) / this.run(node.rightNode)
				case TokenTypes.LESS.name:
					return this.run(node.leftNode) < this.run(node.rightNode)
				case TokenTypes.LESSOrEQU.name:
					return this.run(node.leftNode) <= this.run(node.rightNode)
				case TokenTypes.MORE.name:
					return this.run(node.leftNode) > this.run(node.rightNode)
				case TokenTypes.MOREOrEQU.name:
					return this.run(node.leftNode) >= this.run(node.rightNode)
				case TokenTypes.WHILE.name:
					while (this.run(node.leftNode)) {
						this.run(node.rightNode);
					}
					return;
				case TokenTypes.COND.name:
					if (this.run(node.leftNode)) {
						this.run(node.rightNode);
					}
					return;
				case TokenTypes.ASSIGN.name:
					const result = this.run(node.rightNode)
					const variableNode = <VariableNode>node.leftNode;
					this.scope[variableNode.variable.value] = result;
					return result;
			}
		}
		else if (node instanceof VariableNode) {
			const name = node.variable.value.split("-");
			if (this.scope[name[name.length-1]] != void 0) {
				return this.scope[name[name.length-1]] * (name.length == 2 ? -1 : 1);
			} else {
				throw new Error(`Переменная с названием ${name[name.length-1]} не обнаружена`)
			}
		}
		else if (node instanceof MainNode) {
			for (let i = 0; i < node.nodes.length; i++) {
				this.run(node.nodes[i]);
			}
			return;
		}
		else if (node instanceof Node) {
			return;
		}
		throw new Error('Ошибка!')
	}
}