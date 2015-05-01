
/// <reference path="Manager.ts" />

/*
 * Used only internally to generate distinct ids for entities and reuse them.
 */
class IdentifierPool {
	private _ids : Bag<number>;
	private _nextAvailableId : number;

	constructor() {
		this._ids = new Bag<number>();
	}
	
	public checkOut() : number {
		if(this._ids.size() > 0) {
			return this._ids.removeLast();
		}
		return this._nextAvailableId++;
	}
	
	public checkIn(id : number) {
		this._ids.add(id);
	}
}

class EntityManager extends Manager {
	private _entities : Bag<Entity>;
	private _disabled : BitSet;
	
	private _active : number;
	private _added : number;
	private _created : number;
	private _deleted : number;

	private _identifierPool : IdentifierPool;
	
	constructor() {
		super();
		this._entities = new Bag<Entity>();
		this._disabled = new BitSet();
		this._identifierPool = new IdentifierPool();
	}
	
	public initialize() {
	}

	public createEntityInstance() : Entity {
		var e: Entity = new Entity(this._world, this._identifierPool.checkOut());
		this._created++;
		return e;
	}
	
	public added(e: Entity) {
		this._active++;
		this._added++;
		this._entities.set(e.getId(), e);
	}
	
	public enabled(e: Entity) {
		this._disabled.clear(e.getId());
	}
	
	public disabled(e: Entity) {
		this._disabled.set(e.getId());
	}
	
	public deleted(e: Entity) {
		this._entities.set(e.getId(), null);
		
		this._disabled.clear(e.getId());
		
		this._identifierPool.checkIn(e.getId());
		
		this._active--;
		this._deleted++;
	}


	/**
	 * Check if this entity is active.
	 * Active means the entity is being actively processed.
	 * 
	 * @param entityId
	 * @return true if active, false if not.
	 */
	public isActive(entityId: number) : boolean {
		return this._entities.get(entityId) != null;
	}
	
	/**
	 * Check if the specified entityId is enabled.
	 * 
	 * @param entityId
	 * @return true if the entity is enabled, false if it is disabled.
	 */
	public isEnabled(entityId: number) : boolean {
		return !this._disabled.get(entityId);
	}
	
	/**
	 * Get a entity with this id.
	 * 
	 * @param entityId
	 * @return the entity
	 */
	public getEntity(entityId: number) : Entity {
		return this._entities.get(entityId);
	}
	
	/**
	 * Get how many entities are active in this world.
	 * @return how many entities are currently active.
	 */
	public getActiveEntityCount() : number {
		return this._active;
	}
	
	/**
	 * Get how many entities have been created in the world since start.
	 * Note: A created entity may not have been added to the world, thus
	 * created count is always equal or larger than added count.
	 * @return how many entities have been created since start.
	 */
	public getTotalCreated() : number {
		return this._created;
	}
	
	/**
	 * Get how many entities have been added to the world since start.
	 * @return how many entities have been added.
	 */
	public getTotalAdded() : number {
		return this._added;
	}
	
	/**
	 * Get how many entities have been deleted from the world since start.
	 * @return how many entities have been deleted since start.
	 */
	public getTotalDeleted() : number {
		return this._deleted;
	}		

}
