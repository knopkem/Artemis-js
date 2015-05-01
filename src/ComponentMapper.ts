/// <reference path="ComponentType.ts" />
/// <reference path="ComponentTypeManager.ts" />
/// <reference path="utils/Bag.ts" />
/// <reference path="World.ts" />


/**
 * High performance component retrieval from entities. Use this wherever you
 * need to retrieve components from entities often and fast.
 */
class ComponentMapper<T> {
	private _type: ComponentType;
	private _classType: any;
	private _components: Bag<Component>;

	constructor(type: T, world: World) {
		this._type = ComponentTypeManager.getTypeFor(type);
		this._components = world.getComponentManager().getComponentsByType(this._type);
		this._classType = type;
	}

	/**
	 * Fast but unsafe retrieval of a component for this entity.
	 * No bounding checks, so this could throw an ArrayIndexOutOfBoundsExeption,
	 * however in most scenarios you already know the entity possesses this component.
	 * 
	 * @param e the entity that should possess the component
	 * @return the instance of the component
	 */
	public get(e: Entity) : Component {
		return this._components.get(e.getId());
	}

	/**
	 * Fast and safe retrieval of a component for this entity.
	 * If the entity does not have this component then null is returned.
	 * 
	 * @param e the entity that should possess the component
	 * @return the instance of the component
	 */
	public getSafe(e: Entity): Component {
		if(this._components.isIndexWithinBounds(e.getId())) {
			return this._components.get(e.getId());
		}
		return null;
	}
	
	/**
	 * Checks if the entity has this type of component.
	 * @param e the entity to check
	 * @return true if the entity has this component type, false if it doesn't.
	 */
	public has(e: Entity): boolean {
		return this.getSafe(e) != null;		
	}

	/**
	 * Returns a component mapper for this type of components.
	 * 
	 * @param type the type of components this mapper uses.
	 * @param world the world that this component mapper should use.
	 * @return a new mapper.
	 */
	public getFor(type: T, world: World): ComponentMapper<T> {
		return new ComponentMapper<T>(type, world);
	}	
}