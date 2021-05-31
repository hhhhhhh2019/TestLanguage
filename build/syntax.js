"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binaryNode_1 = __importDefault(require("./AST/binaryNode"));
const mainNode_1 = __importDefault(require("./AST/mainNode"));
const numberNode_1 = __importDefault(require("./AST/numberNode"));
const unarNode_1 = __importDefault(require("./AST/unarNode"));
const variableNode_1 = __importDefault(require("./AST/variableNode"));
const functions_1 = require("./functions");
const tokenType_1 = require("./tokenType");
class Syntax {
    constructor() {
        this.tokens = [];
        this.pos = 0;
        this.scope = {
            "$PI": "3.1415926535897932384626433832795"
        };
    }
    match(...expected) {
        if (this.pos < this.tokens.length) {
            const currentToken = this.tokens[this.pos];
            if (expected.find(type => type.name === currentToken.type.name)) {
                this.pos += 1;
                return currentToken;
            }
        }
        return null;
    }
    require(...expected) {
        const token = this.match(...expected);
        if (!token) {
            throw new Error(`на позиции ${this.pos} ожидается ${expected[0].name}`);
        }
        return token;
    }
    parseVarOrNum() {
        const number = this.match(tokenType_1.TokenTypes.NUMBER);
        if (number)
            return new numberNode_1.default(number);
        const variable = this.match(tokenType_1.TokenTypes.VARIABLE);
        if (variable)
            return new variableNode_1.default(variable);
        throw new Error(`Ошибка на позиции ${this.pos}`);
    }
    parsePerehenses() {
        if (this.match(tokenType_1.TokenTypes.LPAR)) {
            const node = this.parseFormula();
            this.require(tokenType_1.TokenTypes.RPAR);
            return node;
        }
        else if (this.match(tokenType_1.TokenTypes.COMMAND)) {
            return this.parseFunctionInFormula(this.tokens[this.pos - 1]);
        }
        else {
            return this.parseVarOrNum();
        }
    }
    parseFormula() {
        let leftNode = this.parsePerehenses();
        let operator = this.match(tokenType_1.TokenTypes.SUM, tokenType_1.TokenTypes.SUB, tokenType_1.TokenTypes.MUL, tokenType_1.TokenTypes.DIV);
        while (operator) {
            let rightNode = this.parsePerehenses();
            leftNode = new binaryNode_1.default(operator, leftNode, rightNode);
            operator = this.match(tokenType_1.TokenTypes.SUM, tokenType_1.TokenTypes.SUB, tokenType_1.TokenTypes.MUL, tokenType_1.TokenTypes.DIV);
        }
        return leftNode;
    }
    parseFunctionInFormula(func) {
        this.require(tokenType_1.TokenTypes.LPAR);
        let form = [this.parseFormula()];
        while (this.match(tokenType_1.TokenTypes.COMMA)) {
            form.push(this.parseFormula());
        }
        const result = new unarNode_1.default(func, form);
        this.require(tokenType_1.TokenTypes.RPAR);
        return result;
    }
    parseFunction() {
        const func = this.require(tokenType_1.TokenTypes.COMMAND);
        const form = this.parseFormula();
        if (func)
            return new unarNode_1.default(func, [form]);
        throw new Error(`Ошибка на позиции ${this.pos}`);
    }
    parseExpression() {
        if (this.match(tokenType_1.TokenTypes.VARIABLE)) {
            this.pos -= 1;
            const variable = this.parseVarOrNum();
            const assign = this.require(tokenType_1.TokenTypes.ASSIGN);
            const rightNode = this.parseFormula();
            const node = new binaryNode_1.default(assign, variable, rightNode);
            return node;
        }
        else {
            return this.parseFunction();
        }
    }
    parse(tokens) {
        this.tokens = tokens;
        const root = new mainNode_1.default();
        while (this.pos < this.tokens.length) {
            const node = this.parseExpression();
            this.require(tokenType_1.TokenTypes.SEMICOLON);
            root.addNode(node);
        }
        return root;
    }
    run(node) {
        if (node instanceof numberNode_1.default) {
            return parseFloat(node.number.value);
        }
        if (node instanceof unarNode_1.default) {
            const func = node.operator;
            let param = [];
            for (let i = 0; i < node.rightNode.length; i++)
                param.push(this.run(node.rightNode[i]));
            return functions_1.functions[func.value](...param);
        }
        if (node instanceof binaryNode_1.default) {
            switch (node.operator.type.name) {
                case tokenType_1.TokenTypes.SUM.name:
                    return this.run(node.leftNode) + this.run(node.rightNode);
                case tokenType_1.TokenTypes.SUB.name:
                    return this.run(node.leftNode) - this.run(node.rightNode);
                case tokenType_1.TokenTypes.MUL.name:
                    return this.run(node.leftNode) * this.run(node.rightNode);
                case tokenType_1.TokenTypes.DIV.name:
                    return this.run(node.leftNode) / this.run(node.rightNode);
                case tokenType_1.TokenTypes.ASSIGN.name:
                    const result = this.run(node.rightNode);
                    const variableNode = node.leftNode;
                    this.scope[variableNode.variable.value] = result;
                    return result;
            }
        }
        if (node instanceof variableNode_1.default) {
            if (this.scope[node.variable.value]) {
                return this.scope[node.variable.value];
            }
            else {
                throw new Error(`Переменная с названием ${node.variable.value} не обнаружена`);
            }
        }
        if (node instanceof mainNode_1.default) {
            for (let i = 0; i < node.nodes.length; i++) {
                this.run(node.nodes[i]);
            }
            return;
        }
        throw new Error('Ошибка!');
    }
}
exports.default = Syntax;
