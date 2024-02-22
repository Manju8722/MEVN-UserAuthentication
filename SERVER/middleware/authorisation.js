const jwt = require('jsonwebtoken');
const User = require('../models/user');

async function authorisation(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader?.startsWith('Bearer ')) {

        const access_token = authHeader.split(' ')[1];

        const decoded = await jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET_KEY, async (err, decoded) => {
            if (err) {
                console.log(err);
                req.user = {};
                next();
            }

            const user = await User.findOne({ _id: decoded.id }, { password: 0, refresh_token: 0 });
            
            if (user) {
                req.user = user;
                next();
            }
            else {
                req.user = {};
                next();
            }



        });




    }
    else {
        req.user = {};
        next();
    }


} module.exports = authorisation;