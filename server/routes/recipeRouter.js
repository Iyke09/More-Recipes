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
        	// todo.update({
        	// 	ingredients:todo.ingredients.push(req.body.ingred)
        	// }))
        	// .catch(error => res.status(400).send(error.toString()))
        .catch(error => res.status(400).send(error.toString()))
    } 
);

router.put('/:id', (req, res) => { //--------------------------checked
	let decoded = jwt.decode(req.query.token);
	    Recipe.findById(req.params.id)
	    .then(recipe => {
	        if (!recipe) {
		        return res.status(404).send({
		            message: 'recipe Not Found',
		        });
	        }
	        if (recipe.user != decoded.user.id) {
	            return res.status(401).json({
	                message: 'user not Authenticated'
	            });
	        }
		    return recipe
		        .update({
		            name: req.body.name || recipe.name,
		            description: req.body.description || recipe.description,
		            category: req.body.category || todo.category,    //chinese
		            upvote:req.body.upvote || recipe.upvote, 
		      		downvote:req.body.downvote || recipe.downvote,
		      		user: decoded.user.id || recipe.user,
		      		favorite: req.body.fav
		        })
		        .then(() => res.status(200).send({
		        	message:'recipe updated!'
		        }))  // Send back the updated todo.
		        .catch((error) => res.status(400).send(error));
	    })
	    .catch(error => res.status(400).send(error));
    }  //------------------------checked
);



module.exports = router;