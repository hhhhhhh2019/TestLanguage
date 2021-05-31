import Token from "../token";
import Node from "./node";

export default class UnarNode extends Node {
	rightNode: Node[];
	operator: Token;

	constructor(operator: Token, rightNode: Node[]) {
		super();
		this.operator = operator;
		this.rightNode = rightNode;
	}
}