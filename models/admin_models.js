// creat admin model schema
const mongoose=require('mongoose');
const adminSchema = new mongoose.Schema({

email:{
	type:String,
	required:false,
},  
password:{ 
	type:String,
	required:false,
},
token:{ 
	type: String,
	required:false, 
},
 
},{timestamps:true});
module.exports = AdminModel= mongoose.model("admin",adminSchema);