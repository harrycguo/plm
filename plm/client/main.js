import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import IngredientForm from '../imports/ui/IngredientForm.js';
import { IngredientsList } from '../imports/model/IngredientList.js';
// Meteor.subscribe('ingredients');
// IngredientsList = new Mongo.Collection('ingredients');

import './main.html';
 
Meteor.startup(() => {
  render(<IngredientForm />, document.getElementById('render-target'));
});
