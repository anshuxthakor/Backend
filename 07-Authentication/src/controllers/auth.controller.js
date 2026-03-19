const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

async function registerController(req, res) {
    const { email, name, password } = req.body;
    const isUserExist = await userModel.findOne({ email });
    if(isUserExist) {
        return res.status(409).json({
            message: 'User already exists'
        });
    };
    const user = await userModel.create({
        name,
        email,
        password: crypto.createHash('sha256').update(password).digest('hex')
    });
    
    const token = jwt.sign({
        id: user._id,
        email: user.email
    }, 
    process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    res.cookie('token', token);

    res.status(201).json({
        message: 'User registered successfully',
        user: {
            name: user.name,
            email: user.email
        },
        token: token
    });
};

async function loginController(req, res) {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if(!user) {
        return res.status(404).json({
            message: 'User not found'
        });
    };

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    if(user.password !== hashedPassword) {
        return res.status(401).json({
            message: 'Invalid password'
        });
    };

    const token = jwt.sign({
        id: user._id,
        email: user.email
    }, 
    process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token);

    res.status(200).json({
        message: 'User logged in successfully',
        user: {
            name: user.name,
            email: user.email
        },
        token: token
    });

};

async function getMeController(req, res) {
    const token = req.cookies.token; 
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await userModel.findById(decoded.id);
    res.json({
        name: user.name,
        email: user.email
    });
};

module.exports = {
    register: registerController,
    login: loginController,
    getMe: getMeController
};