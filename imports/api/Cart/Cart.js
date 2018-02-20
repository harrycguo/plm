import { Mongo } from 'meteor/mongo';
import { CartSchema, CartIngredientSchema, VendorInfoSchema } from '../Ingredients/Schemas.js';
import IngredientsList from '../Ingredients/IngredientList.js';
//Cart Database

if (Meteor.isClient) {
	Meteor.subscribe('ingredients');
}

Carts = new Mongo.Collection('carts');
Carts.attachSchema(CartSchema);

export default Carts;

var cursor = IngredientsList.find();
const handle = cursor.observeChanges({
    'removed': function(id, ing) {
       console.log("removing");
       Carts.update({},{$pull : {ingredients : { "ingredient._id" : id}}});
    }
});

if(Meteor.isServer) {
	console.log('publishing carts')
	Meteor.publish('carts', function() {
		return Carts.find();
	})
}