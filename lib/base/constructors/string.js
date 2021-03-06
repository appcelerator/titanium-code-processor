/**
 * <p>Copyright (c) 2009-2013 by Appcelerator, Inc. All Rights Reserved.
 * Please see the LICENSE file for information about licensing.</p>
 *
 * Definition for the string constructor
 *
 * @module base/constructors/string
 */
/*global
util,
FunctionTypeBase,
areAnyUnknown,
UnknownType,
BaseType,
prototypes,
toUint16,
StringType,
toString,
ObjectType,
NumberType,
wrapNativeCall,
addNonEnumerableProperty
*/

/*****************************************
 *
 * String Constructor
 *
 *****************************************/

/**
 * isArray() prototype method
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.5.3.2
 */
function StringFromCharCodeFunc(className) {
	FunctionTypeBase.call(this, 1, className || 'Function');
}
util.inherits(StringFromCharCodeFunc, FunctionTypeBase);
StringFromCharCodeFunc.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var i, len;

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	// Convert the array to something we can apply()
	for (i = 0, len = args.length; i < len; i++) {
		args[i] = toUint16(args[i]).value;
	}

	// Use the built-in match method to perform the match
	return new StringType(String.fromCharCode.apply(this, args));
});

/**
 * String constructor function
 *
 * @private
 * @see ECMA-262 Spec Chapter 15.5, 15.5.5.2
 */
function StringConstructor(className) {
	FunctionTypeBase.call(this, 1, className || 'Function');

	this.defineOwnProperty('prototype', {
		value: prototypes.String
	}, false, true);

	addNonEnumerableProperty(this, 'fromCharCode', new StringFromCharCodeFunc());
}
util.inherits(StringConstructor, FunctionTypeBase);
StringConstructor.prototype.callFunction = wrapNativeCall(function callFunction(thisVal, args) {

	// Variable declarations
	var value = args[0];

	// Validate the parameters
	if (areAnyUnknown((args || []).concat(thisVal))) {
		return new UnknownType();
	}

	return value ? toString(value) : new StringType('');
});
StringConstructor.prototype.construct = wrapNativeCall(function construct(args) {

	// Variable declarations
	var value = args[0],
		obj;

	// Validate the parameters
	if (areAnyUnknown(args)) {
		return new UnknownType();
	}

	obj = new ObjectType();
	obj.className = 'String';
	obj.primitiveValue = value ? toString(value).value : '';

	obj.defineOwnProperty('length', { value: new NumberType(obj.primitiveValue.length) }, false, true);

	obj._getOwnProperty = obj.getOwnProperty;

	Object.defineProperty(obj, 'objectPrototype', {
		get: function () {
			return prototypes.String;
		},
		configurable: true
	});

	obj._getPropertyNames = StringType.prototype._getPropertyNames;


	// From the spec 15.5.5.2
	obj._lookupProperty = function _lookupProperty(p) {
		var current = BaseType.prototype._lookupProperty.call(this, p),
			index;
		if (current) {
			return current;
		}

		// Step 5
		index = +p;

		// Step 4
		if (Math.abs(index) + '' !== p) {
			return;
		}

		// Step 7
		if (index >= this.primitiveValue.length) {
			return;
		}

		// Steps 8-9
		return {
			value: new StringType(this.primitiveValue[index]),
			enumerable: true,
			writable: true,
			configurable: true
		};
	};

	obj._getPropertyNames = function _getPropertyNames() {
		var props = [],
			val = this.primitiveValue,
			i, len;
		for (i = 0, len = val.length; i < len; i++) {
			props.push(i.toString());
		}
		return props.concat(BaseType.prototype._getPropertyNames.call(this));
	};

	return obj;
}, true);