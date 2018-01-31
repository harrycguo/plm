import { Mongo } from 'meteor/mongo';

IngredientsList = new Mongo.Collection('ingredients');
//IngredientsList.remove({}) // remove every ingredient from the collection

// //Array for any of our schemas we define
var Schemas = {};

//Specifies ingredient field type constraints
Schemas.Ingredient = new SimpleSchema({
  name: {type: String},
  package: {type: String},
  temperatureState: {type: String},
  vendors: {type: [Object]}, //minCount: 1} //An ingredient needs at least one vendor that sells it
  numPackages: {type: Number, min: 1},
  quantity: {type: Number, min: 1}
  // quantity: {type: Number}
});

//Attach a schema to the collection for automatic validation on insert/update operations
IngredientsList.attachSchema(Schemas.Ingredient);

// var cursor = IngredientsList.find();
// cursor.observeChanges({
//     changed: function(new, old) {
//        // This code runs when a new object "object" was added to collection.

//     }
// });
export default IngredientsList;

if(Meteor.isServer) {
	console.log('publishing ings')
	Meteor.publish('ingredients', function() {
		return IngredientsList.find();
	})
}