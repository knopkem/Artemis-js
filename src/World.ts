
/// <reference path='utils/Bag.ts'/>
/// <reference path='utils/BitSet.ts'/>
/// <reference path='Manager.ts'/>
/// <reference path='Entity.ts'/>
/// <reference path='EntityManager.ts'/>
/// <reference path='ComponentManager.ts'/>
/// <reference path='ComponentMapper.ts'/>
/// <reference path='EntitySystem.ts'/>

/*
 * Only used internally to maintain clean code.
 */
interface Performer {
	perform(observer : EntityObserver, e : Entity);
}

class AddPerformer implements Performer {
	perform(observer : EntityObserver, e : Entity) {
		observer.added(e);
	}
}

class ChangePerformer implements Performer {
	perform(observer : EntityObserver, e : Entity) {
		observer.changed(e);
	}	
}

class DisablePerformer implements Performer {
	perform(observer : EntityObserver, e : Entity) {
		observer.disabled(e);
	}	
}

class EnablePerformer implements Performer {
	perform(observer : EntityObserver, e : Entity) {
		observer.enabled(e);
	}	
}

class DeletePerformer implements Performer {
	perform(observer : EntityObserver, e : Entity) {
		observer.deleted(e);
	}	
}

	
class ComponentMapperInitHelper {

	public static config(target: Object, world: World) {
		try {
			/*
			Class<?> clazz = target.getClass();
			for (Field field : clazz.getDeclaredFields()) {
				Mapper annotation = field.getAnnotation(Mapper.class);
				if (annotation != null && Mapper.class.isAssignableFrom(Mapper.class)) {
					ParameterizedType genericType = (ParameterizedType) field.getGenericType();
					Class componentType = (Class) genericType.getActualTypeArguments()[0];

					field.setAccessible(true);
					field.set(target, world.getMapper(componentType));
				}
			}
			*/
		} catch (e) {
			throw ("Error while setting component mappers", e);
		}
	}

}

/**
 * The primary instance for the framework. It contains all the managers.
 * 
 * You must use this to create, delete and retrieve entities.
 * 
 * It is also important to set the delta each game loop iteration, and initialize before game loop.
 * 
 * 
 */
class World {
	private _em : EntityManager;
	private _cm : ComponentManager;

	public  _delta : number;
	private _added : Bag<Entity>;
	private _changed : Bag<Entity>;
	private _deleted : Bag<Entity>;
	private _enable : Bag<Entity>;
	private _disable : Bag<Entity>;

	private _managers : { [key:any]:Manager; } //private Map<Class<? extends Manager>, Manager> managers;
	private _managersBag : Bag<Manager>;
	
	private _systems : { [key:any]:EntitySystem; } // private Map<Class<?>, EntitySystem> systems;
	private _systemsBag : Bag<EntitySystem>;
	
	private _mAddedPerformer : AddPerformer;
	private _mChangedPerformer : ChangePerformer;
	private _mDisabledPerformer : DisablePerformer;
	private _mEnabledPerformer : EnablePerformer;
	private _mDeletedPerformer : DeletePerformer;

	constructor() {
		//this._managers = new HashMap<Class<? extends Manager>, Manager>();
		this._managersBag = new Bag<Manager>();
		
		//this._systems = new HashMap<Class<?>, EntitySystem>();
		this._systemsBag = new Bag<EntitySystem>();

		this._added = new Bag<Entity>();
		this._changed = new Bag<Entity>();
		this._deleted = new Bag<Entity>();
		this._enable = new Bag<Entity>();
		this._disable = new Bag<Entity>();

		this._cm = new ComponentManager();
		this.setManager(this._cm);
		
		this._em = new EntityManager();
		this.setManager(this._em);
		
		this._mAddedPerformer = new AddPerformer();
      
        this._mChangedPerformer = new ChangePerformer();
      
        this._mDisabledPerformer = new DisablePerformer();
      
        this._mEnabledPerformer = new EnablePerformer();
      
      	this._mDeletedPerformer = new DeletePerformer();     
		
	}

	
	/**
	 * Makes sure all managers systems are initialized in the order they were added.
	 */
	public initialize() {
		for (var i : number = 0; i < this._managersBag.size(); i++) {
			this._managersBag.get(i).initialize();
		}
		
		for (var i : number = 0; i < this._systemsBag.size(); i++) {
			ComponentMapperInitHelper.config(this._systemsBag.get(i), this);
			this._systemsBag.get(i).initialize();
		}
	}
	
	
	/**
	 * Returns a manager that takes care of all the entities in the world.
	 * entities of this world.
	 * 
	 * @return entity manager.
	 */
	public getEntityManager() : EntityManager {
		return this._em;
	}
	
	/**
	 * Returns a manager that takes care of all the components in the world.
	 * 
	 * @return component manager.
	 */
	public getComponentManager() : ComponentManager {
		return this._cm;
	}
		

	/**
	 * Add a manager into this world. It can be retrieved later.
	 * World will notify this manager of changes to entity.
	 * 
	 * @param manager to be added
	 */
	public setManager(manager : any) : any {
		this._managers[manager.getClass()] = manager;
		this._managersBag.add(manager);
		manager.setWorld(this);
		return manager;
	}

	/**
	 * Returns a manager of the specified type.
	 * 
	 * @param <T>
	 * @param managerType
	 *            class type of the manager
	 * @return the manager
	 */
	public getManager(managerType : any) : any {
		return managerType.cast(this._managers[managerType]);
	}
	
