
// Todo: implement intersect

class BitSet {
	
	constructor() {
		
	}
	
	private _words = [];
	private BITS_OF_A_WORD :number = 32;
    private SHIFTS_OF_A_WORD  :number = 5;
	
	
	set(pos : number) {	
	
	    var which = this.whichWord(pos),
	        words = this._words;
	    return words[which] = words[which] | this.mask(pos);
	}

	clear(pos? : number) {
		if (!pos) {
			this._words = [];
			return;	
		}
			
	    var which = this.whichWord(pos),
	        words = this._words;
	    return words[which] = words[which] & ~this.mask(pos);
	}

	get(pos : number) {	
	
	    var which = this.whichWord(pos),
	        words = this._words;
	    return words[which] & this.mask(pos);
	}

	words = function() {
	    return this._words.length;
	}
	
	
	/**
	 * count all set bits
	 * @return {Number}
	 *
	 * this is much faster than BitSet lib of CoffeeScript, it fast skips 0 value words
	 */
	cardinality = function() {
	    var next, sum = 0, arrOfWords = this._words, maxWords = this.words();
	    for(next = 0; next < maxWords; next += 1){
	        var nextWord = arrOfWords[next] || 0;
	        //this loops only the number of set bits, not 32 constant all the time!
	        for(var bits = nextWord; bits !== 0; bits &= (bits - 1)){
	            sum += 1;
	        }
	    }
	    return sum;
	}

	or = function(set) {
	    if (this === set){
	        return this;
	    }
	
	    var next, commons = Math.min(this.words(), set.words());
	    for (next = 0; next < commons; next += 1) {
	        this._words[next] = (this._words[next] || 0) | (set._words[next] || 0);
	    }
	    if (commons < set.words()) {
	        this._words = this._words.concat(set._words.slice(commons, set.words()));
	    }
	    return this;
	}

	/**
	 *
	 * @param set
	 * @return {BitSet} this BitSet after and operation
	 *
	 * this is much more performant than CoffeeScript's BitSet#and operation because we'll chop the zero value words at tail.
	 */
	and = function(set) {
	    if (this === set) {
	        return this;
	    }
	
	    var next,
	        commons = Math.min(this.words(), set.words()),
	        words = this._words,
			i;
	
	    for (next = 0; next < commons; next += 1) {
	        words[next] = (words[next] || 0) & (set._words[next] || 0);
	    }
	    if(commons > set.words()){
			/* // uses underscore, not available here
	        _.each(_.range(commons, set.words()), function(elem){
	            words.pop();//using pop instead of assign zero to reduce the length of the array, and fasten the subsequent #and operations.
	        });
			*/
			for (i = commons; i < set.words(); i += 1) {
				words.pop();
			}
	    }
	    return this;
	}

	xor = function(set) {
	    var next, commons = Math.min(this.words(), set.words());
	    for (next = 0; next < commons; next += 1) {
	        this._words[next] = (this._words[next] || 0) ^ (set._words[next] || 0);
	    }
	    var maxWords = 0;
	    if(commons < set.words()){
	        maxWords = set.words();
	        for(next = commons; next < maxWords; next += 1){
	            this._words[next] = (set._words[next] || 0) ^ 0;
	        }
	    }
	    else{
	        maxWords = this.words();
	        for(next = commons; next < maxWords; next += 1){
	            this._words[next] = (this._words[next] || 0) ^ 0;
	        }
	    }
	    return this;
	}

	
	/**
	 * this is the critical piece missing from CoffeeScript's BitSet lib, we usually just need to know the next set bit if any.
	 * it fast skips 0 value word as #cardinality does, this is esp. important because of our usage, after series of #and operations
	 * it's highly likely that most of the words left are zero valued, and by skipping all of such, we could locate the actual bit set much faster.
	 * @param pos
	 * @return {number}
	 */
	nextSetBit = function(pos){

	    var next = this.whichWord(pos),
	        words = this._words;
	    //beyond max words
	    if(next >= words.length){
	        return -1;
	    }
	    //the very first word
	    var firstWord = words[next],
	        maxWords = this.words(),
	        bit;
	    if(firstWord){
	        for(bit = pos & 31; bit < this.BITS_OF_A_WORD; bit += 1){
	            if((firstWord & this.mask(bit))){
	                return (next << this.SHIFTS_OF_A_WORD) + bit;
	            }
	        }
	    }
	    for(next = next + 1; next < maxWords; next += 1){
	        var nextWord = words[next];
	        if(nextWord){
	            for(bit = 0; bit < this.BITS_OF_A_WORD; bit += 1){
	                if((nextWord & this.mask(bit)) !== 0){
	                    return (next << this.SHIFTS_OF_A_WORD) + bit;
	                }
	            }
	        }
	    }
	    return -1;
	}

	/**
	 * An reversed lookup compared with #nextSetBit
	 * @param pos
	 * @returns {number}
	 */
	prevSetBit = function(pos){
	
	    var prev = this.whichWord(pos),
	        words = this._words;
	    //beyond max words
	    if(prev >= words.length){
	        return -1;
	    }
	    //the very last word
	    var lastWord = words[prev],
	        bit;
	    if(lastWord){
	        for(bit = pos & 31; bit >=0; bit -= 1){
	            if((lastWord & this.mask(bit))){
	                return (prev << this.SHIFTS_OF_A_WORD) + bit;
	            }
	        }
	    }
	    for(prev = prev - 1; prev >= 0; prev -= 1){
	        var prevWord = words[prev];
	        if(prevWord){
	            for(bit = this.BITS_OF_A_WORD - 1; bit >= 0; bit -= 1){
	                if((prevWord & this.mask(bit)) !== 0){
	                    return (prev << this.SHIFTS_OF_A_WORD) + bit;
	                }
	            }
	        }
	    }
	    return -1;
	}
	
	/**
	 *
	 * @param pos
	 * @return {Number} the index at the words array
	 */
	private whichWord(pos : number) : number {
	    //assumed pos is non-negative, guarded by #set, #clear, #get etc.
	    return pos >> this.SHIFTS_OF_A_WORD;
	}
	
	/**
	 *
	 * @param pos
	 * @return {Number} a bit mask of 32 bits, 1 bit set at pos % 32, the rest being 0
	 */
	private mask(pos : number) : number {
	    return 1 << (pos & 31);
	}

	public isEmpty() : boolean {
		return this._words.length == 0;
	}
	
	public intersects(input: BitSet) : boolean {
		//The java.util.BitSet.intersects(BitSet set) method returns true if the specified BitSet has any bits set to true that are also set to true in this BitSet.
		return false;
	}
}