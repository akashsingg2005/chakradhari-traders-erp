const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    business:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Business",
        required:true
    },

    partyType:{
        type:String,
        enum:["Customer","Supplier"],
        default:"Customer"
    },

    name:{
        type:String,
        required:true,
        trim:true
    },

    mobile:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type:String,
        default:""
    },

    address:{
        type:String,
        default:""
    },

    notes:{
        type:String,
        default:""
    },

    isActive:{
        type:Boolean,
        default:true
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Party",partySchema);