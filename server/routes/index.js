import express from 'express';
import user from './user';

const v1 = express.Router();

v1.use('/v1',user)
// v1.use('/v1/recipe',recipe)

module.exports = v1;
console.log(kdssds);
