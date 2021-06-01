import Token from "../token";
import Node from "./node";

export default class VariableNode extends Node {
	variable: Token;
	inverse: boolean;

	constructor(variable: Token, inverse: boolean) {
		super();
		this.variable = variable;
		this.inverse = inverse;
	}
}