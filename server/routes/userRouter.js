import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const User = require('../models').User
const Recipe = require('../models').Recipe
const Favorite = require('../models').Favorite
const router = express.Router();  


router.get('/', (req, res) => res.status(200).send({
    message: 'Welcome to the your Favorite API!',
}));

router.post('/signup', (req, res) => {   //--------------------------checked
        User.create({ 
      		email: req.body.email,
      		password: bcrypt.hashSync(req.body.password, 10)
      	})
        .then(user => res.status(201).send(user))
        .catch(error => res.status(400).send(error.toString()))
    } 
);


router.post('/signin', (req, res) => { //----------------------------checked
	User.findOne({
		where:{
			email:req.body.email
		}
	})
	.then(user => {
	        if (!user) {
		        return res.status(404).send({
		            message: 'invalid login details',
		        });
	        }
	        if (!bcrypt.compareSync(req.body.password, user.password)) {
	            return res.status(401).send({
	                message: 'Incorrect password',
	            });
	        }
	        let token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
	        res.status(200).send({
	            message: 'Successfully logged in',
	            token: token,
	            userId: user.id
	        }); 
	    })
	    .catch(error => res.status(400).send(error));
    } 
);

router.get('/:id', (req, res) => {  //------------------checked
    User.findById(req.params.id, {
      include: [{
        model: Recipe,
        as: 'recipes',
      }],
    })
    .then(recipe => {
        if (!recipe) {
	        return res.status(404).send({
	          	message: 'recipe Not Found',
	        });
      	}
        return res.status(200).send(recipe);
    })
    .catch(error => res.status(400).send(error.toString())); 
});

router.get('/:id/fav', (req, res) => {  //------------------checked
    User.findById(req.params.id, {
	  include: [{
	    model: Favorite,
	    as: 'favorites'
	  }],
    })
    .then(user => {
        if (!user) {
	        return res.status(404).send({
	          	message: 'user Not Found',
	        });
      	}
        return res.status(200).send(user);
    })
    .catch(error => res.status(400).send(error.toString())); 
});



module.exports = router; 