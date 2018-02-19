import { Mongo } from 'meteor/mongo';
import { IngredientSchema, PackageInfoSchema, NativeInfoSchema } from './Schemas.js';
import { Vendors } from '../Vendors/vendors.js';

IngredientsList = new Mongo.Collection('ingredients');
// IngredientsList.remove({}); // remove every ingredient from the collection

//Attach a schema to the collection for automatic validation on insert/update operations
//IngredientsList.attachSchema(IngredientSchema);

//Update vendors for each ingredient when a vendor is edited
var cursor = Vendors.find();
const handle = cursor.observeChanges({
    'changed': function(id, vendors) {
       // This code runs when a new object "object" was added to collection.
       var ven = Vendors.find({ _id: id}).fetch()[0];
       console.log(ven);
       console.log("vendor id: "+id);
       IngredientsList.update({ "vendorInfo.vendor._id" : id}, { $set : { "vendorInfo.$.vendor" : ven}}, { multi: true });
    },
    'removed': function(id) {
       //console.log('removing: '+id);
       IngredientsList.update({ }, {$pull : { "vendorInfo.vendor._id" : id}} , {multi : true})
    }
});

export default IngredientsList;

if(Meteor.isServer) {
	Meteor.publish('ingredients', function() {
		return IngredientsList.find();
	})
}