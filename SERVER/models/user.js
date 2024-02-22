const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,

    },
    firstName: {
        type: String,
        required: true,

    },
    lastName: {
        type: String,
        required: true,

    },
    password: {
        type: String,
        required: true,
        min: 6
    },
    refresh_token: String


}, {

    timestamps: true, versionKey: false
    ,
    virtuals: {
        fullName: {
            get() {
                return `${this.firstName} ${this.lastName}`
            }
        },
        id:{
            get(){
                return this._id;
            }
        }
    }
})

module.exports = mongoose.model('user', UserSchema);