//Ingredients API tests
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { chai, expect } from 'meteor/practicalmeteor:chai';
import { resetDatabase } from 'meteor/xolvio:cleaner';
import IngredientsList from '../api/Ingredients/IngredientList.js'

// fixtures.common = {
//   reset: function () {
//     // make sure the DDP connection is not logged in before clearing the database
//     server.call('logout');
//     server.execute(function () {
//       Package['xolvio:cleaner'].resetDatabase();
//     });
//   }
// };

describe('IngredientsList', function () {
  beforeEach(function () {
    server.call('logout');
    // server.execute(function () {
    //   Package['xolvio:cleaner'].resetDatabase();
    // });
    // server.call('login', {
    //     user: {email: "kim@mail.com"},
    //     password: "password"
    // });
    resetDatabase();
   });
});