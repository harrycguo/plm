import { Mongo } from 'meteor/mongo';
import { CartSchema, CartIngredientSchema } from '../Ingredients/Schemas.js';
//Cart Database

Carts = new Mongo.Collection('carts');
Carts.attachSchema(CartSchema);

export default Carts;

var cursor = Meteor.users.find();
const handle = cursor.observeChanges({
    'removed': function(id) {
       // console.log('removing: '+id);
       // IngredientsList.update({ }, {$pull : { "vendorInfo.vendor._id" : id}} , {multi : true})
    }
});

if(Meteor.isServer) {
	console.log('publishing carts')
	Meteor.publish('carts', function() {
		return Carts.find();
	})
}