	/**
	 * Deletes the manager from this world.
	 * @param manager to delete.
	 */
	public deleteManager(manager : Manager) {
		//this._managers[manager] = '';
		this._managersBag.removeType(manager);
	}

	
	
	
	/**
	 * Time since last game loop.
	 * 
	 * @return delta time since last game loop.
	 */
	public getDelta() : number {
		return this._delta;
	}

	/**
	 * You must specify the delta for the game here.
	 * 
	 * @param delta time since last game loop.
	 */
	public setDelta(delta : number) {
		this._delta = delta;
	}
	


	/**
	 * Adds a entity to this world.
	 * 
	 * @param e entity
	 */
	public addEntity(e: Entity) {
		this._added.add(e);
	}
	
	/**
	 * Ensure all systems are notified of changes to this entity.
	 * If you're adding a component to an entity after it's been
	 * added to the world, then you need to invoke this method.
	 * 
	 * @param e entity
	 */
	public changedEntity(e : Entity) {
		this._changed.add(e);
	}
	
	/**
	 * Delete the entity from the world.
	 * 
	 * @param e entity
	 */
	public deleteEntity(e: Entity) {
		if (!this._deleted.contains(e)) {
			this._deleted.add(e);
		}
	}

	/**
	 * (Re)enable the entity in the world, after it having being disabled.
	 * Won't do anything unless it was already disabled.
	 */
	public enable(e: Entity) {
		this._enable.add(e);
	}

	/**
	 * Disable the entity from being processed. Won't delete it, it will
	 * continue to exist but won't get processed.
	 */
	public disable(e: Entity) {
		this._disable.add(e);
	}


	/**
	 * Create and return a new or reused entity instance.
	 * Will NOT add the entity to the world, use World.addEntity(Entity) for that.
	 * 
	 * @return entity
	 */
	public createEntity() : Entity {
		return this._em.createEntityInstance();
	}

	/**
	 * Get a entity having the specified id.
	 * 
	 * @param entityId
	 * @return entity
	 */
	public getEntity(entityId : number) : Entity {
		return this._em.getEntity(entityId);
	}

	


	/**
	 * Gives you all the systems in this world for possible iteration.
	 * 
	 * @return all entity systems in world.
	 */
	public getSystems() : ImmutableBag<EntitySystem> {
		return this._systemsBag;
	}

	/**
	 * Adds a system to this world that will be processed by World.process()
	 * 
	 * @param system the system to add.
	 * @return the added system.
	 */
	public setSystem(system : any)  /*<T extends EntitySystem> T*/ {
		return this.setSystem2(system, false);
	}

	/**
	 * Will add a system to this world.
	 *  
	 * @param system the system to add.
	 * @param passive wether or not this system will be processed by World.process()
	 * @return the added system.
	 */
	public setSystem2(system : any, passive : boolean) {
		system.setWorld(this);
		system.setPassive(passive);
		
		this._systems.put(system.getClass(), system);
		this._systemsBag.add(system);
		
		return system;
	}
	
	/**
	 * Removed the specified system from the world.
	 * @param system to be deleted from world.
	 */
	public deleteSystem(system: EntitySystem) {
		this._systems.remove(system.getClass());
		this._systemsBag.remove(system);
	}
	
	private notifySystems(performer : Performer, e: Entity) {
		for(var i : number = 0, s = this._systemsBag.size(); s > i; i++) {
			performer.perform(systemsBag.get(i), e);
		}
	}

	private notifyManagers(performer: Performer, e: Entity) {
		for(var a = 0; this._managersBag.size() > a; a++) {
			performer.perform(this._managersBag.get(a), e);
		}
	}
	
	/**
	 * Retrieve a system for specified system type.
	 * 
	 * @param type type of system.
	 * @return instance of the system in this world.
	 */
	public getSystem(type : any)  /*<T extends EntitySystem> T*/ {
		return this._systems[type];
	}

	
	/**
	 * Performs an action on each entity.
	 * @param entities
	 * @param performer
	 */
	private check(entities: Bag<Entity>, performer: Performer) {
		if (!entities.isEmpty()) {
			for (var i : number = 0; entities.size() > i; i++) {
				var e : Entity = entities.get(i);
				this.notifyManagers(performer, e);
				this.notifySystems(performer, e);
			}
			entities.clear();
		}
	}

	
	/**
	 * Process all non-passive systems.
	 */
	public process() {
		this.check(this._added, this._mAddedPerformer);
		this.check(this._changed, this._mChangedPerformer);
		this.check(this._disable, this._mDisabledPerformer);
		this.check(this._enable, this._mEnabledPerformer);
		this.check(this._deleted, this._mDeletedPerformer);
		
		this._cm.clean();
		
		for(var i : number = 0; this._systemsBag.size() > i; i++) {
			var system : EntitySystem = this._systemsBag.get(i);
			if(!system.isPassive()) {
				system.process();
			}
		}
	}
	

	/**
	 * Retrieves a ComponentMapper instance for fast retrieval of components from entities.
	 * 
	 * @param type of component to get mapper for.
	 * @return mapper for specified component type.
	 */
	public getMapper(type : any) : ComponentMapper<any>   /*<T extends Component>*/ {
		return ComponentMapper.getFor(type, this);
	}


}