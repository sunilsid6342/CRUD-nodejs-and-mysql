const mongoose=require("mongoose")
const UserSchema=mongoose.Schema({
    name: String,
    email: String,
    number: String,
    img: String
});

module.exports=mongoose.model("Userdata",UserSchema);