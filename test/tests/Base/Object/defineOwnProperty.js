/* 
 * Copyright (c) 2012 by Appcelerator, Inc. All Rights Reserved.
 * Please see the LICENSE file for information about licensing.
 */

var path = require("path"),
	assert = require("assert"),
	Base = require(path.join(require.main.exports.libPath, "Base"));

var parent,
	obj,
	dataProp1,
	dataProp2,
	accessorProp1,
	accessorProp2;
	
function reset(inherit) {
	obj = new Base.ObjectType();
	dataProp1 = new Base.DataPropertyDescriptor();
	dataProp2 = new Base.DataPropertyDescriptor();
	accessorProp1 = new Base.AccessorPropertyDescriptor();
	accessorProp2 = new Base.AccessorPropertyDescriptor();
	if (inherit) {
		parent = new Base.ObjectType();
		obj.objectPrototype = parent;
	}
}

function deepEqual(a, b) {
	try {
		assert.deepEqual(a, b);
		return true;
	} catch(e) {
		return false;
	}
}

module.exports = [

	// Step 3
	{
		name: "Property does not exist, extensible is false, throw is false",
		testFunction: function() {
			reset(false);
			obj.extensible = false;
			return obj.defineOwnProperty("foo", dataProp1, false);
		},
		props: {
			expectedReturnValue: false
		}
	},{
		name: "Property does not exist, extensible is false, throw is true",
		testFunction: function() {
			reset(false);
			obj.extensible = false;
			return obj.defineOwnProperty("foo", dataProp1, true);
		},
		props: {
			expectedException: "TypeError"
		}
	},
	
	// Step 4
	{
		name: "Property does not exist, extensible is true, new prop is data",
		testFunction: function() {
			reset(false);
			return obj.defineOwnProperty("foo", dataProp1, true);
		},
		props: {
			expectedReturnValue: true,
			postEvaluation: function() {
				return deepEqual(obj._properties["foo"], dataProp1);
			}
		}
	},{
		name: "Property does not exist, extensible is true, new prop is accessor",
		testFunction: function() {
			reset(false);
			return obj.defineOwnProperty("foo", accessorProp1, true);
		},
		props: {
			expectedReturnValue: true,
			postEvaluation: function() {
				return deepEqual(obj._properties["foo"], accessorProp1);
			}
		}
	},{
		name: "Property does not exist, extensible is true, new prop is generic",
		testFunction: function() {
			reset(false);
			dataProp1.enumerable = true;
			return obj.defineOwnProperty("foo", {
				enumerable: true,
				configurable: false
			}, true);
		},
		props: {
			expectedReturnValue: true,
			postEvaluation: function() {
				return deepEqual(obj._properties["foo"], dataProp1);
			}
		}
	},
	
	// Step 5
	{
		name: "Property exists, new prop is empty",
		testFunction: function() {
			reset(false);
			obj._properties["foo"] = dataProp1;
			return obj.defineOwnProperty("foo", {}, true);
		},
		props: {
			expectedReturnValue: true,
			postEvaluation: function() {
				return deepEqual(obj._properties["foo"], dataProp1);
			}
		}
	},
	
	// Step 6
	{
		name: "Property exists, new prop is same as old",
		testFunction: function() {
			reset(false);
			obj._properties["foo"] = dataProp1;
			return obj.defineOwnProperty("foo", dataProp1, true);
		},
		props: {
			expectedReturnValue: true,
			postEvaluation: function() {
				return deepEqual(obj._properties["foo"], dataProp1);
			}
		}
	},
	
	// Step 7
	{
		name: "Property exists, new prop is configurable, throw is false",
		testFunction: function() {
			reset(false);
			dataProp2.configurable = true;
			obj._properties["foo"] = dataProp1;
			return obj.defineOwnProperty("foo", dataProp2, false);
		},
		props: {
			expectedReturnValue: false
		}
	},{
		name: "Property exists, new prop is configurable, throw is true",
		testFunction: function() {
			reset(false);
			dataProp2.configurable = true;
			obj._properties["foo"] = dataProp1;
			return obj.defineOwnProperty("foo", dataProp2, true);
		},
		props: {
			expectedException: "TypeError"
		}
	},{
		name: "Property exists, new prop is enumerable, old prop is not, throw is false",
		testFunction: function() {
			reset(false);
			dataProp2.enumerable = true;
			obj._properties["foo"] = dataProp1;
			return obj.defineOwnProperty("foo", dataProp2, false);
		},
		props: {
			expectedReturnValue: false
		}
	},{
		name: "Property exists, new prop is enumerable, old prop is not, throw is true",
		testFunction: function() {
			reset(false);
			dataProp2.enumerable = true;
			obj._properties["foo"] = dataProp1;
			return obj.defineOwnProperty("foo", dataProp2, true);
		},
		props: {
			expectedException: "TypeError"
		}
	},{
		name: "Property exists, new prop is not enumerable, old prop is, throw is false",
		testFunction: function() {
			reset(false);
			dataProp2.enumerable = true;
			obj._properties["foo"] = dataProp2;
			return obj.defineOwnProperty("foo", dataProp1, false);
		},
		props: {
			expectedReturnValue: false
		}
	},{
		name: "Property exists, new prop is not enumerable, old prop is, throw is true",
		testFunction: function() {
			reset(false);
			dataProp2.enumerable = true;
			obj._properties["foo"] = dataProp2;
			return obj.defineOwnProperty("foo", dataProp1, true);
		},
		props: {
			expectedException: "TypeError"
		}
	},
	
	// Step 8
	{
		name: "Property exists, new prop is generic",
		testFunction: function() {
			reset(false);
			obj._properties["foo"] = dataProp1;
			return obj.defineOwnProperty("foo", {
				configurable: false,
				enumerable: false
			}, true);
		},
		props: {
			expectedReturnValue: true,
			postEvaluation: function() {
				return deepEqual(obj._properties["foo"], {
					configurable: false,
					enumerable: false
				});
			}
		}
	},
	
	// Step 9
	{
		name: "Property exists, new prop of different type, configurable of current is false",
		testFunction: function() {
			reset(false);
			obj._properties["foo"] = dataProp1;
			return obj.defineOwnProperty("foo", accessorProp1, true);
		},
		props: {
			expectedException: "TypeError"
		}
	},{
		name: "Property exists, new prop is accessor, old prop is data",
		testFunction: function() {
			reset(false);
			dataProp1.enumerable = true;
			dataProp1.configurable = true;
			accessorProp1.set = new Base.ObjectType();
			obj._properties["foo"] = dataProp1;
			return obj.defineOwnProperty("foo", accessorProp1, true);
		},
		props: {
			expectedReturnValue: true,
			postEvaluation: function() {
				return deepEqual(obj._properties["foo"], {
					enumerable: false,
					configurable: false,
					set: new Base.ObjectType(),
					get: new Base.UndefinedType()
				});
			}
		}
	},{
		name: "Property exists, new prop is data, old prop is accessor",
		testFunction: function() {
			reset(false);
			accessorProp1.enumerable = true;
			accessorProp1.configurable = true;
			dataProp1.value = new Base.BooleanType();
			obj._properties["foo"] = accessorProp1;
			return obj.defineOwnProperty("foo", dataProp1, true);
		},
		props: {
			expectedReturnValue: true,
			postEvaluation: function() {
				return deepEqual(obj._properties["foo"], {
					enumerable: false,
					configurable: false,
					value: new Base.BooleanType(),
					writeable: false
				});
			}
		}
	},
	
	// Step 10
	{
		name: "Property exists, both props are data, old prop is not configurable, new prop is writeable, throw is false",
		testFunction: function() {
			reset(false);
			dataProp1.configurable = false;
			dataProp2.writeable = true;
			obj._properties["foo"] = dataProp1;
			return obj.defineOwnProperty("foo", dataProp2, false);
		},
		props: {
			expectedReturnValue: false
		}
	},{
		name: "Property exists, both props are data, old prop is not configurable, new prop is writeable, throw is true",
		testFunction: function() {
			reset(false);
			dataProp1.configurable = false;
			dataProp2.writeable = true;
			obj._properties["foo"] = dataProp1;
			return obj.defineOwnProperty("foo", dataProp2, true);
		},
		props: {
			expectedException: "TypeError"
		}
	},{
		name: "Property exists, both props are data, old prop is not configurable, new prop has different value, throw is false",
		testFunction: function() {
			reset(false);
			dataProp1.configurable = false;
			dataProp2.value = new Base.BooleanType();
			obj._properties["foo"] = dataProp1;
			return obj.defineOwnProperty("foo", dataProp2, false);
		},
		props: {
			expectedReturnValue: false
		}
	},{
		name: "Property exists, both props are data, old prop is not configurable, new prop has different value, throw is true",
		testFunction: function() {
			reset(false);
			dataProp1.configurable = false;
			dataProp2.value = new Base.BooleanType();
			obj._properties["foo"] = dataProp1;
			return obj.defineOwnProperty("foo", dataProp2, true);
		},
		props: {
			expectedException: "TypeError"
		}
	},{
		name: "Property exists, both props are data, old prop is configurable, new prop has different value",
		testFunction: function() {
			reset(false);
			dataProp1.configurable = true;
			dataProp2.value = new Base.BooleanType();
			dataProp2.writeable = true,
			dataProp2.enumerable = true,
			obj._properties["foo"] = dataProp1;
			return obj.defineOwnProperty("foo", dataProp2, true);
		},
		props: {
			expectedReturnValue: true,
			postEvaluation: function() {
				return deepEqual(obj._properties["foo"], dataProp2);
			}
		}
	},
	
	// Step 11
	{
		name: "Property exists, both props are accessor, old prop is not configurable, new prop has different set, throw is false",
		testFunction: function() {
			reset(false);
			accessorProp1.configurable = false;
			accessorProp2.set = new Base.ObjectType();
			obj._properties["foo"] = accessorProp1;
			return obj.defineOwnProperty("foo", accessorProp2, false);
		},
		props: {
			expectedReturnValue: false
		}
	},{
		name: "Property exists, both props are accessor, old prop is not configurable, new prop has different set, throw is true",
		testFunction: function() {
			reset(false);
			accessorProp1.configurable = false;
			accessorProp2.set = new Base.ObjectType();
			obj._properties["foo"] = accessorProp1;
			return obj.defineOwnProperty("foo", accessorProp2, true);
		},
		props: {
			expectedException: "TypeError"
		}
	},{
		name: "Property exists, both props are accessor, old prop is not configurable, new prop has different get, throw is false",
		testFunction: function() {
			reset(false);
			accessorProp1.configurable = false;
			accessorProp2.get = new Base.ObjectType();
			obj._properties["foo"] = accessorProp1;
			return obj.defineOwnProperty("foo", accessorProp2, false);
		},
		props: {
			expectedReturnValue: false
		}
	},{
		name: "Property exists, both props are accessor, old prop is not configurable, new prop has different get, throw is true",
		testFunction: function() {
			reset(false);
			accessorProp1.configurable = false;
			accessorProp2.get = new Base.ObjectType();
			obj._properties["foo"] = accessorProp1;
			return obj.defineOwnProperty("foo", accessorProp2, true);
		},
		props: {
			expectedException: "TypeError"
		}
	},{
		name: "Property exists, both props are accessor, old prop is not configurable, new prop has same set and get",
		testFunction: function() {
			reset(false);
			accessorProp1.configurable = false;
			obj._properties["foo"] = accessorProp1;
			return obj.defineOwnProperty("foo", accessorProp2, false);
		},
		props: {
			expectedReturnValue: true
		}
	},{
		name: "Property exists, both props are accessor, old prop is configurable, new prop has different set and get",
		testFunction: function() {
			reset(false);
			accessorProp1.configurable = true;
			accessorProp2.get = new Base.ObjectType();
			accessorProp2.set = new Base.ObjectType();
			obj._properties["foo"] = accessorProp1;
			return obj.defineOwnProperty("foo", accessorProp2, false);
		},
		props: {
			expectedReturnValue: true
		}
	}
	
];