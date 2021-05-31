import Token from "../token";
import Node from "./node";

export default class BinaryNode extends Node {
	leftNode: Node;
	rightNode: Node;
	operator: Token;

	constructor(operator: Token, leftNode: Node, rightNode: Node) {
		super();
		this.operator = operator;
		this.leftNode = leftNode;
		this.rightNode = rightNode;
	}
}