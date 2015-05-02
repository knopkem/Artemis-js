/// <reference path="ComponentType.ts" />
/// <reference path="depends/hashtable.d.ts" />
/// <reference path="Component.ts" />


class ComponentTypeManager {
	
	private static TYPE_MAP = new Hashtable();
	
	public static getTypeFor(component: Component) : ComponentType{
		if (!this.TYPE_MAP.containsKey(component.getClassName())) {
			this.TYPE_MAP.put(component.getClassName(), new ComponentType(component));
		}
		return <ComponentType>this.TYPE_MAP.get(component.getClassName());
	}
	
	public static getIndexFor(c: any): number {
		var cpt= <ComponentType>this.getTypeFor(c);
		return cpt.getIndex();
	}
}