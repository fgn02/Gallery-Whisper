import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required:true,
        default: false
    },
    isArtist: {
        type: Boolean,
        default: false
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Artist"
    },
    favoriteProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
    }],
    points : {
        type: Number,
        default: 0
    },
    membership : {
        type: {type: String},
        expires: { type: Date},
        discount : {type: Number, default: 0}
    }
},{
    timestamps: true
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;