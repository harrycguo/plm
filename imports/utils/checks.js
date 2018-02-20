import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Vendors } from '../api/Vendors/vendors.js';
import Carts from '../api/Cart/Cart.js';

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
	var ven = Vendors.findOne({ _id : vendor});
	console.log(ven);
	if (!ven)
		return false;
	for (i = 0; i < vendorArr.length; i++) {
		console.log(vendor == ven);
		if (vendor == ven)
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

export function checkUndefined(obj, type) {
	check(type,String);
	if(obj === undefined)
		throw new Meteor.Error(type + ' is undefined', type + 'is undefined')
}

export function checkIngExists(ing) {
	if (IngredientsList.findOne({ _id : ing}) === undefined) {
		throw new Meteor.Error('Ingredient not found', 'Ingredient not found')
		return false
	}
	return true
}

export function checkGreaterThanZero(number, errorMessage) {
	check(number, Number);
	if (number <= 0)
		throw new Meteor.Error(errorMessage,errorMessage)
}

// export function vendorExists(vendor)

export function cartContainsIng(ing) {
	if (Carts.find({ingredient : ing}) === undefined) {
		return false
	}
	return true
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