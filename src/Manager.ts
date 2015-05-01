/// <reference path='Entity.ts'/>
/// <reference path='EntityObserver.ts'/>
/// <reference path='World.ts'/>

class Manager implements EntityObserver {
	protected _world : World;
	
	public initialize() : void {
		throw new Error('This method is abstract');
	}

	public setWorld(world : World) : void {
		this._world = world;
	}

	public getWorld() : World {
		return this._world;
	}
	
	public added(e : Entity) : void {
	}
	
	public changed(e : Entity) : void{
	}
	
	public deleted(e : Entity) : void{
	}
	
	public disabled(e : Entity) : void{
	}
	
	public enabled(e : Entity) : void{
	}
}
