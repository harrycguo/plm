import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { LotsHistorySchema } from '../Ingredients/Schemas.js';

LotsHistory = new Mongo.Collection('lotshistory');

//Attach a schema to the collection for automatic validation on insert/update operations
//LotsHistory.attachSchema(LotsHistorySchema);

export default LotsHistory;

//Update vendors for each ingredient when a vendor is edited
// var cursor = Vendors.find();
// const handle = cursor.observeChanges({
//     'removed': function(id) {
//        //console.log('removing: '+id);
//        IngredientsList.update({ }, {$pull : { "vendorInfo.vendor" : id}} , {multi : true})
//     }
// });

if(Meteor.isServer) {
	Meteor.publish('lotshistory', function() {
		return LotsHistory.find();
	})
}