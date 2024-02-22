const allowed_origins = require('./allowed_origin');


module.exports = {
    origin: (origin, callback) => {
        if (allowed_origins.includes(origin) || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by cors'))
        }
    }

}
