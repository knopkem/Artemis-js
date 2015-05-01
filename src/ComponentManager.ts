/// <reference path='utils/Bag.ts'/>
/// <reference path='utils/BitSet.ts'/>
/// <reference path='Component.ts'/>
/// <reference path='Entity.ts'/>
/// <reference path='Manager.ts'/>
/// <reference path='ComponentType.ts'/>

class ComponentManager extends Manager {
	private _componentsByType : Bag<Bag<Component>>;
	private _deleted : Bag<Entity>;

	constructor() {
		super();
		this._componentsByType = new Bag<Bag<Component>>();
		this._deleted = new Bag<Entity>();
	}
	
	initialize() {
	}

	removeComponentsOfEntity(e : Entity) {
		var componentBits : BitSet = e.getComponentBits();
		for (var i : number = componentBits.nextSetBit(0); i >= 0; i = componentBits.nextSetBit(i+1)) {
			this._componentsByType.get(i).set(e.getId(), null);
		}
		componentBits.clear();
	}
	
	addComponent(e : Entity, type : ComponentType, component : Component) {
		this._componentsByType.ensureCapacity(type.getIndex());
		
		var components : Bag<Component>; 
		components = this._componentsByType.get(type.getIndex());
		
		if(components == null) {
			components = new Bag<Component>();
			this._componentsByType.set(type.getIndex(), components);
		}
		
		components.set(e.getId(), component);

		e.getComponentBits().set(type.getIndex());
	}

	removeComponent(e : Entity, type : ComponentType) {
		if(e.getComponentBits().get(type.getIndex())) {
			this._componentsByType.get(type.getIndex()).set(e.getId(), null);
			e.getComponentBits().clear(type.getIndex());
		}
	}
	
	getComponentsByType(type : ComponentType) : Bag<Component> {
		var components : Bag<Component> = this._componentsByType.get(type.getIndex());
		if(components == null) {
			components = new Bag<Component>();
			this._componentsByType.set(type.getIndex(), components);
		}
		return components;
	}
	
	getComponent(e : Entity, type : ComponentType) : Component {
		var components : Bag<Component> = this._componentsByType.get(type.getIndex());
		if(components != null) {
			return components.get(e.getId());
		}
		return null;
	}
	
	getComponentsFor(e : Entity, fillBag : Bag<Component>) : Bag<Component> {
		var componentBits : BitSet = e.getComponentBits();

		for (var i : number = componentBits.nextSetBit(0); i >= 0; i = componentBits.nextSetBit(i+1)) {
			fillBag.add(this._componentsByType.get(i).get(e.getId()));
		}
		
		return fillBag;
	}

	deleted(e : Entity) {
		this._deleted.add(e);
	}
	
	clean() {
		if(this._deleted.size() > 0) {
			for(var i : number = 0; this._deleted.size() > i; i++) {
				this.removeComponentsOfEntity(this._deleted.get(i));
			}
			this._deleted.clear();
		}
	}

}
