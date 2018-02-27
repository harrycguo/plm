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
import EditCapacities from '../../ui/pages/EditCapacities/EditCapacities.js'
import VendorManagement from '../../ui/pages/VendorManagement/VendorManagement.js'
import IngredientForm from '../../ui/forms/IngredientForm.js'
import Table from '../../ui/table/Table.js';
import BulkImportIngredients from '../../ui/pages/BulkImportIngredients/BulkImportIngredients.js';
import AdminHomepage from '../../ui/pages/AdminHomepage/AdminHomepage.js';
import UserHomepage from '../../ui/pages/UserHomepage/UserHomepage.js';
import InventoryManagement from '../../ui/pages/InventoryManagement/InventoryManagement.js';
import AddIngredient from '../../ui/pages/AddIngredient/AddIngredient.js';
import IngredientCart from '../../ui/pages/Cart/Cart.js';
import SpendingReport from '../../ui/pages/SpendingReport/SpendingReport.js';
import UserManagement from '../../ui/pages/UserManagement/UserManagement';
import ManagerHomepage from '../../ui/pages/ManagerHomepage/ManagerHomepage';
import FormulaManagement from '../../ui/pages/FormulaManagement/FormulaManagement';
import AddFormula from '../../ui/pages/AddFormula/AddFormula';
import LogTable from '../../ui/syslog/LogTable.js';
import ViewLog from '../../ui/pages/ViewLog/ViewLog';
import EditFormula from '../../ui/pages/EditFormula/EditFormula.js'
import ViewFormula from '../../ui/pages/ViewFormula/ViewFormula.js'
import ProductionRun from '../../ui/pages/ProductionRun/ProductionRun.js'
import ProductionReport from '../../ui/pages/ProductionReport/ProductionReport.js'
import BulkImportFormulas from '../../ui/pages/BulkImportFormulas/BulkImportFormulas.js';


export const renderRoutes = () => (
  <Router>
  <div>
    <Route exact={true} path="/" component={Index}/>
    <Route path="/login" component={Login}/>
    <Route path="/logout" component={Logout}/>
    <Route path="/adminHomepage" component={AdminHomepage}/>
    <Route path="/managerHomepage" component={ManagerHomepage}/>
    <Route path="/userHomepage" component={UserHomepage}/>
    <Route path="/userManagement" component={UserManagement}/>
    <Route path="/createUser" component={CreateUser}/>
    <Route path="/vendorManagement" component={VendorManagement}/>
    <Route path="/addVendor" component={AddVendor}/>
    <Route path="/editVendor/:vendorID" component={EditVendor}/>
    <Route path="/editCapacity/:capacityID" component={EditCapacity}/>
    <Route path="/editCapacities" component={EditCapacities}/>
    <Route path="/successLoginUser" component={Table}/>
    <Route path="/bulkImportIngredients" component={BulkImportIngredients}/>
    <Route path="/table" component={Table}/>
    <Route path="/addingredient" component={AddIngredient}/>
    <Route path='/inventoryManagement' component={InventoryManagement}/>
    <Route path="/cart" component={IngredientCart}/>
    <Route path="/report" component={SpendingReport}/>
    <Route path='/formulaManagement' component={FormulaManagement}/>
    <Route path='/addFormula' component={AddFormula}/>
    <Route path='/editFormula/:formulaID' component={EditFormula}/>
    <Route path='/viewFormula/:formulaID' component={ViewFormula}/> 
    <Route path='/bulkImportFormulas' component={BulkImportFormulas}/>
    <Route path='/log' component={LogTable}/>
    <Route path='/viewLog' component={ViewLog}/>
    <Route path='/productionRun' component={ProductionRun}/>
    <Route path='/productionReport' component={ProductionReport}/>
  </div>
</Router>
);
