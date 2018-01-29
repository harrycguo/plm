import { Mongo } from 'meteor/mongo';

IngredientsList = new Mongo.Collection('ingredients');
//IngredientsList.remove({}) // remove every ingredient from the collection

// //Array for any of our schemas we define
var Schemas = {};

//Specifies ingredient field type constraints
Schemas.Ingredient = new SimpleSchema({
  name: {type: String},
  package: {type: Number},
  temperatureState: {type: String},
  vendors: {type: [Object]}
  // quantity: {type: Number}
});

//Attach a schema to the collection for automatic validation on insert/update operations
IngredientsList.attachSchema(Schemas.Ingredient);

export default IngredientsList;