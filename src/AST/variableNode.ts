import Token from "../token";
import Node from "./node";

export default class VariableNode extends Node {
	variable: Token;

	constructor(variable: Token) {
		super();
		this.variable = variable;
	}
}