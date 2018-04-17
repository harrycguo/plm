import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import Authenticated from '../../ui/components/Authenticated/Authenticated.js'
import Public from '../../ui/components/Public/Public.js'

//pages
import Index from '../../ui/pages/Index/Index.js'
import Login from '../../ui/pages/Login/Login.js'
import Logout from '../../ui/pages/Logout/Logout.js'

import Homepage from '../../ui/pages/Homepage/Homepage.js'

import InventoryManagementHome from '../../ui/pages/InventoryManagement/InventoryManagementHome.js';
import EditCapacities from '../../ui/pages/EditCapacities/EditCapacities.js'
import Cart from '../../ui/pages/Cart/Cart.js'

import FormulaManagementHome from '../../ui/pages/FormulaManagement/FormulaManagementHome.js';
import ViewFormula from '../../ui/pages/ViewFormula/ViewFormula.js'
import ViewIntermediate from '../../ui/pages/ViewIntermediate/ViewIntermediate.js'
import EditFormula from '../../ui/pages/EditFormula/EditFormula.js'
import EditIntermediate from '../../ui/pages/EditIntermediate/EditIntermediate.js'

import ProductionLineManagementHome from '../../ui/pages/ProductionLineManagement/ProductionLineManagementHome.js'
import ViewProductionLine from '../../ui/pages/ViewProductionLine/ViewProductionLine.js'
import EditProductionLine from '../../ui/pages/EditProductionLine/EditProductionLine.js'

import FreshnessReport from '../../ui/pages/FreshnessReport/FreshnessReport'

import DNIHome from '../../ui/pages/DistributorNetworkInventory/DNIHome.js'

import VendorManagementHome from '../../ui/pages/VendorManagement/VendorManagementHome.js'
import EditVendor from '../../ui/pages/EditVendor/EditVendor.js';

import UserManagementHome from '../../ui/pages/UserManagement/UserManagementHome.js';

import ViewLogHome from '../../ui/pages/ViewLog/ViewLogHome.js';

import ReportsHome from '../../ui/pages/Reports/ReportsHome.js'

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
          <Route exact path="/login" component={Login} />
          <Route exact path="/logout" component={Logout} />

          <Authenticated exact path="/homepage" component={Homepage} {...props}/>

          <Authenticated exact path='/inventoryManagement' component={InventoryManagementHome} {...props}/>
          <Authenticated exact path="/editCapacities" component={EditCapacities} {...props}/>
          <Authenticated exact path="/cart" component={Cart} {...props}/>

          <Authenticated exact path='/formulaManagement' component={FormulaManagementHome} {...props}/>
          <Authenticated exact path='/viewFormula/:formulaID' component={ViewFormula} {...props}/> 
          <Authenticated exact path='/editFormula/:formulaID' component={EditFormula} {...props}/>
          <Authenticated exact path='/viewIntermediate/:formulaID' component={ViewIntermediate} {...props}/>
          <Authenticated exact path='/editIntermediate/:formulaID' component={EditIntermediate} {...props}/>

          <Authenticated exact path='/productionLineManagement' component={ProductionLineManagementHome} {...props}/> 
          <Authenticated exact path='/viewProductionLine/:productionLineID' component={ViewProductionLine} {...props}/> 
          <Authenticated exact path='/editProductionLine/:productionLineID' component={EditProductionLine} {...props}/> 

          <Authenticated exact path='/dni' component={DNIHome} {...props}/> 
          
          <Authenticated exact path='/freshnessReport' component={FreshnessReport} {...props}/>

          <Authenticated exact path="/vendorManagement" component={VendorManagementHome} {...props}/>
          <Authenticated exact path="/editVendor/:vendorID" component={EditVendor} {...props}/>

          <Authenticated exact path="/userManagement" component={UserManagementHome} {...props}/>

          <Authenticated exact path='/viewLog' component={ViewLogHome} {...props}/>

          <Authenticated exact path='/reports' component={ReportsHome} {...props}/>
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