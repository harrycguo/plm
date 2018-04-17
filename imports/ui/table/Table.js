import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import IngredientsApi from '../../api/Ingredients/IngredientsApi.js';
import IngredientsList from '../../api/Ingredients/IngredientList.js';
import IngredientForm from '../forms/IngredientForm.js';
import TableData from './TableData.js';
import ReactTable from 'react-table';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button , ButtonToolbar, Glyphicon } from 'react-bootstrap';
import { Vendors } from '../../api/Vendors/vendors.js';
import AddVendor from './AddVendor.js';
import EditVendor from './EditVendor.js';
import CartApi from '../../api/Cart/CartApi.js';
import Carts from '../../api/Cart/Cart.js';
import Lots from '../../api/Lots/Lots.js'
import LotsApi from '../../api/Lots/LotsApi.js'
import LotsTable from './LotsTable.js'

class Table extends Component {
	
	////////////////////////////////////////////////
	///											 ///
	/// Basic Renders							 ///
	///											 ///
	////////////////////////////////////////////////
	
	constructor(props) {
		super(props);
	}

	renderRows(_this) {
		var ingredientsList = new Array()
		this.props.ingredients.forEach(function(ing) {
			ingredientsList.push(TableData.convertToFrontend(ing, IngredientsList, _this.props.vendors))
		});
		return ingredientsList
	}
	
	renderHeader() {
		return TableData.HeaderValues.map(element => (
			<HeaderElement key={element._id} element={element}/>
          ));
	}

	////////////////////////////////////////////////
	///											 ///
	/// Standard Admin Button Renders			 ///
	///											 ///
	////////////////////////////////////////////////

	edit() {
		TableData.toggleEditable()
		this.forceUpdate()
	}
	
	remove() {
		Meteor.call('removeIngredient', 
          this.row._original.fullIng._id,
          function(error, result){
             if (error) {
                Bert.alert(error.reason, 'danger')
            } 
        })
		
	}
	
	renderButtons(_this, row) {
		if(TableData.canEdit) {
			return (<div>
				<Button
				bsStyle="danger"
				//onClick={this.remove.bind(row)}
				onClick={e => {
					
					if (confirm('Delete this Ingredient?')){

						Meteor.call('removeIngredient', 
                          row.original.fullIng._id,
                          function(error, result){
                             if (error) {
                                Bert.alert(error.reason, 'danger')
                            } else {
                                _this.edit()
                                _this.edit()
                            }
                        })
					}
					
				}}
				>Remove Ingredient</Button> 
				</div>
             )
		}else {
			return null
		}

	}

	////////////////////////////////////////////////
	///											 ///
	/// Vendor Related Rendors 					 ///
	///											 ///
	////////////////////////////////////////////////
	
	deleteVendor(){
		Meteor.call('removeVendor',
			row.original.fullIng,
			vendor,
			function(error,result){
				if(error){
					Bert.alert(error.reason, 'danger');
				} else {
					Bert.alert('Successfully Removed Vendor', 'success');
				}
			}
          );
	}

	addNewIng(){
		const { history } = this.props.hist
		history.push('/addingredient')
	}

	goToCart(){
		const { history } = this.props.hist
		history.push('/cart')
	}

	renderEditableVendorRows(row) {
		return row.original.vendors.map(vendor => (
			<tr key = {vendor.name}>
            <EditVendor 
            key={vendor.name} 
            ing={row.original.fullIng}
            source="table" 
            vendor={vendor} 
            edit={TableData.canEdit}
            />
            <td> 
            <Button
            bsStyle="danger"
            onClick={e=> {
             var message = "Delete the vendor: "
             message = message.concat(vendor.name).concat(" from this ingredient?")
             if(confirm(message=message)) {
                Meteor.call('removeVendor',
                   row.original.fullIng,
                   vendor,
                   function(error,result){
                      if(error){
                         Bert.alert(error.reason, 'danger');
                     }
                 }
                 );
            }
        }}
        title= "Remove Vendor"
        >Delete Vendor</Button>
        </td>
        </tr>
        ));
	}
	
	renderVendorRows(row, _this) {
		if(TableData.canEdit) {
			return _this.renderEditableVendorRows(row)
		}
		this.state = { value: '' };
		var qty = undefined
		var recentVendor = undefined
		return row.original.vendors.map(vendor => (
			<tr key={vendor.name}>
            <td>{vendor.name}</td>
            <td>{vendor.price.toFixed(2)}</td>
            {this.renderOrderFields(row, vendor)}
            </tr>
            ));
	}


