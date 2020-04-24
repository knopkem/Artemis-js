/// <reference path="Component.ts" />

class ComponentType {
	private static INDEX : number = 0;

	private _index : number;

	constructor(type: Component) {
		this._index = ComponentType.INDEX++;
	}
	public getIndex() : number {
		return this._index;
	}
}