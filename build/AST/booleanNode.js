"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_1 = __importDefault(require("./node"));
class BooleanNode extends node_1.default {
    constructor(bool) {
        super();
        this.bool = bool;
    }
}
exports.default = BooleanNode;
