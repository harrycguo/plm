import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

//pages
import Login from '../../ui/pages/Login/Login.js'
import Logout from '../../ui/pages/Logout/Logout.js'
import Index from '../../ui/pages/Index/Index.js'
import CreateUser from '../../ui/pages/CreateUser/CreateUser.js'
import AddVendor from '../../ui/pages/AddVendor/AddVendor.js'
import EditVendor from '../../ui/pages/EditVendor/EditVendor.js';
import EditCapacity from '../../ui/pages/EditCapacity/EditCapacity.js'
import VendorManagement from '../../ui/pages/VendorManagement/VendorManagement.js'
import SuccessCreateUser from '../../ui/pages/Success/SuccessCreateUser.js';
import SuccessLoginAdmin from '../../ui/pages/Success/SuccessLoginAdmin';
import SuccessLoginUser from '../../ui/pages/Success/SuccessLoginUser';
import IngredientForm from '../../ui/forms/IngredientForm.js'
import Table from '../../ui/table/Table.js';
import BulkImport from '../../ui/pages/BulkImport/BulkImport.js';
import AdminHomepage from '../../ui/pages/AdminHomepage/AdminHomepage.js';
import UserHomepage from '../../ui/pages/UserHomepage/UserHomepage.js';
import UserViewInventory from '../../ui/pages/UserViewInventory/UserViewInventory.js';
import AdminViewInventory from '../../ui/pages/AdminViewInventory/AdminViewInventory.js';
import AddIngredient from '../../ui/pages/AddIngredient/AddIngredient.js';
import IngredientCart from '../../ui/pages/Cart/Cart.js';
 
export const renderRoutes = () => (
  <Router>
  <div>
    <Route exact={true} path="/" component={Index}/>
    <Route path="/login" component={Login}/>
    <Route path="/logout" component={Logout}/>
    <Route path="/adminHomepage" component={AdminHomepage}/>
    <Route path="/userHomepage" component={UserHomepage}/>
    <Route path="/createUser" component={CreateUser}/>
    <Route path="/vendorManagement" component={VendorManagement}/>
    <Route path="/addVendor" component={AddVendor}/>
    <Route path="/editVendor/:vendorID" component={EditVendor}/>
    <Route path="/editCapacity/:capacityID" component={EditCapacity}/>
    <Route path="/successCreateUser" component={SuccessCreateUser}/>
    <Route path="/successLoginAdmin" component={SuccessLoginAdmin}/>
    <Route path="/successLoginUser" component={Table}/>
    <Route path="/bulkImport" component={BulkImport}/>
    <Route path="/table" component={Table}/>
    <Route path="/addingredient" component={AddIngredient}/>
    <Route path="/userViewInventory" component={UserViewInventory}/>
    <Route path="/adminViewInventory" component={AdminViewInventory}/>
    <Route path="/cart" component={IngredientCart}/>
  </div>
</Router>
);
