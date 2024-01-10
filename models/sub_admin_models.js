// creat sub admin model schema
const mongoose=require('mongoose');
const subadminSchema = new mongoose.Schema({

email:{
	type:String,
	required:false, 
},  
password:{ 
	type:String,
	required:false,
},
otp:{ 
	type:String,
	required:false,
},
access: {
    type: Array,
    required: false,
},
token:{ 
	type: String,
	required:false, 
},
 
},{timestamps:true});
module.exports = SubAdminModel= mongoose.model("sub_admin",subadminSchema);