"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const binaryNode_1 = __importDefault(require("./AST/binaryNode"));
const booleanNode_1 = __importDefault(require("./AST/booleanNode"));
const mainNode_1 = __importDefault(require("./AST/mainNode"));
const node_1 = __importDefault(require("./AST/node"));
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
            "$PI": "3.1415926535897932384626433832795",
            "$E": "2.71828182846",
        };
    }
    match(...expected) {
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
    require(...expected) {
        const token = this.match(...expected);
        if (!token) {
            throw new Error(`на позиции ${this.pos} ожидается ${expected[0].name}`);
        }
        return token;
    }
    parseVarOrNumOrBool() {
        const number = this.match(tokenType_1.TokenTypes.NUMBER);
        if (number)
            return new numberNode_1.default(number);
        const variable = this.match(tokenType_1.TokenTypes.VARIABLE);
        if (variable)
            return new variableNode_1.default(variable, false);
        const inv_variable = this.match(tokenType_1.TokenTypes.INVERSE_VARIABLE);
        if (inv_variable)
            return new variableNode_1.default(inv_variable, false);
        const bool = this.match(tokenType_1.TokenTypes.BOOLEAN);
        if (bool)
            return new booleanNode_1.default(bool);
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
            return this.parseVarOrNumOrBool();
        }
    }
    parseFormula() {
        let leftNode = this.parsePerehenses();
        let operator = this.match(tokenType_1.TokenTypes.SUM, tokenType_1.TokenTypes.SUB, tokenType_1.TokenTypes.MUL, tokenType_1.TokenTypes.DIV, tokenType_1.TokenTypes.LESS, tokenType_1.TokenTypes.LESSOrEQU, tokenType_1.TokenTypes.MORE, tokenType_1.TokenTypes.MOREOrEQU);
        while (operator) {
            let rightNode = this.parsePerehenses();
            leftNode = new binaryNode_1.default(operator, leftNode, rightNode);
            operator = this.match(tokenType_1.TokenTypes.SUM, tokenType_1.TokenTypes.SUB, tokenType_1.TokenTypes.MUL, tokenType_1.TokenTypes.DIV, tokenType_1.TokenTypes.LESS, tokenType_1.TokenTypes.LESSOrEQU, tokenType_1.TokenTypes.MORE, tokenType_1.TokenTypes.MOREOrEQU);
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
    parseWhileOrCond() {
        const operator = this.tokens[this.pos++];
        this.require(tokenType_1.TokenTypes.LPAR);
        const expression = this.parseFormula();
        this.require(tokenType_1.TokenTypes.RPAR);
        this.require(tokenType_1.TokenTypes.LBRACE);
        let body_tokens = [];
        let brance_count = 1;
        while (this.pos < this.tokens.length) {
            if (this.match(tokenType_1.TokenTypes.RBRACE)) {
                if (brance_count == 1) {
                    break;
                }
                else {
                    brance_count -= 1;
                    this.pos -= 1;
                }
            }
            if (this.match(tokenType_1.TokenTypes.LBRACE)) {
                brance_count += 1;
                this.pos -= 1;
            }
            body_tokens.push(this.tokens[this.pos++]);
        }
        let last_pos = this.pos;
        let last_tokens = this.tokens;
        this.pos = 0;
        const node = new binaryNode_1.default(operator, expression, this.parse(body_tokens));
        this.pos = last_pos;
        this.tokens = last_tokens;
        return node;
    }
    parseExpression() {
        if (this.match(tokenType_1.TokenTypes.VARIABLE)) {
            this.pos -= 1;
            const variable = this.parseVarOrNumOrBool();
            const assign = this.require(tokenType_1.TokenTypes.ASSIGN);
            const rightNode = this.parseFormula();
            const node = new binaryNode_1.default(assign, variable, rightNode);
            return node;
        }
        else if (this.match(tokenType_1.TokenTypes.WHILE, tokenType_1.TokenTypes.COND)) {
            this.pos -= 1;
            return this.parseWhileOrCond();
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
        else if (node instanceof booleanNode_1.default) {
            return node.bool.value == "true" ? true : false;
        }
        else if (node instanceof unarNode_1.default) {
            const func = node.operator;
            let param = [];
            for (let i = 0; i < node.rightNode.length; i++)
                param.push(this.run(node.rightNode[i]));
            return functions_1.functions[func.value](...param);
        }
        else if (node instanceof binaryNode_1.default) {
            switch (node.operator.type.name) {
                case tokenType_1.TokenTypes.SUM.name:
                    return this.run(node.leftNode) + this.run(node.rightNode);
                case tokenType_1.TokenTypes.SUB.name:
                    return this.run(node.leftNode) - this.run(node.rightNode);
                case tokenType_1.TokenTypes.MUL.name:
                    return this.run(node.leftNode) * this.run(node.rightNode);
                case tokenType_1.TokenTypes.DIV.name:
                    return this.run(node.leftNode) / this.run(node.rightNode);
                case tokenType_1.TokenTypes.LESS.name:
                    return this.run(node.leftNode) < this.run(node.rightNode);
                case tokenType_1.TokenTypes.LESSOrEQU.name:
                    return this.run(node.leftNode) <= this.run(node.rightNode);
                case tokenType_1.TokenTypes.MORE.name:
                    return this.run(node.leftNode) > this.run(node.rightNode);
                case tokenType_1.TokenTypes.MOREOrEQU.name:
                    return this.run(node.leftNode) >= this.run(node.rightNode);
                case tokenType_1.TokenTypes.WHILE.name:
                    while (this.run(node.leftNode)) {
                        this.run(node.rightNode);
                    }
                    return;
                case tokenType_1.TokenTypes.COND.name:
                    if (this.run(node.leftNode)) {
                        this.run(node.rightNode);
                    }
                    return;
                case tokenType_1.TokenTypes.ASSIGN.name:
                    const result = this.run(node.rightNode);
                    const variableNode = node.leftNode;
                    this.scope[variableNode.variable.value] = result;
                    return result;
            }
        }
        else if (node instanceof variableNode_1.default) {
            const name = node.variable.value.split("-");
            if (this.scope[name[name.length - 1]] != void 0) {
                return this.scope[name[name.length - 1]] * (name.length == 2 ? -1 : 1);
            }
            else {
                throw new Error(`Переменная с названием ${name[name.length - 1]} не обнаружена`);
            }
        }
        else if (node instanceof mainNode_1.default) {
            for (let i = 0; i < node.nodes.length; i++) {
                this.run(node.nodes[i]);
            }
            return;
        }
        else if (node instanceof node_1.default) {
            return;
        }
        throw new Error('Ошибка!');
    }
}
exports.default = Syntax;
