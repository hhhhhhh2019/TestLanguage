import Token from "../token";
import Node from "./node";

export default class BooleanNode extends Node {
	bool: Token;

	constructor(bool: Token) {
		super();
		this.bool = bool;
	}
}