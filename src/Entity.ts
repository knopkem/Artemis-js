
/// <reference path='utils/Bag.ts'/>
/// <reference path='utils/BitSet.ts'/>
/// <reference path='World.ts'/>
/// <reference path='EntityManager.ts'/>
/// <reference path='ComponentManager.ts'/>
/// <reference path='ComponentTypeManager.ts'/>

class Entity {
	
	private _id : number;
	private _componentBits : BitSet;
	private _systemBits : BitSet;

	private _world : World;
	private _entityManager : EntityManager;
	private _componentManager : ComponentManager;
	
	// should not be accessible (not possible)
	constructor(world : World, id : number) {
		this._world = world;
		this._id = id;
		this._entityManager = world.getEntityManager();
		this._componentManager = world.getComponentManager();
		this._systemBits = new BitSet();
		this._componentBits = new BitSet();
		
		this.reset();
	}

	/**
	 * The internal id for this entity within the framework. No other entity
	 * will have the same ID, but ID's are however reused so another entity may
	 * acquire this ID if the previous entity was deleted.
	 * 
	 * @return id of the entity.
	 */
	public getId() : number {
		return this._id;
	}

	/**
	 * Returns a BitSet instance containing bits of the components the entity possesses.
	 * @return
	 */
	public getComponentBits() : BitSet {
		return this._componentBits;
	}
	
	/**
	 * Returns a BitSet instance containing bits of the components the entity possesses.
	 * @return
	 */
	public getSystemBits() : BitSet {
		return this._systemBits;
	}

	/**
	 * Make entity ready for re-use.
	 * Will generate a new uuid for the entity.
	 */
	protected reset() {
		this._systemBits.clear();
		this._componentBits.clear();
	}

	public toString() : string {
		return "Entity[" + this._id + "]";
	}

	/**
	 * Add a component to this entity.
	 * 
	 * @param component to add to this entity
	 * 
	 * @return this entity for chaining.
	 */
	public addComponent(component : Component) : Entity {
		this.addComponentWithType(component, ComponentTypeManager.getTypeFor(component));
		return this;
	}
	
	/**
	 * Faster adding of components into the entity. Not neccessery to use this, but
	 * in some cases you might need the extra performance.
	 * 
	 * @param component the component to add
	 * @param type of the component
	 * 
	 * @return this entity for chaining.
	 */
	public addComponentWithType(component : Component, type : ComponentType) : Entity {
		this._componentManager.addComponent(this, type, component);
		return this;
	}

	/**
	 * Removes the component from this entity.
	 * 
	 * @param component to remove from this entity.
	 * 
	 * @return this entity for chaining.
	 */
	public removeComponent(component : Component) : Entity {
		this.removeComponentByComponentType(ComponentTypeManager.getTypeFor(component));
		return this;
	}

	/**
	 * Faster removal of components from a entity.
	 * 
	 * @param component to remove from this entity.
	 * 
	 * @return this entity for chaining.
	 */
	public removeComponentByComponentType(type : ComponentType ) : Entity {
		this._componentManager.removeComponent(this, type);
		return this;
	}
	
	/**
	 * Remove component by its type.
	 * @param type
	 * 
	 * @return this entity for chaining.
	 */
	//public removeComponentByType(type: any) : Entity /*Class<? extends Component>*/ {
	//	this.removeComponent(ComponentTypeManager.getTypeFor(type));
	//	return this;
	//}

	/**
	 * Checks if the entity has been added to the world and has not been deleted from it.
	 * If the entity has been disabled this will still return true.
	 * 
	 * @return if it's active.
	 */
	public isActive() : boolean {
		return this._entityManager.isActive(this._id);
	}
	
	/**
	 * Will check if the entity is enabled in the world.
	 * By default all entities that are added to world are enabled,
	 * this will only return false if an entity has been explicitly disabled.
	 * 
	 * @return if it's enabled
	 */
	public isEnabled() : boolean {
		return this._entityManager.isEnabled(this._id);
	}
	
	/**
	 * This is the preferred method to use when retrieving a component from a
	 * entity. It will provide good performance.
	 * But the recommended way to retrieve components from an entity is using
	 * the ComponentMapper.
	 * 
	 * @param type
	 *            in order to retrieve the component fast you must provide a
	 *            ComponentType instance for the expected component.
	 * @return
	 */
	public getComponent(type : ComponentType) : Component {
		return this._componentManager.getComponent(this, type);
	}

	/**
	 * Slower retrieval of components from this entity. Minimize usage of this,
	 * but is fine to use e.g. when creating new entities and setting data in
	 * components.
	 * 
	 * @param <T>
	 *            the expected return component type.
	 * @param type
	 *            the expected return component type.
	 * @return component that matches, or null if none is found.
	 */
	//public getComponentByComponent(type : any) : any /*<T extends Component> T */ {
	//	return this.getComponent(ComponentType.getTypeFor(type));
	//}

	/**
	 * Returns a bag of all components this entity has.
	 * You need to reset the bag yourself if you intend to fill it more than once.
	 * 
	 * @param fillBag the bag to put the components into.
	 * @return the fillBag with the components in.
	 */
	public getComponents(fillBag : Bag<Component>) : Bag<Component> {
		return this._componentManager.getComponentsFor(this, fillBag);
	}

	/**
	 * Refresh all changes to components for this entity. After adding or
	 * removing components, you must call this method. It will update all
	 * relevant systems. It is typical to call this after adding components to a
	 * newly created entity.
	 */
	public addToWorld() {
		this._world.addEntity(this);
	}
	
	/**
	 * This entity has changed, a component added or deleted.
	 */
	public changedInWorld() {
		this._world.changedEntity(this);
	}

	/**
	 * Delete this entity from the world.
	 */
	public deleteFromWorld() {
		this._world.deleteEntity(this);
	}
	
	/**
	 * (Re)enable the entity in the world, after it having being disabled.
	 * Won't do anything unless it was already disabled.
	 */
	public enable() {
		this._world.enable(this);
	}
	
	/**
	 * Disable the entity from being processed. Won't delete it, it will
	 * continue to exist but won't get processed.
	 */
	public disable() {
		this._world.disable(this);
	}

	/**
	 * Returns the world this entity belongs to.
	 * @return world of entity.
	 */
	public getWorld() : World {
		return this._world;
	}
}
