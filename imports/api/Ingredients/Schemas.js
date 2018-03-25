import { Mongo } from 'meteor/mongo';

PackageInfoSchema = new SimpleSchema({
  packageType: {
    type: String,
    allowedValues: ['sack','pail','drum','supersack','truckload','railcar']
  },
  numPackages: {
    type: Number,
    min: 0
  }
});

VendorInfoSchema = new SimpleSchema({
  vendor: {
    type: String
  },
  price: {
    type: Number,
    min: 0,
    decimal: true
  }
});

NativeInfoSchema = new SimpleSchema({
   nativeUnit: {
    type: String
   },
   numNativeUnitsPerPackage: {
    type: Number,
    min: 1
   },
   totalQuantity: {
    type: Number,
    min: 0,
    decimal: true
   } 
});

SpendingInfoSchema = new SimpleSchema({
  totalSpending: {
    type: Number,
    decimal: true,
    min: 0,
    defaultValue: 0
  },
  totalProdSpending: {
    type: Number,
    decimal: true,
    min: 0,
    defaultValue: 0
  },
  avgPrice: {
    type: Number,
    decimal: true,
    min: 0,
    defaultValue: 0
  },
  numPackagesOrdered: {
    type: Number,
    min: 0,
    defaultValue: 0
  },
  numNativeUnitsProduced: {
    type: Number,
    min: 0,
    decimal: true,
    defaultValue: 0
  }
})

IngredientFormulaSchema = new SimpleSchema({
  id: {
    type: String
  },
  amount: {
    type: Number,
    min: 1
  }
})

FormulaSchema = new SimpleSchema({
  name: {
    type: String,
    min: 1,
    unique: true 
  },
  description: {
    type: String
  },
  productUnits: {
    type: Number,
    min: 1
  },
  ingredientsList: {
    type: [IngredientFormulaSchema]
  }
})

IntermediateSchema = new SimpleSchema({
  name: {
    type: String,
    min: 1,
    unique: true 
  },
  description: {
    type: String
  },
  productUnits: {
    type: Number,
    min: 1
  },
  ingredientsList: {
    type: [IngredientFormulaSchema]
  },
  temperatureState: {
    type: String,
    allowedValues: ['frozen','refrigerated','room temperature']
  },
  packageInfo: {
    type: PackageInfoSchema,
  },
  storage: {
    type: Number,
    min: 0,
    decimal: true
  },
  nativeInfo: {
    type: NativeInfoSchema
  },
  formulaInfo: {
    type: [String],
    optional: true
  },
});

//Specifies ingredient field type constraints
IngredientSchema = new SimpleSchema({
  name: {
    type: String,
    min: 1,
    unique: true //ensures only one database entry for each ingredient name
  },
  packageInfo: {
    type: PackageInfoSchema,
  },
  temperatureState: {
    type: String,
    allowedValues: ['frozen','refrigerated','room temperature']
  },
  vendorInfo: {
    type: [VendorInfoSchema], 
    optional: true 
  },
  storage: {
    type: Number,
    min: 0,
    decimal: true
  },
  nativeInfo: {
    type: NativeInfoSchema
  },
  formulaInfo: {
    type: [String],
    optional: true
  },
  spendingInfo: {
    type: SpendingInfoSchema
  }
});

LotSchema = new SimpleSchema({
  lotNumber: {
    type: Number,
    min: 1,
  },
  lotStuff: {
    type: Number,
    min: 1,
  }
})

//Schema for individual ingredient entries in the cart
CartIngredientSchema = new SimpleSchema({
	ingredient: {
		type: String,
    min: 1
	},
	numPackages: {
		type: Number,
    min: 1
	},
  vendorInfo: {
    type: VendorInfoSchema,
    min: 1
  },
  lotsSelected: {
    type: Boolean,
  },
  lots: {
    type: [LotSchema]
  }
})



// //Cart schema. Each user has their own mini database of ingredients.
CartSchema = new SimpleSchema({
	user: {
		type: String,
		unique: true,
		blackbox: true
	},
	ingredients: {
		type: [CartIngredientSchema],
    optional: true
	}
})

ReportSchema = new SimpleSchema({
  createdAt: {
    type: String
  },
  ingredient_name: {
    type: String,
    blackbox: true,
    unique: false
  },
  quantity: {
    type: Number
  },
  price: {
    type: Number,
    decimal: true
  },
  type: {
    type: String,
    allowedValues: ["Ordered","In Production"]

  }
})

SpendingSchema = new SimpleSchema({
	productionTotal: {type: Number},
	total: {type: Number}
})

LogSchema = new SimpleSchema({
  date: {
    type: String
  },
  
})

IngredientProdInfoSchema = new SimpleSchema({
  ingredient: {
    type: String,
    min: 0
  },
  totalCost: {
    type: Number,
    decimal: true,
    min: 0,
    defaultValue: 0
  },
  totalUnitsConsumed: {
    type: Number,
    decimal: true,
    min: 0,
    defaultValue: 0
  }
})

ProdReportSchema = new SimpleSchema({
   formula: {
    type: String,
    min: 1
   },
   totalProduced: {
    type: Number,
    decimal: true,
    min: 0,
    defaultValue: 0
   },
   ingredientsUsed: {
    type: [IngredientProdInfoSchema],
    min: 1
   },
   totalSpent: {
    type: Number,
    min:0,
    decimal: true,
    defaultValue: 0
   }
})

// LotIngredientSchema = new SimpleSchema({
  
// })

// LotsSchema = new SimpleSchema({
//   ingID: {
//     type: String,
//     min: 1
//   },
//   queue: {
//     type: [LotIngredientSchema]
//   }
// })

export { IngredientSchema, VendorInfoSchema, CartSchema, CartIngredientSchema, ReportSchema, SpendingSchema, PackageInfoSchema, NativeInfoSchema, FormulaInfoSchema, ProdReportSchema, IngredientProdInfoSchema, SpendingInfoSchema };