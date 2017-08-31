import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const Recipe = require('../models').Recipe
const router = express.Router();  


router.post('/', (req, res) => { //-----------------------------checked
	let decoded = jwt.decode(req.query.token);
        Recipe.create({ 
        	title:req.body.title,
      		category: req.body.category,
      		description:req.body.description,
      		upvote:req.body.upvote,
      		downvote:req.body.downvote,
      		userId: decoded.user.id,
      	})
        .then(todo => res.status(201).send(todo))
        .catch(error => res.status(400).send(error.toString()))
    } 
);


module.exports = router;