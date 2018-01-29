/* eslint-env mocha */
 
import { Meteor } from 'meteor/meteor';
import { assert } from 'chai';
 
if (Meteor.isServer) {
  describe('Login', () => {
    describe('methods', () => {
      it('Admin can login', () => {
        
        // let user = Meteor.loginWithPassword({username: 'admin'} , 'adminpassword', 
        //     (error) => {
        //         if (error) {
        //           console.log(error)
        //         } else {
        //           console.log("success!")
        //         }
        //     });

      });
    });
  });
}