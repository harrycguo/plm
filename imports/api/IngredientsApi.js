import { Meteor } from 'meteor/meteor';

//IngredientsList API
Meteor.methods({
    'addIngredient': function(ingredientName,ingredientPackage,ingredientTemperatureState,ingredientVendors){
    	// if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		IngredientsList.insert({
            	name: ingredientName,
            	package: ingredientPackage,
         l   	temperatureState: ingredientTemperatureState,
            	vendors: ingredientVendors
        	});
    	// }
    },
    'removeIngredient': function(selectedIngredient) {
    	// if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		// check(selectedIngredient, String);//Ensure the argument is a string
    		var currentUserId = Meteor.userId;
    		//Add a check for admin. If not, don't allow deletion.
    		IngredientsList.remove({_id: selectedIngredient});
    	// }
    },
    'editName': function(selectedIngredient,newName) {
    	if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		//check(selectedIngredient, String);
    		//Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
    		//check(newName,String);
    		IngredientsList.update({ _id: selectedIngredient},{$set : {name: newName}});
    	}
    },
    'editPackage': function(selectedIngredient,newPackage) {
    	if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		check(selectedIngredient, Number);
    		//Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
    		check(newPackage,String);
    		IngredientsList.update({ _id: selectedIngredient},{$set : {name: newPackage}});
    	}
    },
    'editTemperatureState': function(selectedIngredient,newTemperatureState) {
    	if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		check(selectedIngredient, String);
    		//Javacript auto converts numbers to strings if necessary but not the other way around so we need this check
    		check(newTemperatureState,String);
    		IngredientsList.update({ _id: selectedIngredient},{$set : {name: newTemperatureState}});
    	}
    },
    'editVendors': function(selectedIngredient,newVendors) {
    	if (Roles.userIsInRole( Meteor.userId(),'admin')) {
    		check(newVendors,String);
    		IngredientsList.update({ _id: selectedIngredient},{$set : {name: newVendors}});
    	}
    }
});