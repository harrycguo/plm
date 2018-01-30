import { Mongo } from 'meteor/mongo';

  // return (
  //           <div>
  //                <IngredientForm ingredientId={this.row._original.fullIng._id}/>
  //           </div>
  //       );


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
  quantity: {type: Number}
  // quantity: {type: Number}
});

//Attach a schema to the collection for automatic validation on insert/update operations
IngredientsList.attachSchema(Schemas.Ingredient);

export default IngredientsList;

if(Meteor.isServer) {
	console.log('publishing ings')
	Meteor.publish('ingredients', function() {
		return IngredientsList.find();
	})
}