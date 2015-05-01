/// <reference path="utils/BitSet.ts" />
/// <reference path="ComponentType.ts" />
/// <reference path="ComponentTypeManager.ts" />


/**
 * An Aspects is used by systems as a matcher against entities, to check if a system is
 * interested in an entity. Aspects define what sort of component types an entity must
 * possess, or not possess.
 * 
 * This creates an aspect where an entity must possess A and B and C:
 * Aspect.getAspectForAll(A.class, B.class, C.class)
 * 
 * This creates an aspect where an entity must possess A and B and C, but must not possess U or V.
 * Aspect.getAspectForAll(A.class, B.class, C.class).exclude(U.class, V.class)
 * 
 * This creates an aspect where an entity must possess A and B and C, but must not possess U or V, but must possess one of X or Y or Z.
 * Aspect.getAspectForAll(A.class, B.class, C.class).exclude(U.class, V.class).one(X.class, Y.class, Z.class)
 *
 * You can create and compose aspects in many ways:
 * Aspect.getEmpty().one(X.class, Y.class, Z.class).all(A.class, B.class, C.class).exclude(U.class, V.class)
 * is the same as:
 * Aspect.getAspectForAll(A.class, B.class, C.class).exclude(U.class, V.class).one(X.class, Y.class, Z.class)
 *
 *
 */
class Aspect {
	
	private _allSet: BitSet;
	private _exclusionSet: BitSet;
	private _oneSet: BitSet;
	
	constructor() {
		this._allSet = new BitSet();
		this._exclusionSet = new BitSet();
		this._oneSet = new BitSet();
	}
	
	public getAllSet(): BitSet {
		return this._allSet;
	}
	
	public getExclusionSet(): BitSet {
		return this._exclusionSet;
	}
	
	public getOneSet(): BitSet {
		return this._oneSet;
	}
	
	/**
	 * Returns an aspect where an entity must possess all of the specified component types.
	 * @param type a required component type
	 * @param types a required component type
	 * @return an aspect that can be matched against entities
	 */
	public all(type: any, types: any): Aspect {
		this._allSet.set(ComponentTypeManager.getIndexFor(type));
		
		for (var t in types) {
			this._allSet.set(ComponentTypeManager.getIndexFor(t));
		}

		return this;
	}
	
	/**
	 * Excludes all of the specified component types from the aspect. A system will not be
	 * interested in an entity that possesses one of the specified exclusion component types.
	 * 
	 * @param type component type to exclude
	 * @param types component type to exclude
	 * @return an aspect that can be matched against entities
	 */
	public exclude(type: any, types: any): Aspect {
		this._exclusionSet.set(ComponentTypeManager.getIndexFor(type));
		
		for (var t in types) {
			this._exclusionSet.set(ComponentTypeManager.getIndexFor(t));
		}
		return this;
	}
	
	/**
	 * Returns an aspect where an entity must possess one of the specified component types.
	 * @param type one of the types the entity must possess
	 * @param types one of the types the entity must possess
	 * @return an aspect that can be matched against entities
	 */
	public one(type: any, types: any): Aspect {
		this._oneSet.set(ComponentTypeManager.getIndexFor(type));
		
		for (var t in types) {
			this._oneSet.set(ComponentTypeManager.getIndexFor(t));
		}
		return this;
	}
	
	/**
	 * Creates an aspect where an entity must possess all of the specified component types.
	 * 
	 * @param type the type the entity must possess
	 * @param types the type the entity must possess
	 * @return an aspect that can be matched against entities
	 * 
	 * @deprecated
	 * @see getAspectForAll
	 */
	public static getAspectFor(type: any, types: any): Aspect {
		return this.getAspectForAll(type, types);
	}
	
	/**
	 * Creates an aspect where an entity must possess all of the specified component types.
	 * 
	 * @param type a required component type
	 * @param types a required component type
	 * @return an aspect that can be matched against entities
	 */
	public static getAspectForAll(type: any, types: any): Aspect {
		var aspect: Aspect = new Aspect();
		aspect.all(type, types);
		return aspect;
	}
	
	/**
	 * Creates an aspect where an entity must possess one of the specified component types.
	 * 
	 * @param type one of the types the entity must possess
	 * @param types one of the types the entity must possess
	 * @return an aspect that can be matched against entities
	 */
	public static getAspectForOne(type: any, types: any): Aspect {
		var aspect: Aspect = new Aspect();
		aspect.one(type, types);
		return aspect;
	}
	
	/**
	 * Creates and returns an empty aspect. This can be used if you want a system that processes no entities, but
	 * still gets invoked. Typical usages is when you need to create special purpose systems for debug rendering,
	 * like rendering FPS, how many entities are active in the world, etc.
	 * 
	 * You can also use the all, one and exclude methods on this aspect, so if you wanted to create a system that
	 * processes only entities possessing just one of the components A or B or C, then you can do:
	 * Aspect.getEmpty().one(A,B,C);
	 * 
	 * @return an empty Aspect that will reject all entities.
	 */
	public static getEmpty() : Aspect {
		return new Aspect();
	}
}