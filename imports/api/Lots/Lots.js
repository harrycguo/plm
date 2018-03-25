import { Mongo } from 'meteor/mongo';
import { LotsSchema, LotIngredientSchema } from './Schemas.js';
import { Vendors } from '../Vendors/vendors.js';

Lots = new Mongo.Collection('lots');
// IngredientsList.remove({}); // remove every ingredient from the collection

//Attach a schema to the collection for automatic validation on insert/update operations
Lots.attachSchema(LotsSchema);

//Update vendors for each ingredient when a vendor is edited
// var cursor = Vendors.find();
// const handle = cursor.observeChanges({
//     'removed': function(id) {
//        //console.log('removing: '+id);
//        IngredientsList.update({ }, {$pull : { "vendorInfo.vendor" : id}} , {multi : true})
//     }
// });

export default Lots;

if(Meteor.isServer) {
	Meteor.publish('lots', function() {
		return Lots.find();
	})
}