const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const passport = require('passport');
const passportLocal = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema ({
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String, 
    },
    password: {
        type: String,
    }
})

userSchema.plugin(passportLocalMongoose);

userSchema.statics.findAndValidate = async function(username, password){
    const foundUser = await this.findOne({username});
    const isValid = await bcrypt.compare(password, foundUser.password);
    return isValid ? foundUser : false;
}

userSchema.pre('save', function(next){
    if(!this.isModified('password')) return next();
    this.password = bcrypt.hash(this.password, 12);
    next();
})

module.exports = mongoose.model('User', userSchema)