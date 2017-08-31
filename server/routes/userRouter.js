import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const User = require('../models').User
const router = express.Router();  


router.get('/', (req, res) => res.status(200).send({
    message: 'Welcome to the recipe API!',
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
		            message: 'User Not Found',
		        });
	        }
	        if (!bcrypt.compareSync(req.body.password, user.password)) {
	            return res.status(401).send({
	                message: 'Login failed',
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
module.exports = router;