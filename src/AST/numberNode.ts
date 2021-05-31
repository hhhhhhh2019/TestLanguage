import Token from "../token";
import Node from "./node";

export default class NumberNode extends Node {
	number: Token;

	constructor(number: Token) {
		super();
		this.number = number;
	}
}