///<reference path='ImmutableBag.ts'/>

/**
 * Collection type a bit like ArrayList but does not preserve the order of its
 * entities, speedwise it is very good, especially suited for games.
 */
class Bag<T> implements ImmutableBag<T> {
	private _data : T[];
	private _size : number;

	/**
	 * Constructs an empty Bag with an initial capacity of 64.
	 * 
	 */
	constructor(capacity : number = 64) {
		this._data = new Object[capacity];
		this._size = 0;
	}

	/**
	 * Removes the element at the specified position in this Bag. does this by
	 * overwriting it was last element then removing last element
	 * 
	 * @param index
	 *            the index of element to be removed
	 * @return element that was removed from the Bag
	 */
	remove(index : number) : T {
		var e : T = this._data[index]; // make copy of element to remove so it can be returned
		this._data[index] = this._data[--this._size]; // overwrite item to remove with last element
		this._data[this._size] = null; // null last element, so gc can do its work
		return e;
	}
	
	
	/**
	 * Remove and return the last object in the bag.
	 * 
	 * @return the last object in the bag, null if empty.
	 */
	removeLast() : T {
		if(this._size > 0) {
			var e : T = this._data[--this._size];
			this._data[this._size] = null;
			return e;
		}
		
		return null;
	}

	/**
	 * Removes the first occurrence of the specified element from this Bag, if
	 * it is present. If the Bag does not contain the element, it is unchanged.
	 * does this by overwriting it was last element then removing last element
	 * 
	 * @param e
	 *            element to be removed from this list, if present
	 * @return <tt>true</tt> if this list contained the specified element
	 */
	removeType(e : T) : boolean {
		for (var i : number = 0; i < this._size; i++) {
			var e2 : T = this._data[i];

			if (e == e2) {
				this._data[i] = this._data[--this._size]; // overwrite item to remove with last element
				this._data[this._size] = null; // null last element, so gc can do its work
				return true;
			}
		}

		return false;
	}
	
	/**
	 * Check if bag contains this element.
	 * 
	 * @param e
	 * @return
	 */
	contains(e : T) : boolean {
		for(var i : number = 0; this._size > i; i++) {
			if(e == this._data[i]) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Removes from this Bag all of its elements that are contained in the
	 * specified Bag.
	 * 
	 * @param bag
	 *            Bag containing elements to be removed from this Bag
	 * @return {@code true} if this Bag changed as a result of the call
	 */
	removeAll(bag : ImmutableBag<T>) : boolean {
		var modified : boolean = false;

		for (var i : number = 0; i < bag.size(); i++) {
			var e1 : T = bag.get(i);

			for (var j : number = 0; j < this._size; j++) {
				var e2 : T = this._data[j];

				if (e1 == e2) {
					this.remove(j);
					j--;
					modified = true;
					break;
				}
			}
		}

		return modified;
	}

	/**
	 * Returns the element at the specified position in Bag.
	 * 
	 * @param index
	 *            index of the element to return
	 * @return the element at the specified position in bag
	 */
	get(index : number) : T {
		return this._data[index];
	}

	/**
	 * Returns the number of elements in this bag.
	 * 
	 * @return the number of elements in this bag
	 */
	size() : number {
		return this._size;
	}
	
	/**
	 * Returns the number of elements the bag can hold without growing.
	 * 
	 * @return the number of elements the bag can hold without growing.
	 */
	getCapacity() : number {
		return this._data.length;
	}
	
	/**
	 * Checks if the internal storage supports this index.
	 * 
	 * @param index
	 * @return
	 */
	isIndexWithinBounds(index : number) : boolean {
		return index < this.getCapacity();
	}

	/**
	 * Returns true if this list contains no elements.
	 * 
	 * @return true if this list contains no elements
	 */
	isEmpty() : boolean {
		return this._size == 0;
	}

	/**
	 * Adds the specified element to the end of this bag. if needed also
	 * increases the capacity of the bag.
	 * 
	 * @param e
	 *            element to be added to this list
	 */
	add(e : T) : void {
		// is size greater than capacity increase capacity
		if (this._size == this._data.length) {
			this.grow();
		}

		this._data[this._size++] = e;
	}

	/**
	 * Set element at specified index in the bag.
	 * 
	 * @param index position of element
	 * @param e the element
	 */
	set(index : number, e : T) : void {
		if(index >= this._data.length) {
			this.grow(index * 2);
		}
		this._size = Math.max(this._size,index + 1);
		this._data[index] = e;
	}

	private grow(newCapacity? : number) : void {
		if (!newCapacity) {
			newCapacity = (this._data.length * 3) / 2 + 1;
		}
		var oldData : T[] = this._data;
		this._data = new Object[newCapacity];
		//System.arraycopy(oldData, 0, data, 0, oldData.length);
	}
	
	ensureCapacity(index : number) : void {
		if(index >= this._data.length) {
			this.grow(index*2);
		}
	}

	/**
	 * Removes all of the elements from this bag. The bag will be empty after
	 * this call returns.
	 */
	clear() : void {
		// null all elements so gc can clean up
		for (var i : number = 0; i < this._size; i++) {
			this._data[i] = null;
		}

		this._size = 0;
	}

	/**
	 * Add all items into this bag. 
	 * @param added
	 */
	addAll(items : ImmutableBag<T>) : void {
		for(var i : number = 0; items.size() > i; i++) {
			this.add(items.get(i));
		}
	}

}
