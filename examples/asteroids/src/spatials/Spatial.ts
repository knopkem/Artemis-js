/// <reference path="../../../../src/World.ts" />
/// <reference path="../../../../src/Entity.ts" />

interface ISpatial {
	initalize();

	render();
	
}

class Spatial {
	protected _world: World;
	protected _owner: Entity;

	constructor(world: World, owner: Entity) {
		this._world = world;
		this._owner = owner;
	}
}