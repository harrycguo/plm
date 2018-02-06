import { Mongo } from 'meteor/mongo';

//Cart api
Meteor.methods({
    'addIngredientToCart': function(selectedIngredient, amount) {
    	
        if (vendorId === "null" || !price) {
            throw new Meteor.Error("Missing fields","Vendor and/or price unspecified");
        }
        
        var newVendor = {
            vendor: vendor,
            price: price
        };
        IngredientsList.update({ _id : selectedIngredient._id}, {$push : {vendorInfo : newVendor}});
    },
    'removeIngredientFromCart': function(selectedIngredient) {
    	//Check that ingredient is in the cart first!

    	var difference = 
        IngredientsList.update({ _id : selectedIngredient._id} , {$pull : { vendorInfo : { "vendor._id" : vendor._id}}});
    }
});