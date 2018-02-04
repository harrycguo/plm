import { Mongo } from 'meteor/mongo';
import convertPackageString from '../../utils/conversions.js';
import { IngredientSchema } from './Schemas.js';
import { Vendors } from '../Vendors/vendors.js';

IngredientsList = new Mongo.Collection('ingredients');
// IngredientsList.remove({}); // remove every ingredient from the collection

//Attach a schema to the collection for automatic validation on insert/update operations
IngredientsList.attachSchema(IngredientSchema);

//The below code listens for changes to an ingredient and updates the quantity for that ingredient appropriately
// var cursor = IngredientsList.find();
// const handle = cursor.observeChanges({
//     // 'changed': function(id, ingredient) {
//     //    // This code runs when a new object "object" was added to collection.
//     //    var ing = IngredientsList.find({ _id: id}).fetch();
//     //    var newQty = convertPackageString(ing[0].package) * ing[0].numPackages;
//     //    IngredientsList.update({ _id : id}, { $set : { quantity : newQty}});
//     // }
// });

//Update vendors for each ingredient when a vendor is edited
var cursor = Vendors.find();
const handle = cursor.observeChanges({
  'changed': function(id, vendors) {
       // This code runs when a new object "object" was added to collection.
       var ven = Vendors.find({ _id: id}).fetch()[0];
       console.log(ven);
       console.log("vendor id: "+id);
       IngredientsList.update({ "vendorInfo.vendor._id" : id}, { $set : { "vendorInfo.$.vendor" : ven}}, { multi: true });
    }
});

export default IngredientsList;

if(Meteor.isServer) {
	console.log('publishing ings')
	Meteor.publish('ingredients', function() {
		return IngredientsList.find();
	})
}