import React, { Component } from 'react';
import { button } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import IngredientsApi from '../../api/Ingredients/IngredientsApi.js';
import IngredientsList from '../../api/Ingredients/IngredientList.js';
import IngredientForm from '../forms/IngredientForm.js';
import TableData from './TableData.js';
import LotsTableData from './LotsTableData.js'
import ReactTable from 'react-table';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { Button , ButtonToolbar, ControlLabel, Glyphicon } from 'react-bootstrap';
import { Vendors } from '../../api/Vendors/vendors.js';
import Lots from '../../api/Lots/Lots.js'
import LotsApi from '../../api/Lots/LotsApi.js'

class LotsTable extends Component {
	
	////////////////////////////////////////////////
	///											 ///
	/// Basic Renders							 ///
	///											 ///
	////////////////////////////////////////////////
	
	constructor(props) {
		super(props);
		this.state = {
			boxLock: false,
			vendor: null,
			lotNum: -1,
			lotQty: -1,
			price: -1,
		}
	}

	renderRows(ingredient, vendors) {
		var lotsList = new Array()
		console.log(ingredient._id)
		var lot = Lots.find({inventoryID: ingredient._id}).fetch()[0]
		console.log(lot)
		if(lot) {
			lot.queue.forEach(function(lot) {
				// qty lot vendor(op) price(op) time
				lotsList.push(
					LotsTableData.convertToFrontend(lot, ingredient, vendors)
				)
			})
		}
		return lotsList
	}
	
	renderHeader() {
		return TableData.HeaderValues.map(element => (
			<HeaderElement key={element._id} element={element}/>
          ));
	}
	renderVendorSelector(ingredient) {
		if(this.props.ingredient.description != undefined) {
			return (<div>None</div>)
		}
		var vendors = ingredient.vendorInfo;
		let items = new Array();
		items.push(
			<option key={"nil"} value={undefined}>
				{"Select Vendor"}
			</option>
		)
		vendors.forEach(function (vendor) {
			var fullVendor = Vendors.find({_id: vendor.vendor}).fetch()[0]
			var vendorName = fullVendor != undefined ? fullVendor.vendor : ""
			console.log(vendorName)
			items.push(
				<option key={vendor.vendor} value={vendor.vendor}>
					{vendorName + ' | ' + Number(vendor.price.toFixed(2))}
				</option>
			)
		})

		return (
			<p><select
				name="vendor"
				ref={vendor => (this.vendor = vendor)}
				onChange={e=> {
					console.log("Swap vendor name")
					this.state.vendor = e.target.value
					// this.state.price = e.target.
					console.log(e.target.key)
					console.log(e.target.value)
				}}
			>
				{items}
			</select></p>
		)
	}

