import { Mongo } from 'meteor/mongo';
import convertPackageString from '../../utils/conversions.js';

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
    minCount: 1,
    blackbox: true //You need this so that the data isn't autocleaned out by the schema 
                   // or you can register the object schema manually.
  },
  quantity: {
    type: Number
  }
  // prices: {
  //   type: [Object],
  //   minCount: 1,
  //   blackbox: true
  // }
});

export { IngredientSchema };