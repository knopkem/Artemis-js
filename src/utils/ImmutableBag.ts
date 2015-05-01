
interface ImmutableBag<T> {

	get(index : number) : T;

	size() : number;

	isEmpty() : boolean;
	
	contains(e : T) : boolean;

}

