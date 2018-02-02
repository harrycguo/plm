import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, FormGroup, ControlLabel } from 'react-bootstrap';
import validate from '../../../modules/validate';
import Papa from 'papaparse'

// App component - represents the whole app
class BulkImport extends Component {
    constructor(props) {
        super(props);
        console.log("User = ")
        console.log(Meteor.user());
        this.uploadFile = this.uploadFile.bind(this);
        let file
    }

    componentDidMount() {
        const component = this;
    
        validate(component.form, {
          rules: {
            fileUp: {
              required: true,
              file: true,
            },
            
          },
          messages: {
            fileUp: {
              required: 'Need a File.',
              file: 'Is this the correct format?',
            },
          },
          submitHandler() { component.handleSubmit(); },
        });
      }
    
      handleSubmit() {
        console.log(file)
      }

      uploadFile(event){
        file = event.target.files[0];
        console.log(file);
        let data
        
        Papa.parse(file, {
          dynamicTyping: true,
          header: true,
          complete: function(results) {
            data = results;
            console.log(data)
          }
        });

      

    
        
        
        // if (file) {
        //   let data = new FormData();
        //   data.append('file', file);
        //   // axios.post('/files', data)...
        // }
      }

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Bulk Import</h1>
                </header>
                <li><Link to='/adminHomepage'>Admin Home</Link></li>
                <hr></hr>
                <b>Upload File Below</b>
                
                <p>
                <input type="file"
                name="myFile"
                onChange={this.uploadFile} />
                </p>

                <form ref={form => (this.form = form)} onSubmit={event => event.preventDefault()}>
                <Button type="submit" bsStyle="success">Import</Button>
                </form>




            </div>
        );
    }
}

export default BulkImport;





