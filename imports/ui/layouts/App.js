import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import autoBind from 'react-autobind';
import Authenticated from '../../ui/components/Authenticated/Authenticated.js'
import Public from '../../ui/components/Public/Public.js'

//pages

import Login from '../../ui/pages/Login/Login.js'
import Logout from '../../ui/pages/Logout/Logout.js'
import Index from '../../ui/pages/Index/Index.js'
import CreateUser from '../../ui/pages/CreateUser/CreateUser.js'
import AddVendor from '../../ui/pages/AddVendor/AddVendor.js'
import EditVendor from '../../ui/pages/EditVendor/EditVendor.js';
import EditCapacities from '../../ui/pages/EditCapacities/EditCapacities.js'
import VendorManagement from '../../ui/pages/VendorManagement/VendorManagement.js'
import IngredientForm from '../../ui/forms/IngredientForm.js'
import Table from '../../ui/table/Table.js';
import BulkImportIngredients from '../../ui/pages/BulkImportIngredients/BulkImportIngredients.js';
import AdminHomepage from '../../ui/pages/AdminHomepage/AdminHomepage.js';
import UserHomepage from '../../ui/pages/UserHomepage/UserHomepage.js';
import Homepage from '../../ui/pages/Homepage/Homepage.js'
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
import ProductionReportPage from '../../ui/pages/ProductionReportPage/ProductionReportPage.js'



class App extends Component {
  constructor(props) {
    super(props);
  }  

  render() {
    const { props, state, setAfterLoginPath } = this;
    return (
  
      <Router>
      <div>
      <Switch>
        <Route exact name="index" path="/" component={Index} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/adminHomepage" component={AdminHomepage} />

        <Authenticated exact path="/adminHomepage" component={AdminHomepage} {...props}/>
        <Authenticated exact path="/managerHomepage" component={ManagerHomepage} {...props}/>
        <Authenticated exact path="/userHomepage" component={UserHomepage} {...props}/>
        <Authenticated exact path="/homepage" component={Homepage} {...props}/>

        <Authenticated exact path="/userManagement" component={UserManagement}/>
        <Authenticated exact path="/createUser" component={CreateUser}/>
        <Authenticated exact path="/vendorManagement" component={VendorManagement}/>
        <Authenticated exact path="/addVendor" component={AddVendor}/>
        <Authenticated exact path="/editVendor/:vendorID" component={EditVendor}/>
        <Authenticated exact path="/editCapacities" component={EditCapacities}/>
        <Authenticated exact path="/successLoginUser" component={Table}/>
        <Authenticated exact path="/bulkImportIngredients" component={BulkImportIngredients}/>
        <Authenticated exact path="/table" component={Table}/>
        <Authenticated exact path="/addingredient" component={AddIngredient}/>
        <Authenticated exact path='/inventoryManagement' component={InventoryManagement}/>
        <Authenticated exact path="/cart" component={IngredientCart}/>
        <Authenticated exact path="/report" component={SpendingReport}/>
        <Authenticated exact path='/formulaManagement' component={FormulaManagement}/>
        <Authenticated exact path='/addFormula' component={AddFormula}/>
        <Authenticated exact path='/editFormula/:formulaID' component={EditFormula}/>
        <Authenticated exact path='/viewFormula/:formulaID' component={ViewFormula}/> 
    
        <Authenticated exact path='/log' component={LogTable}/>
        <Authenticated exact path='/viewLog' component={ViewLog}/>
        <Authenticated exact path='/productionRun' component={ProductionRun}/>
        <Authenticated exact path='/productionReport' component={ProductionReportPage}/>
        </Switch>
           
      </div>
      
    </Router>
    );
  }
}

App.defaultProps = {
  userId: '',
  emailAddress: '',
};

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  userId: PropTypes.string,
  emailAddress: PropTypes.string,
  authenticated: PropTypes.bool.isRequired,
};

export default withTracker(() => {
  const loggingIn = Meteor.loggingIn();
  const user = Meteor.user();
  const userId = Meteor.userId();
  const loading = !Roles.subscription.ready();
  const name = user && user.profile && user.profile.name
  const emailAddress = user && user.emails && user.emails[0].address;

  return {
    loading,
    loggingIn,
    authenticated: loggingIn || (user !== null),
    name: name || emailAddress,
    roles: !loading && Roles.getRolesForUser(userId),
    userId,
    emailAddress,
  };
})(App);