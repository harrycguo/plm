import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Vendors } from '../Vendors/vendors.js';
import convertPackageString from '../../utils/conversions.js';
import { Bert } from 'meteor/themeteorchef:bert';
import { isInt } from '../../utils/checks.js';
import { containsVendor , indexOfVendorWithId } from '../../utils/checks.js';

// Meteor.subscribe('vendors');

//IngredientsList API
Meteor.methods({
    'addIngredient': function(ingName,ingPackage,ingTemperatureState,ingVendor,ingNumPackages,ingPrice){
    	// if (Roles.userIsInRole( Meteor.userId(),'admin')) {

        var vendorInfoArr = [{
            vendor: ingVendor,
            price: ingPrice
        }];

		IngredientsList.insert({
        	name: ingName,
        	package: ingPackage.toLowerCase(),
        	temperatureState: ingTemperatureState.toLowerCase(),
        	vendorInfo: vendorInfoArr,
            numPackages: ingNumPackages,
            quantity: convertPackageString(ingPackage) * ingNumPackages
            // prices: priceTuples
        });
    },
    //This method will check to see if the ingredient already exists. If not, then call addIngredient.
    'addToExistingIngredient': function(ingName,ingPackage,ingTemperatureState,ingVendor,ingNumPackages,ingPrice){
        var existingIng = IngredientsList.findOne({name: ingName});
        //If ingredient exists, update it instead of adding a new database entry
        if(existingIng.length != 0) {
            IngredientsList.update({ _id: existingIng._id }, {$inc : {numPackages: ingNumPackages}});
            if(!containsVendor(ingVendor,existingIng.vendorInfo)) {
                existingIng.vendorInfo.push({
                    vendor: ingVendor,
                    price: ingPrice
                });
                IngredientsList.update({ _id: existingIng._id }, {
                    $set : {vendorInfo: existingIng.vendorInfo}});
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
        else throw new Meteor.Error('Invalid number of packages','Number of packages must be an integer');
    },
    'editPrice': function(selectedIngredient,vendorId,newPrice) {
        // if (Roles.userIsInRole( Meteor.userId(),'admin')) {
        var ingredient = IngredientsList.find({ _id: selectedIngredient}).fetch();
        var vendorInfo = ingredient[0].vendorInfo;
        check(vendorInfo,Array);
        check(newPrice,Number);

        //Perhaps I should return an error if the ingredient price cannot be changed because the vendor
        //specified doesn't exist.

        for (i = 0; i < vendorInfo.length; i++) {
            if (vendorInfo[i].vendor._id == vendorId) {
                IngredientsList.update({ 
                    _id: selectedIngredient , 
                    "vendorInfo.vendor._id" : vendorId 
                },
                {
                    $set : 
                    {
                        "vendorInfo.$.price" : newPrice 
                    }
                });
            }
        }
    }
});