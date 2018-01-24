import { Meteor } from 'meteor/meteor';
import { IngredientsList } from '../imports/model/IngredientList.js';

//Make data visible to all subscribers on the client side
Meteor.publish('ingredients', function() {
  return IngredientsList.find()
});

Meteor.startup(() => {
  // code to run on server at startup
});
