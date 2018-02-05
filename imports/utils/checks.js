import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { Vendors } from '../api/Vendors/vendors.js';

// Short-circuiting, and saving a parse operation.
export function isInt(value) {
  var x;
  if (isNaN(value)) {
    return false;
  }
  x = parseFloat(value);
  return (x | 0) === x;
}

//Checks if the vendor is already listed in the vendorInfo field of the specified ingredient
export function containsVendor(vendor,vendorArr) {
	var ven = Vendors.findOne({vendor: vendor.vendor});
	console.log(ven);
	if (!ven)
		return false;
	for (i = 0; i < vendorArr.length; i++) {
		console.log(JSON.stringify(vendorArr[i].vendor) == JSON.stringify(ven));
		if (JSON.stringify(vendorArr[i].vendor) == JSON.stringify(ven))
			return true;
	}
	return false;
	// if (Vendors.findOne( { _id : }))
}

export function indexOfVendorWithId(vendorId,vendorArr) {
	console.log(Vendors.find().fetch());
	var ven = Vendors.findOne({_id: vendorId});
	for (i = 0; i < vendorArr.length; i++) {
		if (vendorArr[i].vendor._id == ven._id)
			return i;
	}
	return null;
}

//Check if the ingredient exists in the database
// export function isExistingIngredient(ingName) {
// 	if (IngredientsList.find({name: ingName}).fetch() !== undefined && 
// 		IngredientsList.findOne({name: ingName}).fetch().length != 0) {
// 		console.log(IngredientsList.find({name: ingName}).fetch());
// 		return true;
// 	}
// 	else {
// 		return false;
// 	}
// }