import { Mongo } from 'meteor/mongo';

PackageInfoSchema = new SimpleSchema({
  type: {
    type: String,
    allowedValues: ['sack','pail','drum','supersack','truckload','railcar']
  },
  remaining: {
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
    min: 0
  }
});

NativeInfoSchema = new SimpleSchema({
   type: {
    type: String
   },
   pkgQty: {
    type: Number
   },
   remaining: {
    type: Number,
    min: 0
   } 
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
    allowedValues: ["frozen","refrigerated","room temperature"]
  },
  vendorInfo: {
    type: [Object], 
    blackbox: true //You need this so that the data isn't autocleaned out by the schema 
                   // or you can register the object schema manually.
  },
  storage: {
    type: Number,
    min: 0
  },
  nativeInfo: {
    type: NativeInfoSchema
  },
  formulaInfo: {
    type: [Object],
    blackbox: true
  }
});

//Schema for individual ingredient entries in the cart
CartIngredientSchema = new SimpleSchema({
	ingredient: {
		type: String,
    min: 0
	},
	quantity: {
		type: Number,
    min: 1
	},
  vendor: {
    type: String,
    min: 0
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

export { IngredientSchema, VendorInfoSchema, CartSchema, CartIngredientSchema, ReportSchema, SpendingSchema, PackageInfoSchema, NativeInfoSchema };