	////////////////////////////////////////////////
	///											                     ///
	/// Render 									                 ///
	///											                     ///
	////////////////////////////////////////////////
	renderTable(_this) {
		return ( 
			<div>
			<ReactTable
			data={_this.renderRows(_this)}
			filterable
      defaultFiltered = {[{id:'name', 
      value: _this.props.hist.location.state ? 
      _this.props.hist.location.state.name : ''}]}
			defaultFilterMethod={ (filter, row) => 
				String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())
			}
			columns={TableData.HeaderValues}
			SubComponent={row => {
				return (
					<div style={{ padding: "5px" }}>
                    <details>
                    <summary>Vendors</summary>
                    <table>
                  <tbody>
                  <tr>
                  <th>Vendor</th>
                  <th>Price</th>
                  </tr>
                  {_this.renderVendorRows(row, _this)}
                  <AddVendor ing={row.original.fullIng} edit={TableData.canEdit}/>
                  </tbody>
                  </table>
                  </details>
                  <details><summary>Lots</summary>
                    <LotsTable 
                        ingredient={row.original.fullIng}
                    />
                  </details>
                    {_this.renderButtons(_this, row)}
                  </div>
                  );
			}}
            />
            </div>
            );
	}
	render() {
		let user = Meteor.user()
        let carts = this.props.carts
		let cartNum = 0;

		for (let i = 0; i < carts.length; i++){
			if (carts[i].user == user._id){
                cartNum = carts[i].ingredients.length
			}
        }
        
        
		
		if (!Meteor.user() || !Roles.userIsInRole(Meteor.user()._id, 'admin')) {
			if(TableData.canEdit) {
				TableData.toggleEditable()
				this.forceUpdate()

            }
            
            let cartButton = Roles.userIsInRole(Meteor.userId(), 'manager') ? 
            <Button
                bsStyle="success"
                onClick={this.goToCart.bind(this)}
                title= "Cart"
                >Go To Cart({cartNum})
                </Button>
                :null
			return (
                <div>
                <ButtonToolbar>		
                
                {cartButton}

                </ButtonToolbar>
                <p></p>
                {this.renderTable(this)}
                </div>
             );
        }
        		

		return (
			<div>
            <ButtonToolbar>
            <Button
            bsStyle="primary"
            onClick={this.edit.bind(this)}
            title= "Edit"
            >{this.editButtonText()}
            </Button>
            <Button
            bsStyle="success"
            onClick={this.goToCart.bind(this)}
            title= "Cart"
            >Go To Cart({cartNum})

            </Button>

            </ButtonToolbar>
            <p></p>
            {this.renderTable(this)}
            </div>
            );

	}
	editButtonText() {
		return TableData.canEdit ? "Leave Edit Mode" : "Enter Edit Mode"
	}

	renderOrderFields(row,vendor){
		return (Meteor.user() && ( 
			Roles.userIsInRole(Meteor.user()._id, 'manager')
			|| Roles.userIsInRole(Meteor.user()._id, 'admin'))) ? 
     (<>
        <td>
        <input type="number" step="1" onChange={ e=> {
          qty = e.target.value;
          recentVendor = vendor;
      }}/>
      </td>
      <td>
      <Button
      bsStyle="success"
      onClick={e => {
          if(recentVendor === vendor) {
             console.log(row.original.fullIng)
             console.log(vendor)
             Meteor.call('addIngredientToCart',
                row.original.fullIng,
                qty, 
                vendor._id,
                function(error,result){
                   if(error){
                     console.log("something goes wrong with the following error message " + error.reason )
                     Bert.alert(error.reason, 'danger');
                 } else {
                     Bert.alert('Added ' + qty +' ' + row.original.fullIng.packageInfo.packageType + '(s) to Cart!', 'success')
                 }
             }
             );
         }

     }}
     >
     Add Packages To Cart
     </Button>
     </td>
     < />
     ) : null;
 }

}

export default withTracker(() => {
	Meteor.subscribe('ingredients')
	Meteor.subscribe('vendors')
	Meteor.subscribe('carts');
	Meteor.subscribe('lots');
	return {
		ingredients: IngredientsList.find({}).fetch(),
		vendors: Vendors.find({}).fetch(),
		carts: Carts.find({}).fetch(),
		lots: Lots.find({}).fetch()
	};
})(Table);