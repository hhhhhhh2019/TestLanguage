import BinaryNode from "./AST/binaryNode";
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
        "$PI": "3.1415926535897932384626433832795"
    };

    constructor() {}

    match(...expected: TokenType[]): Token | null {
        if (this.pos < this.tokens.length) {
            const currentToken = this.tokens[this.pos];
            if (expected.find(type => type.name === currentToken.type.name)) {
                this.pos += 1;
                return currentToken;
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

    parseVarOrNum() {
        const number = this.match(TokenTypes.NUMBER);
        if (number) return new NumberNode(number);
        const variable = this.match(TokenTypes.VARIABLE);
        if (variable) return new VariableNode(variable);

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
            return this.parseVarOrNum();
        }
    }

    parseFormula(): Node {
        let leftNode = this.parsePerehenses();
        let operator = this.match(TokenTypes.SUM, TokenTypes.SUB, TokenTypes.MUL, TokenTypes.DIV);
        while (operator) {
            let rightNode = this.parsePerehenses();
            leftNode = new BinaryNode(operator, leftNode, rightNode);
            operator = this.match(TokenTypes.SUM, TokenTypes.SUB, TokenTypes.MUL, TokenTypes.DIV);
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

    parseExpression(): Node {
        if (this.match(TokenTypes.VARIABLE)) {
            this.pos -= 1;
            const variable = this.parseVarOrNum();
            const assign = this.require(TokenTypes.ASSIGN);
            const rightNode = this.parseFormula();
            const node = new BinaryNode(assign, variable, rightNode);
            return node;
        } else {
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
        if (node instanceof UnarNode) {
            const func = node.operator;
            let param = [];
            for (let i = 0; i < node.rightNode.length; i++)
                param.push(this.run(node.rightNode[i]));
            return functions[func.value](...param);
        }
        if (node instanceof BinaryNode) {
            switch (node.operator.type.name) {
                case TokenTypes.SUM.name:
                    return this.run(node.leftNode) + this.run(node.rightNode)
                case TokenTypes.SUB.name:
                    return this.run(node.leftNode) - this.run(node.rightNode)
                case TokenTypes.MUL.name:
                    return this.run(node.leftNode) * this.run(node.rightNode)
                case TokenTypes.DIV.name:
                    return this.run(node.leftNode) / this.run(node.rightNode)
                case TokenTypes.ASSIGN.name:
                    const result = this.run(node.rightNode)
                    const variableNode = <VariableNode>node.leftNode;
                    this.scope[variableNode.variable.value] = result;
                    return result;
            }
        }
        if (node instanceof VariableNode) {
            if (this.scope[node.variable.value]) {
                return this.scope[node.variable.value]
            } else {
                throw new Error(`Переменная с названием ${node.variable.value} не обнаружена`)
            }
        }
        if (node instanceof MainNode) {
            for (let i = 0; i < node.nodes.length; i++) {
                this.run(node.nodes[i]);
            }
            return;
        }
        throw new Error('Ошибка!')
    }
}