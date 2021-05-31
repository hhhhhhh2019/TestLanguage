import Node from "./node"

export default class MainNode extends Node {
	nodes: Node[] = [];

	addNode(node: Node) {
		this.nodes.push(node);
	}
}