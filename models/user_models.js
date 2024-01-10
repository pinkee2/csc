// creat vender model schema
const mongoose=require('mongoose');
const userSchema = new mongoose.Schema({
application_no:{
	type:String,
	required:false,
},
name:{
	type:String,
	required:false, 
},
email:{
	type:String,
	required:false,
},  
phone_no:{ 
	type:String,
	required:false,
},
otp:{ 
	type:String,
	required:false,
},
password:{ 
	type:String,
	required:false,
},
date_of_birth:{
	type:String,
	required:false,
},
gender:{ 
	type:String,
	required:false,
},
highest_qualification:{ 
	type:String,
	required:false,
},
house_no:{ 
	type:String,
	required:false,
},
street_no:{ 
	type:String,
	required:false,
},
area:{ 
	type:String,
	required:false,
},
city:{ 
	type:String,
	required:false,
},
state:{ 
	type:String,
	required:false,
},
district:{ 
	type:String,
	required:false,
},
pincode:{ 
	type:String,
	required:false,
},
aadhar_no:{ 
	type:String,
	required:false,
},
pan_card_no:{ 
	type:String,
	required:false,
},
aadhar_image:{
	type:String,
	required:false,
},
pan_card_image:{
	type:String,
	required:false,
},
home_image:{
	type:String,
	required:false,
},
education_image:{
	type:String,
	required:false,
},
profile:{
	type:String,
	required:false,
},
user_type:{
	type:String,
	required:false,
},
approve_status:{
	type:String,
	required:false,
},
token:{ 
	type: String,
	required:false, 
},
 
},{timestamps:true});
module.exports = UserModel= mongoose.model("user",userSchema);