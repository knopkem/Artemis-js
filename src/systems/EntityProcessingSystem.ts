/// <reference path="../EntitySystem.ts" />
/// <reference path="../Entity.ts" />
/// <reference path="../Aspect.ts" />


/**
 * A typical entity system. Use this when you need to process entities possessing the
 * provided component types.
 *
 */
class EntityProcessingSystem extends EntitySystem {
	
	constructor(aspect: Aspect) {
		super(aspect);
	}

	/**
	 * Process a entity this system is interested in.
	 * @param e the entity to process.
	 */
	public process(e? : Entity) {
		throw new Error('abstract function called');
	};

	protected processEntities(entities: ImmutableBag<Entity>) {
		for (var i = 0, s = entities.size(); s > i; i++) {
			this.process(entities.get(i));
		}
	}
	
	protected checkProcessing() : boolean {
		return true;
	}
	
}