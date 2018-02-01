import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import { renderRoutes } from '../imports/startup/client/routes.js';
import IngredientForm from '../imports/ui/forms/IngredientForm.js';
import Table from '../imports/ui/table/Table.js';
import IngredientsList from '../imports/api/Ingredients/IngredientList.js';
import 'react-table/react-table.css'
import '../imports/api/Vendors/vendors.js';

// Meteor.subscribe('ingredients');

// 'createUserFromAdmin':function(emailAddress, password, username, firstName, lastName)
// Meteor.call('createUserFromAdmin','sadsad','rocko','admin','chad','coviel');

Meteor.startup(() => {
  render(renderRoutes(), document.getElementById('render-target'));
  // render(<Table />, document.getElementById('render-target'));
  // render(renderRoutes(), document.getElementById('render-target'));
  // render(<IngredientForm />, document.getElementById('render-target'));

});