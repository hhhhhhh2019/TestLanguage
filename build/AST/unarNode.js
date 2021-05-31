"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __importDefault(require("./node"));
class UnarNode extends node_1.default {
    constructor(operator, rightNode) {
        super();
        this.operator = operator;
        this.rightNode = rightNode;
    }
}
exports.default = UnarNode;
