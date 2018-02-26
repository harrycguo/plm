import { Mongo } from 'meteor/mongo';
//import SimpleSchema from 'simpl-schema';

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
    min: 0
   } 
});

FormulaInfoSchema = new SimpleSchema({
  formulaId: {
    type: String,
    min: 1
  },
  // nativeUnitsConsumption: {
  //   type: Number,
  //   min: 1,
  //   decimal: true
  // }
})

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
    optional: true //You need this so that the data isn't autocleaned out by the schema 
                   // or you can register the object schema manually.
  },
  storage: {
    type: Number,
    decimal: true,
    min: 0,
  },
  nativeInfo: {
    type: NativeInfoSchema
  },
  formulaInfo: {
    type: [FormulaInfoSchema],
    optional: true
  }
});

//Schema for individual ingredient entries in the cart
CartIngredientSchema = new SimpleSchema({
	ingredient: {
		type: String,
    min: 1
	},
	amount: {
		type: Number,
    min: 1
	},
  vendorInfo: {
    type: VendorInfoSchema,
    min: 1
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
  
})

export { IngredientSchema, VendorInfoSchema, CartSchema, CartIngredientSchema, ReportSchema, SpendingSchema, PackageInfoSchema, NativeInfoSchema, FormulaInfoSchema };