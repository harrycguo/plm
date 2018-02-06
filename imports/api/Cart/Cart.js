import { Mongo } from 'meteor/mongo';
import { CartSchema, CartIngredientSchema } from '../Ingredients/Schemas.js';
//Cart Database

Carts = new Mongo.Collection('carts');
carts.attachSchema(CartSchema);

export default Carts;

if(Meteor.isServer) {
	console.log('publishing carts')
	Meteor.publish('carts', function() {
		return Carts.find();
	})
}