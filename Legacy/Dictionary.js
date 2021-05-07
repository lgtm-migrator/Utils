//eslint-disable-next-line no-unused-vars
const { Out } = require("./Out"); //lgtm [js/unused-local-variable] JSDoc Type Def
/**.
 * Create a Dictionary Object.
 *
 * {@link #out Out} Type can be replaced with [] in a var
 *
 * @class Dictionary
 * @template T, A
 */
class Dictionary extends Array {
	constructor() {
		super();
		Object.defineProperty(this, "hash", { value: {}, enumerable: false });
	}
	/**
	 * Add an entry to the Dictionary.
	 *
	 * Will Error if Key already exists.
	 *
	 * @param {T} Key - Value.
	 * @param {A} Value - Value.
	 * @memberof Dictionary
	 * @instance
	 */
	Add(Key, Value) {
		if (this.ContainsKey(Key))
			throw new Error(
				"ArgumentException: An element with the same key already exists"
			);
		this.hash[Key] =
			this.push({
				Key,
				Value,
			}) - 1;
	}
	/**.
	 * Attempt to add an entry to the Dictionary
	 *
	 * @param {T} Key
	 * @param {A} Value
	 * @memberof Dictionary
	 * @instance
	 * @returns {Boolean} - Was the Add command successfull
	 */
	TryAdd(Key, Value) {
		if (this.ContainsKey(Key)) return false;
		return this.Add(Key, Value);
	}
	/**.
	 * Replace Key's value with new Value
	 *
	 * @param {T} key
	 * @param {A} Value
	 * @instance
	 * @memberof Dictionary
	 * @returns {boolean} - Was replace successful
	 */
	Replace(key, Value) {
		if (!this.ContainsKey(key)) return false;
		this[this.hash[key]].Value = Value;
	}
	/**.
	 * Clear the Dictionary
	 *
	 * @instance
	 * @memberof Dictionary
	 */
	Clear() {
		this.splice(0, this.length);
		this.ValidateHash();
	}
	CheckCount(func) {
		if (func == null) return this.length;
		return this.filter(func).length;
	}
	/**.
	 * Check if a Key exists
	 *
	 * @param {T} Key
	 * @instance
	 * @memberof Dictionary
	 * @returns {boolean} - Key Found
	 */
	ContainsKey(Key) {
		if (this.hash[Key] != null) return true;
		return false;
	}
	/**.
	 * Check if a Value exists in the Dictionary
	 *
	 * @param {A} Value
	 * @instance
	 * @memberof Dictionary
	 * @returns {boolean} - Value Exists
	 */
	ContainsValue(Value) {
		for (let object of this) {
			if (object.Value === Value) return true;
		}
		return false;
	}
	/**.
	 * Get the Capacity
	 *
	 * @deprecated
	 * @instance
	 * @memberof Dictionary
	 */
	EnsureCapacity() {
		return this.length;
	}
	/**.
	 * Remove an Item at a given Index
	 *
	 * @param {number} iIndex
	 * @instance
	 * @memberof Dictionary
	 */
	RemoveAt(iIndex) {
		var vItem = this[iIndex];
		if (vItem) {
			this.splice(iIndex, 1);
		}
		this.ValidateHash();
		return vItem;
	}
	/**.
	 * Remove a Key. Will error if Key does not exist
	 *
	 * @param {T} key
	 * @instance
	 * @memberof Dictionary
	 * @returns {boolean} - Key Removed
	 */
	Remove(key) {
		if (!this.ContainsKey(key)) return false;
		this.RemoveAt(this.hash[key]);
		return true;
	}
	/**
	 * Attempt to remove a Key.
	 *
	 * @memberof Dictionary
	 * @instance
	 * @param {T} key
	 * @returns {boolean} - Key Removed.
	 */
	TryRemove(key) {
		if (!this.ContainsKey(key)) return false;
		return this.Remove(key);
	}
	/**.
	 * Get the amount of items
	 *
	 * @instance
	 * @readonly
	 * @memberof Dictionary
	 */
	get Count() {
		return this.length;
	}
	/**.
	 * Get a key's value
	 *
	 * @param {T} key - Key
	 * @param {Out<A>} out - Output Var
	 * @returns {boolean} - Key Exists
	 */
	Get(key, out = []) {
		if (!this.ContainsKey(key)) return false;
		out.Out = this[this.hash[key]].Value;
		return true;
	}
	/** Validate Internal Integrity.
	 *
	 * @returns {true} Validated.
	 */
	ValidateHash() {
		//Validate Internal HashIndex
		var keys = 0;
		for (let key in this.hash) {
			let flag = false;
			let looseValues = {};
			for (let object of this) {
				if (looseValues[object.Key] == null) looseValues[object.Key] = false;
				if (object.Key === key) flag = object;
			}
			if (flag != false) {
				keys++;
				looseValues[flag.Key] = true;
				this.hash[key] = this.indexOf(flag);
			} else {
				delete this.hash[key];
			}
		}
		//Validate Values
		if (this.length != keys) {
			for (let i = 0; i < this.length; i++) {
				if (this.hash[this[i].Key] == null) this.hash[this[i].Key] = i;
			}
		}
		return true;
	}
	/**.
	 * Generate a Dictionary from an Object using Key:Value Pairs
	 *
	 * @param {Object} obj
	 */
	static ToDictionary(obj) {
		let Dict = new Dictionary();
		for (let key in obj) {
			Dict.Add(key, obj[key]);
		}
		return Dict;
	}
	/**.
	 * Reduce Callback
	 *
	 * @callback Dictionary.Reduce~callback
	 * @param {*} [previousValue]
	 * @param {*} [currentValue]
	 * @param {number} [currentIndex]
	 * @param {any[]} [array]
	 * @returns {*} Returned Value will set to set previousValue
	 */
	/**.
	 * Reduce a Dictionary's values down
	 *
	 * @param {Dictionary.Reduce~callback} callbackfn - Computation function
	 * @param {*} InitialValue - Initial Value
	 * @returns {*}
	 * @instance
	 * @memberof Dictionary
	 */
	Reduce(callbackfn, InitialValue) {
		if (this.length === 0) return 0;
		return this.reduce(callbackfn, InitialValue);
	}
	/**
	 * @callback Dictionary.AddOrUpdate~callback
	 * @param {T} Key - Current Key.
	 * @param {A} Value - Current Value.
	 * @returns {A} New Value.
	 */
	/**.
	 * Adds a new Value at Key.
	 *
	 * If Key exists, Updates Key.
	 *
	 * If func is set, Programatically updates Key
	 *
	 * @param {T} key
	 * @param {A} value
	 * @param {Dictionary.AddOrUpdate~callback} [func]
	 * @returns {Boolean} Added
	 * @instance
	 * @memberof Dictionary
	 */
	AddOrUpdate(key, value, func) {
		if (!this.ContainsKey(key)) {
			if (this.TryAdd(key, value)) return value;
			return false;
		}
		if (func == null) {
			if (this.Replace(key, value)) return value;
			return false;
		}
		let oldValue = new Out();
		this.Get(key, oldValue);
		let newValue = func(key, oldValue.Out);
		if (this.Replace(key, newValue)) return newValue;
	}
	/**.
	 * Attempt to get Value, Sets Value to Out. Returns Boolean valueExists
	 *
	 * @param {A} value
	 * @param {Out<A>} out
	 * @returns {boolean} - Value Existed
	 */
	TryGetValue(value, out) {
		if (value == null) return false;
		if (!this.ContainsKey(value)) return false;
		if (out) this.Get(value, out);
		return true;
	}
	/**.
	 * Return a value
	 *
	 * @param {T} key
	 */
	ReturnValue(key) {
		let out = [];
		this.TryGetValue(key, out);
		return out.Out;
	}
	GetEnumerator() {
		return new (require("./Enumerator").Enumerator)(this);
	}
}
module.exports = {
	Dictionary,
};