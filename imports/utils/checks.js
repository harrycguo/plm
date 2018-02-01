import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

// Short-circuiting, and saving a parse operation
export function isInt(value) {
  var x;
  if (isNaN(value)) {
    return false;
  }
  x = parseFloat(value);
  return (x | 0) === x;
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