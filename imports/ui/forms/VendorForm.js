import React, { Component } from 'react';
 
// onSubmit={this.handleSubmit.bind(this) -> Add later!

// Task component - represents a single todo item
export default class VendorForm extends Component {
  render() {
    return (
      <form className="new-vendor">
            <input
              type="text"
              ref="vendorName"
              placeholder="Enter name of vendor"
            />
            <input
              type="text"
              ref="contactInfo"
              placeholder="Enter contact info"
            />
            <input
              type="text"
              ref="carrierCode"
              placeholder="Enter carrier code"
            />
      </form>
    );
  }
}