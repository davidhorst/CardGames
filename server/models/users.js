var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var bcrypt = require('bcrypt');
SALT_WORK_FACTOR = 10;

var Schema = mongoose.Schema;


var UsersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: true,
         trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: [true, 'Email address is required'],
        validate: {
            validator: function(value) {
             return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
            },
            message: 'Please fill a valid email address'
        },
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']

    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        // minlength: [8, 'Password must be at least 8 characters'],
        // maxlength: [32, 'Password must less than 33 characters'],
        // validate: {
        //     validator: function( value ) {
        //       return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,32}/.test( value );
        //     },
        //     message: "Password failed validation, you must have at least 1 number, uppercase and special character"
        // }
    },
},
{timestamps: true });

UsersSchema.plugin(uniqueValidator);

UsersSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});


UsersSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('User', UsersSchema);
