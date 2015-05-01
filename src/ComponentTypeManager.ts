/// <reference path="ComponentType.ts" />
/// <reference path="depends/hashtable.d.ts" />
/// <reference path="Component.ts" />


class ComponentTypeManager {
	
	private static TYPE_MAP : Hashtable;
	
	public static getTypeFor(component: Component) : ComponentType {
		this.TYPE_MAP.get
	}
	
	public static getIndexFor(c: any): number {
		return this.getTypeFor(c).getIndex();
	}
}