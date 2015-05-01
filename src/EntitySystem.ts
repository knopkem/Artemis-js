/// <reference path='Entity.ts'/>
/// <reference path='EntityObserver.ts'/>
/// <reference path='Aspect.ts'/>
/// <reference path='utils/BitSet.ts'/>
/// <reference path='utils/Bag.ts'/>
/// <reference path="depends/hashtable.d.ts" />

/**
 * Used to generate a unique bit for each system.
 * Only used internally in EntitySystem.
 */
class SystemIndexManager {
	private static INDEX : number = 0;
	//private static HashMap<Class<? extends EntitySystem>, Integer> indices = new HashMap<Class<? extends EntitySystem>, Integer>();
	private _indices : Hashtable;
	
	public static getIndexFor(es : any) /*(Class<? extends EntitySystem>*/: number {
		var index : number = this_indices.get(es);
		if(index == null) {
			index = this.INDEX++;
			this._indices.put(es, index);
		}
		return index;
	}
}

/**
 * The most raw entity system. It should not typically be used, but you can create your own
 * entity system handling by extending this. It is recommended that you use the other provided
 * entity system implementations.
 */
class EntitySystem implements EntityObserver {
	private _systemIndex : number;

	protected _world: World;

	private _actives: Bag<Entity>;

	private _aspect: Aspect;

	private _allSet: BitSet;
	private _exclusionSet: BitSet;
	private _oneSet: BitSet;

	private _passive: boolean;

	private _dummy: boolean;
	
	/**
	 * Creates an entity system that uses the specified aspect as a matcher against entities.
	 * @param aspect to match against entities
	 */
	constructor(aspect: Aspect) {
		this._actives = new Bag<Entity>();
		this._aspect = aspect;
		this._allSet = aspect.getAllSet();
		this._exclusionSet = aspect.getExclusionSet();
		this._oneSet = aspect.getOneSet();
		this._systemIndex = SystemIndexManager.getIndexFor(this);
		this._dummy = this._allSet.isEmpty() && this._oneSet.isEmpty(); // This system can't possibly be interested in any entity, so it must be "dummy"
	}
	
	
	/**
	 * libgdx integration for disposable classes.
	 */
	public dispose() {	   
	}
	
	/**
	 * Called before processing of entities begins. 
	 */
	protected begin() {
	}

	public process() {
		if(this.checkProcessing()) {
			this.begin();
			this.processEntities(this._actives);
			this.end();
		}
	}
	
	/**
	 * Called after the processing of entities ends.
	 */
	protected end() {
	}
	
	/**
	 * Any implementing entity system must implement this method and the logic
	 * to process the given entities of the system.
	 * 
	 * @param entities the entities this system contains.
	 */
	protected processEntities(entities: ImmutableBag<Entity>) {
		
	}
	
	/**
	 * 
	 * @return true if the system should be processed, false if not.
	 */
	protected checkProcessing(): boolean {
		return false;
	}

	/**
	 * Override to implement code that gets executed when systems are initialized.
	 */
	public initialize() {		
	};

	/**
	 * Called if the system has received a entity it is interested in, e.g. created or a component was added to it.
	 * @param e the entity that was added to this system.
	 */
	protected inserted(e: Entity) {		
	};

	/**
	 * Called if a entity was removed from this system, e.g. deleted or had one of it's components removed.
	 * @param e the entity that was removed from this system.
	 */
	protected removed(e: Entity) {		
	};

	/**
	 * Will check if the entity is of interest to this system.
	 * @param e entity to check
	 */
	protected check(e: Entity) {
		if(this._dummy) {
			return;
		}
		
		var contains : boolean = e.getSystemBits().get(this._systemIndex) ? true : false;
		var interested : boolean = true; // possibly interested, let's try to prove it wrong.
		
		var componentBits : BitSet = e.getComponentBits();

		// Check if the entity possesses ALL of the components defined in the aspect.
		if(!this._allSet.isEmpty()) {
			for (var i : number = this._allSet.nextSetBit(0); i >= 0; i = this._allSet.nextSetBit(i+1)) {
				if(!componentBits.get(i)) {
					interested = false;
					break;
				}
			}
		}
		
		// Check if the entity possesses ANY of the exclusion components, if it does then the system is not interested.
		if(!this._exclusionSet.isEmpty() && interested) {
			interested = !this._exclusionSet.intersects(componentBits);
		}
		
		// Check if the entity possesses ANY of the components in the oneSet. If so, the system is interested.
		if(!this._oneSet.isEmpty()) {
			interested = this._oneSet.intersects(componentBits);
		}

		if (interested && !contains) {
			this.insertToSystem(e);
		} else if (!interested && contains) {
			this.removeFromSystem(e);
		}
	}

	private removeFromSystem(e: Entity) {
		this._actives.removeType(e);
		e.getSystemBits().clear(this._systemIndex);
		this.removed(e);
	}

	private insertToSystem(e: Entity) {
		this._actives.add(e);
		e.getSystemBits().set(this._systemIndex);
		this.inserted(e);
	}
	
	
	public added(e: Entity) {
		this.check(e);
	}
	
	public changed(e: Entity) {
		this.check(e);
	}
	
	public deleted(e: Entity) {
		if(e.getSystemBits().get(this._systemIndex)) {
			this.removeFromSystem(e);
		}
	}
	
	public disabled(e: Entity) {
		if(e.getSystemBits().get(this._systemIndex)) {
			this.removeFromSystem(e);
		}
	}
	
	public enabled(e: Entity) {
		this.check(e);
	}
	

	protected setWorld(world: World) {
		this._world = world;
	}
	
	protected isPassive() : boolean {
		return this._passive;
	}

	protected setPassive(passive: boolean) {
		this._passive = passive;
	}
	
	public getActives() : ImmutableBag<Entity> {
		return this._actives;
	}
	


}