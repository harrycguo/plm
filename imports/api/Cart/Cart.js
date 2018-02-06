import { Mongo } from 'meteor/mongo';
import { CartSchema, CartIngredientSchema } from '../Ingredients/Schemas.js';
//Cart Database

Carts = new Mongo.Collection('carts');
carts.attachSchema(CartSchema);