	renderAddLot() {
		console.log(this)
		return TableData.canEdit ? (
			<div>
				<ControlLabel>Add New Lot</ControlLabel>
				<table>
				<tbody>
					<tr>
						<th>New Lot Number</th>
						<th>New Lot Quantity</th>
						<th>Vendor</th>
						<th>Add</th>
					</tr>
					<tr>
					<td>
						<input 
						type="text" 
						placeholder="Lot Number"
						ref="numBox"
						onChange = {e=> {
							this.state.lotNum = e.target.value
						}}/>
					</td>
					<td>
						<input 
						type="text" 
						placeholder="Lot Quantity"
						ref="qtyBox"
						onChange = {e=> {
							this.state.lotQty = e.target.value
						}}/>
					</td>
					<td>{this.renderVendorSelector(this.props.ingredient)}</td>
					<td><Button
					      bsStyle="success"
					      onClick={e => {
					      	if(this.state.vendor != "Select Vendor"){

					      		if(this.props.ingredient.description != undefined) {
					      			this.state.price = 0
					      			this.state.vendor = undefined
					      			Meteor.call('lots.addFormula',
			//'lots.addFormula': function(id, qty, lotNumber, time) {
										this.props.ingredient._id,
										Number(this.state.lotQty),
										Number(this.state.lotNum),
										new Date(),
										function(error,result) {
											if(error){
					      					console.log("something goes wrong with the following error message " + error.reason )
					                    	Bert.alert(error.reason, 'danger');
						      				} else {
						      					Bert.alert("Added new lot!", 'success')
						      				}
										}	
					      				)
					      		} else {
						      		var vend = this.state.vendor;
						      		var price = undefined;

						      		this.props.ingredient.vendorInfo.forEach(function(vendor){
						      			if(vend == vendor.vendor){
						      				price = vendor.price;
						      			}
						      		})
						      		this.state.price = price;
						      		Meteor.call('lots.add',
					      			this.props.ingredient._id,
					      			Number(this.state.lotQty),
					      			this.state.lotNum,
					      			this.state.vendor,
					      			Number(this.state.price),
					      			new Date(),
					      			function(error,result){
					      				if(error){
					      					console.log("something goes wrong with the following error message " + error.reason )
					                    	Bert.alert(error.reason, 'danger');
					      				} else {
					      					Bert.alert("Added new lot!", 'success')
					      				}
					      			}
					      		)
					      		}
					      		
//    'lots.add': function(ingID, qty, lotNumber, vendor, price, time) {

					      	}else{
					      		Bert.alert("Vendor required to add new lot", 'danger')
					      	}
					             // Meteor.call('addIngredientToCart',
					             //    row.original.fullIng,
					             //    qty, 
					             //    vendor._id,
					             //    function(error,result){
					             //       if(error){
					             //        	console.log("something goes wrong with the following error message " + error.reason )
					             //        	Bert.alert(error.reason, 'danger');
						            //     } else {
						            //         Bert.alert('Added ' + qty +' ' + row.original.fullIng.packageInfo.packageType + '(s) to Cart!', 'success')
						            //     }
					             // 	}
					             // );

					     }}
					     >
					     Add Lot To Ingredient
					     </Button></td>
					</tr>
				</tbody>
				</table>
			</div>
		) : null;
	}

	////////////////////////////////////////////////
	///											 ///
	/// Render 									 ///
	///											 ///
	////////////////////////////////////////////////
	renderTable(_this) {
		console.log(_this)
		return (
			<div>
			<ReactTable
			data={_this.renderRows(_this.props.ingredient, _this.props.vendors)}
			filterable
			defaultPageSize={5}
			defaultFilterMethod={ (filter, row) => 
				String(row[filter.id]).toLowerCase().includes(filter.value.toLowerCase())
			}
			SubComponent={row => {
            	return TableData.canEdit ? (
            		<div className="container-nav">
						<ButtonToolbar>
				<Button
				bsStyle="danger"
				//onClick={this.remove.bind(row)}
				onClick={e => {
					if (confirm('Delete this Lot?')){
		//    'lots.editLotQty': function(id, lotNumber, newQty, date) {
						console.log(row.original)
						Meteor.call('lots.editLotQty', 
                        	row.original.ingredient._id,
                          	row.original.num,
                          	Number(0),
                          	new Date(row.original.time),
                          	function(error, result){
                          		if (error) {
                          			Bert.alert(error.reason, 'danger')
                          		}
                            }
                    	)
					}
					
				}}
				>Remove Lot</Button> 
				</ButtonToolbar>
				</div>

            	) : null
            }}
			columns={LotsTableData.HeaderValues}
            />
            </div>
            );
	}

	render() {
		return (
			<div>
			{this.renderAddLot()}
            {this.renderTable(this)}
            </div>
        );
	}
}

export default withTracker(() => {
	Meteor.subscribe('ingredients')
	Meteor.subscribe('vendors')
	Meteor.subscribe('lots');
	return {
		ingredients: IngredientsList.find({}).fetch(),
		vendors: Vendors.find({}).fetch(),
		lots: Lots.find({}).fetch()
	};
})(LotsTable);