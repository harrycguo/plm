import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { Vendors } from '../api/Vendors/vendors.js';
import Carts from '../api/Cart/Cart.js';
import IngredientsList from '../api/Ingredients/IngredientList.js'

export function retrieveVendorInfo(selectedIngredient, vendorId) {
	vendorInfo = IngredientsList({ _id : selectedIngredient_id })
	
}