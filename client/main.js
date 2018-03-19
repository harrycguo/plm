import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
 
import  App  from '../imports/startup/client/routes.js';
//import App from '../imports/ui/layouts/App.js'
import 'react-table/react-table.css'
import '../imports/api/Vendors/vendors.js';

Meteor.startup(() => {
  render(<App />, document.getElementById('render-target'));
  // render(<Table />, document.getElementById('render-target'));
  // render(renderRoutes(), document.getElementById('render-target'));
  // render(<IngredientForm />, document.getElementById('render-target'));

});