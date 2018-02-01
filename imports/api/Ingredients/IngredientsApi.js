import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Vendors } from '../Vendors/vendors.js';
import convertPackageString from '../../utils/conversions.js';
import { Bert } from 'meteor/themeteorchef:bert';
import { isInt } from '../../utils/checks.js';

// Meteor.subscribe('vendors');

//IngredientsList API
Meteor.methods({
    'addIngredient': function(ingName,ingPackage,ingTemperatureState,ingVendors,ingNumPackages,ingPrices){
    	// if (Roles.userIsInRole( Meteor.userId(),'admin')) {

        var priceTuples = [];
        for (i = 0; i < ingPrices.length; i++) {
            priceTuples.push({
                vendorId: ingVendors[i]._id,
                vendorPrice: ingPrices[i]
            });
        }

		IngredientsList.insert({
        	name: ingName,
        	package: ingPackage.toLowerCase(),
        	temperatureState: ingTemperatureState.toLowerCase(),
        	vendors: ingVendors,
            numPackages: ingNumPackages,
            quantity: convertPackageString(ingPackage) * ingNumPackages,
            prices: priceTuples
        });
    },
    //This method will check to see if the ingredient already exists. If not, then call addIngredient.
    'addToExistingIngredient': function(ingName,ingPackage,ingTemperatureState,ingVendor,ingNumPackages,ingPrice){
        var existingIng = IngredientsList.findOne({name: ingName});
        //If ingredient exists, update it instead of adding a new database entry
        console.log(existingIng.vendors);
        if(existingIng.length != 0 & isInt(ingNumPackages)) {
            existingIng.vendors.push(ingVendor);
            existingIng.prices.push({
                vendorId: ingVendor._id,
                vendorPrice: ingPrice
            });
            IngredientsList.update({ _id: existingIng._id }, {$inc : {numPackages: ingNumPackages}});
            if(!existingIng.vendors.includes(ingVendor)) {
                // existingIng.vendors.push(ingVendor);
                // console.log(existingIng.vendors);
                IngredientsList.update({ _id: existingIng._id }, {
                    $set : {vendors: existingIng.vendors}});
                IngredientsList.update({ _id: existingIng._id }, {
                    $set : {prices: existingIng.prices}});
            }
        }
        else {
            Meteor.call('addIngredient',
                ingName,
                ingPackage,
                ingTemperatureState,
                ingVendor,
                ingNumPackages,
                ingPrice
            );
        }
    },
    'removeIngredient': function(selectedIngredient) {
    	// if (Roles.userIsInRole( Meteor.userId(),'admin')) {
		// check(selectedIngredient, String);//Ensure the argument is a string
		// var currentUserId = Meteor.userId;
		//Add a check for admin. If not, don't allow deletion.
		IngredientsList.remove({_id: selectedIngredient});
    	// }
    },
    'editName': function(selectedIngredient,newName) {
    	// if (Roles.userIsInRole( Meteor.userId(),'admin')) {
		check(selectedIngredient, String);
		//Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
		check(newName,String);
		IngredientsList.update({ _id: selectedIngredient},{$set : {name: newName}});
    },
    'editPackage': function(selectedIngredient,newPackage) {
    	// if (Roles.userIsInRole( Meteor.userId(),'admin')) {
		check(selectedIngredient, String);
		//Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
		check(newPackage,String);
        IngredientsList.update({ _id: selectedIngredient},{$set : {package: newPackage.toLowerCase()}});
    },
    'editTemperatureState': function(selectedIngredient,newTemperatureState) {
    	// if (Roles.userIsInRole( Meteor.userId(),'admin')) {
		check(selectedIngredient, String);
		//Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
		check(newTemperatureState,String);
        IngredientsList.update({ _id: selectedIngredient},{$set : {temperatureState: newTemperatureState.toLowerCase()}});    	
    },
    'editNumPackages': function(selectedIngredient,newNumPackages) {
        // if (Roles.userIsInRole( Meteor.userId(),'admin')) {
        if (isInt(newNumPackages)) {
            check(newNumPackages,Number);
            IngredientsList.update({ _id: selectedIngredient},{$set : {numPackages: newNumPackages}});
        }        
        //Else throw error
    },
    'editPrice': function(selectedIngredient,vendorId,newPrice) {
        // if (Roles.userIsInRole( Meteor.userId(),'admin')) {
        var ingredient = IngredientsList.find({ _id: selectedIngredient}).fetch();
        var ingPrices = ingredient[0].prices;
        check(vendorId,String);
        check(newPrice,Number);
        for (i = 0; i < ingPrices.length; i++) {
            if (ingPrices[i].vendorId == vendorId) {
                // prices[i] = newPrice;
                IngredientsList.update({ _id: selectedIngredient , 
                    prices : {$elemMatch : {vendorId : ingPrices[i].vendorId}}},{
                        $set : {"prices.$.vendorPrice" : newPrice }});
            }
        }
    }
      //   'addVendor': function(selectedIngredient,newVendor) {
  //    // if (Roles.userIsInRole( Meteor.userId(),'admin')) {

        // check(newVendor,Object);
        // IngredientsList.update({ _id: selectedIngredient},{$set : {vendors: newVendor}});
        
  //   },
  //   'removeVendor': function(selectedIngredient,newVendor) {
  //       // if (Roles.userIsInRole( Meteor.userId(),'admin')) {

  //       check(newVendor,Object);
  //       IngredientsList.update({ _id: selectedIngredient},{$set : {vendors: newVendor}});
        
  //   },
});