import { Mongo } from 'meteor/mongo';
import convertPackageString from '../../utils/conversions.js';


//Schema for ingredient vendor info
// VendorInfoSchema = new SimpleSchema({
// 	vendor: {
// 		type: Object,
// 		blackbox: true
// 	},
// 	price: {
// 		type: Number
// 	}
// });

//Specifies ingredient field type constraints
IngredientSchema = new SimpleSchema({
  name: {
    type: String,
    min: 1,
    unique: true //ensures only one database entry for each ingredient name
  },
  package: {
    type: String,
    allowedValues: ["sack","pail","drum","supersack","truckload","railcar"]
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
  quantity: {
    type: Number
  }
});

//Schema for individual ingredient entries in the cart
CartIngredientSchema = new SimpleSchema({
	ingredient: {
		type: IngredientSchema
	},
	quantity: {
		type: Number
	}
})

// //Cart schema. Each user has their own mini database of ingredients.
CartSchema = new SimpleSchema({
	user: {
		type: Object,
		unique: true,
		blackbox: true
	},
	ingredients: {
		type: [Object],
		blackbox: true
	}
})

export { IngredientSchema, VendorInfoSchema, CartSchema, CartIngredientSchema };