import { Mongo } from 'meteor/mongo';
//Cart Database

Carts = new Mongo.Collection('carts');

export default Carts;

if(Meteor.isServer) {
	console.log('publishing carts')
	Meteor.publish('carts', function() {
		return Carts.find();
	})
}