// import dependancies and models in controllers js files
var nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const mongoose =require('mongoose'); 
const axios = require('axios');  
const User=require('../models/user_models'); 
const PanCard = require("../models/pancard_models");
const VoterCard = require("../models/voterid_models");
const LabourCard = require("../models/labourcard_models");
const UdidCard = require("../models/udidcard_models");
const AyushmanCard = require("../models/ayushmancard_models");
const EshramCard = require("../models/esharamcard_models");
const documentModel = require("../models/document_models");
const serviceModel = require("../models/all_service_models");
const questionModel = require("../models/question_models");
const contactModel = require("../models/contact_models");
const answerModel = require("../models/answer_models");
const incomeCertificateModel = require('../models/income_models');
const domicileCertificateModel = require('../models/domicile_models');
const castCertificateModel = require('../models/caste_models');
const pfWithdrawalModel = require('../models/pf_withdrawal_models');
const pfKycModel = require('../models/pf_kyc_models');
const pfNominationModel = require('../models/pf_nomination_models');
const pfMidTransferModel = require('../models/pf_mid_transfer_models');
const policeVerificationModel = require('../models/police_verification_models');
const firModel = require('../models/fir_models');
const lostReportModel = require('../models/lost_report_models');
const aadharAddressModel = require('../models/aadhar_address_models');
const ayushmanAddressModel = require('../models/ayushman_address_models');
const upRationCardModel = require('../models/up_rationcard_models');
const pancardCorrectionModel = require('../models/pancard_correction_models');
const otherFormModel = require('../models/other_form_models');
const msmeModel = require('../models/msme_models');
const foodLicenseModel = require('../models/food_license_models');
const freshPassportModel = require('../models/fresh_passport_models');
const tatkalPassportModel = require('../models/tatkal_passport_models');
const renewelPassportModel = require('../models/renewel_passport_models');
const railwayTicketModel = require('../models/railway_ticket_models');
const insuranceModel = require('../models/insurance_models');
const queryBoxModel = require('../models/query_box_models');

const JWT_SECRET_KEY = 'gfg_jwt_secret_key';
const TOKEN_KEY = 'gfg_token_header_key';
  
// create Register api using post method   
const User_Signup =async(req,res)=>{ 
    const {name,email,phone_no,date_of_birth,gender,highest_qualification,house_no,street_no,area,city,state,district,pincode,aadhar_no,pan_card_no,user_type} =req.body;  
    //const {aadhar_image,pan_card_image,home_image,education_image} =req.files
   
    try{
        if(name && email && phone_no && date_of_birth && gender && highest_qualification && house_no && street_no && area && city && state && district && pincode && user_type && req.files ){   
            const user = await User.findOne({email:email});
            if(user){
                res.status(400).json({
                    result:'false',
                    msg:'user allready registered, please go to login page..',
                    data:user
                });
            }else{
                function generateOrderNumber() {
                    const no =  Math.floor(10000 + Math.random() * 90000);
                    // const now = new Date();
                    // const year = now.getFullYear().toString().slice(-4);
                    // const month = ('0' + (now.getMonth() + 1)).slice(-2);
                    // const day = ('0' + now.getDate()).slice(-2); 
                    const orderNumber = 'cscwale' + no;
                    return orderNumber;
                }
                const ApplicationNumber = generateOrderNumber(); 
                function generatePassword() {
                    var length = 8,
                    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
                     retVal = "";
                    for (var i = 0, n = charset.length; i < length; ++i) {
                        retVal += charset.charAt(Math.floor(Math.random() * n));
                    }
                    return retVal;
                } 
                const password = generatePassword();
                const aadhar_image = req.files;
                const pan_card_image = req.files;
                const home_image = req.files;
                const education_image = req.files;
                const arrayImage=[];
                for(let i=0;i<aadhar_image.length;i++){
                   arrayImage[i]=aadhar_image[i].filename;
                }
                for(let j=0;j<pan_card_image.length;j++){
                   arrayImage[j]=pan_card_image[j].filename;
                }
                for(let k=0;k<home_image.length;k++){
                   arrayImage[k]=home_image[k].filename; 
                }
                for(let l=0;l<education_image.length;l++){
                   arrayImage[l]=education_image[l].filename;
                }
                const otp = Math.floor(1000 + Math.random() * 9000);
                const user_register = new User({application_no:ApplicationNumber,name,email,phone_no,password:password,date_of_birth,gender,highest_qualification,house_no,street_no,area,city,state,district,pincode,aadhar_no,pan_card_no,user_type,aadhar_image:arrayImage[0],pan_card_image:arrayImage[1],home_image:arrayImage[2],education_image:arrayImage[3],otp,approve_status:"0"});
                const user_data = await user_register.save()
               // const token = jwt.sign({ _id: user_register._id,phone_no },TOKEN_KEY, {expiresIn: "1h",});
               // user_register.token = token; 
               //const user_data = await user_register.save(); 
                res.status(200).json({
                    result:'true',
                    msg:'user registered sucessfully..',
                    data:user_data
                    //data:user_register
                });
            }
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required name,email,phone_no,date_of_birth,gender,highest_qualification,house_no,street_no,area,city,state,district,pincode,aadhar_no, pan_card_no,user_type(operator),aadhar_image,pan_card_image,home_image & education_image..'
            }); 
        }        
    }catch(error){
        console.log(error.message)
    } 
};

//create self login api
 const Self_Login_One =async(req,res)=>{
    const {phone_no,user_type} =req.body;
    try{
        if(phone_no && user_type){ 
            
            const user = await User.findOne({phone_no:phone_no});
            
            if(user){
                const _id = user._id
                const otp = Math.floor(1000 + Math.random() * 9000);
                const token = jwt.sign({_id: user._id, phone_no },TOKEN_KEY,{expiresIn: "1h",});
                const user_data = await User.findByIdAndUpdate({_id:_id},{$set:{otp,user_type,token}},{new:true});
                res.status(200).json({
                    result:'true',
                    msg:'otp send successfully please verify..',
                    //data:user_data
                    data:{
                    _id:user_data._id,
                    phone_no:user_data.phone_no,
                    otp:user_data.otp,
                    token:user_data.token
                    }
                });
            }else{ 
                const otp = Math.floor(1000 + Math.random() * 9000);
                const user_register = new User({phone_no,otp,user_type});
                const token = jwt.sign({ _id: user_register._id,phone_no },TOKEN_KEY, {expiresIn: "1h",});
                user_register.token = token; 
                const user_data = await user_register.save(); 
                res.status(200).json({
                    result:'true',
                    msg:'otp send successfully please verify..',
                    //data:user_data
                    data:{
                    _id:user_data._id,
                    phone_no:user_data.phone_no,
                    otp:user_data.otp,
                    token:user_data.token
                    }
                }); 
            }
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required phone_no & user_type(self)..'
            }); 
        }        
    }catch(error){
        console.log(error.message)
    }
};


const Self_Login = async (req, res) => {
    try {
        const { phone_no, user_type } = req.body;
        async function sendSMS(number, message) {
            const URL = "https://sms.adservs.co.in/vb/apikey.php";
            const PARAMS = {
                'apikey': 'PW6SamKGUEKsbX47',
                'senderid': 'EONLNE',
                'number': number,
                'message': message,
            };

            const queryString = new URLSearchParams(PARAMS).toString();
            const requestURL = `${URL}?${queryString}`;

            try {
                const { data } = await axios.post(requestURL);
                return data
            } catch (error) {
                console.error("Error sending SMS:", error);
            }
        }

        if (phone_no && user_type) {
            const user = await User.findOne({ phone_no: phone_no });

            if (user) {
                const _id = user._id;
                let otp = Math.floor(1000 + Math.random() * 9000);
                const token = jwt.sign({ _id: user._id, phone_no }, TOKEN_KEY, { expiresIn: "1h" });


                const message = "Dear User, " + otp + "  is your OTP To Login on CSCWALE  -AdServs "



                const smsData = await sendSMS(phone_no, message);
                if (smsData.status == 'Success') {
                    const user_data = await User.findByIdAndUpdate(
                        { _id: _id },
                        { $set: { otp, token, user_type } },
                        { new: true }
                    );



                    res.status(200).json({
                        result: true,
                        msg: 'OTP sent successfully. Please verify.',
                        data: {
                            _id: user_data._id,
                            phone_no: user_data.phone_no,
                            otp: user_data.otp,
                            token: user_data.token
                        }
                    });
                } else {
                    res.status(400).json({ result: "false", msg: "Invalid Number" })
                }


            } else {
                const otp = Math.floor(1000 + Math.random() * 9000);

                const message = "Dear User, " + otp + "  is your OTP To Login  on CSCWALE  -AdServs"
                const smsData = await sendSMS(phone_no, message);
                if (smsData.status == 'Success') {

                    const selfLoginData = new User({ phone_no, otp, user_type });
                    const data = await selfLoginData.save();

                    res.status(200).json({
                        result: true,
                        msg: 'OTP sent successfully. Please verify.',
                        data: {
                            _id: selfLoginData._id,
                            phone_no: selfLoginData.phone_no,
                            otp: selfLoginData.otp,
                        }
                    });
                } else {
                    res.status(400).json({ result: "false", msg: "Invalid Number" })
                }


            }
        } else {
            res.status(400).json({
                result: false,
                msg: 'Parameters required: phone_no and user_type',
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            result: false,
            msg: 'Internal server error',
        });
    }
};
 
//create operator login api
 const Operator_Login =async(req,res)=>{
    const {email,password} =req.body;

    try{ 
        if(email && password){ 
            const user = await User.findOne({email:email,password:password,approve_status:1});
           
            if(user){
                const _id = user._id
                const token = jwt.sign({_id: user._id, email },TOKEN_KEY,{expiresIn: "1h",});
                const user_data = await User.findByIdAndUpdate({_id:_id},{$set:{token}},{new:true});
                res.status(200).json({
                    result:'true',
                    msg:'operator successfully login..',
                    //data:user_data
                    data:{
                    _id:user_data._id,
                    email:user_data.email,
                    password:user_data.password,
                    token:user_data.token
                    }
                });
            }else{   
                res.status(400).json({
                    result:'false',
                    msg:'email does not exist or not approve by admin..'
                });
            }
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required email & password..'
            }); 
        }        
    }catch(error){
        console.log(error.message)
    }
};

//create verify otp api 
 const Verify_Otp =async(req,res)=>{
    const {_id,otp} =req.body;

    try{
        if(_id && otp){
            
            if(mongoose.Types.ObjectId.isValid(_id)) { 
                
                const user = await User.findOne({_id:_id,otp:otp});
            
                if(user){
                    res.status(200).json({
                        result:'true',
                        msg:'otp verify successfully..',
                        _id:user._id,
                    });
                }else{ 
                 
                    res.status(400).json({
                        result:'false',
                        msg:'invalid otp please enter valid otp..'
                    });
                }
            } else {
                res.status(400).json({
                    result: 'false',
                    msg: 'Invalid ObjectId for _id parameter.'
                });
            }
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required _id & otp..'
            }); 
        }        
    }catch(error){
        console.log(error.message)
    }
};

//create pancard details
const Pancard_Details = async (req, res) => {
    try {
        const { user_id,name, father_name, phone_no, address, message, email, other_details1,other_details2,other_details3 } = req.body
        if(user_id && name && father_name && phone_no && address){
        
            const aadhar_img = req.files;
            const user_img = req.files;
            const signature_img = req.files;
            const other_file1 = req.files;
            const other_file2 = req.files;
            const other_file3 = req.files;
            const arrayImage = [];

            for (let i = 0; i < aadhar_img.length; i++) {
                arrayImage[i] = aadhar_img[i].filename;
            }
            for (let j = 0; j < user_img.length; j++) {
               arrayImage[j] = user_img[j].filename;
            }
            for (let k = 0; k < signature_img.length; k++) {
                arrayImage[k] = signature_img[k].filename;
            }
            for (let l = 0; l < other_file1.length; l++) {
                arrayImage[l] = other_file1[l].filename;
            }
            for (let m = 0; m < other_file2.length; m++) {
                arrayImage[m] = other_file2[m].filename;
            }
            for (let n = 0; n < other_file3.length; n++) {
                arrayImage[n] = other_file2[n].filename;
            }

            const pancard_details = new PanCard({ user_id,name, father_name, phone_no, address, message, email, other_details1, other_details2, other_details3, aadhar_img: arrayImage[0], user_img: arrayImage[1],signature_img: arrayImage[2], other_file1: arrayImage[3], other_file2: arrayImage[4], other_file3:arrayImage[5],approve_status:'0' });
            const pancard_data = await pancard_details.save()
            res.status(200).json({ 
                result: 'true', 
                msg: 'pan card data add successfully'
            })
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required user_id, name, father_name, phone_no, address, message, email, other_details1, other_details2,other_details3, aadhar_img, user_img, signature_img, other_file1, other_file2 & other_file3..'
            });  
        }
    } catch (error) {
        console.log(error.message)
    }
}

//create voterid details
const VoterId_Details = async (req, res) => {
    try {
        const { user_id,name, father_name, mother_name, aadhar_linked_phon_no, message,other_details1,other_details2,other_details3 } = req.body;
        if(user_id && name && father_name && mother_name && aadhar_linked_phon_no && message){
            const user_img = req.files;
            const aadhar_img = req.files;
            const family_voterid_img = req.files;
            const signature_img = req.files;
            const other_file1 = req.files;
            const other_file2 = req.files;
            const other_file3 = req.files;

            const arrayImage = [];

            for (let i = 0; i < user_img.length; i++) {
                arrayImage[i] = user_img[i].filename;
            }
            for (let j = 0; j < aadhar_img.length; j++) {
                arrayImage[j] = aadhar_img[j].filename;
            }
            for (let k = 0; k < family_voterid_img.length; k++) {
               arrayImage[k] = family_voterid_img[k].filename;
            }
            for (let l = 0; l < signature_img.length; l++) {
                arrayImage[l] = signature_img[l].filename;
            }
            for (let m = 0; m < other_file1.length; m++) {
               arrayImage[m] = other_file1[m].filename;
            }
            for (let n = 0; n < other_file2.length; n++) {
               arrayImage[n] = other_file2[n].filename;
            }
            for (let o = 0; n < other_file3.length; o++) {
               arrayImage[o] = other_file3[o].filename;
            }
            const voterid_details = new VoterCard({ user_id, name, father_name, mother_name, aadhar_linked_phon_no, message,other_details1,other_details2,other_details3, user_img: arrayImage[0], aadhar_img: arrayImage[1], family_voterid_img: arrayImage[2], signature_img: arrayImage[3], other_file1: arrayImage[4], other_file2: arrayImage[5], other_file3: arrayImage[6],approve_status:'0' });
            const voterid_data = await voterid_details.save()
            res.status(200).json({ 
                result: 'true', 
                msg: 'voter id data add sucessfully' 
            })
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required user_id, name, father_name, mother_name, aadhar_linked_phon_no, message, other_details1,other_details2,other_details3,user_img, aadhar_img, family_voterid_img, signature_img, other_file1 & other_file2..'
            }); 
        }    

    } catch (error) {
        console.log(error.message)
        res.json(error.message)
    }
}

//create labourcard details
const LabourCard_Details = async (req, res) => {
    try {
        const { user_id,name, father_name, mother_name, aadhar_linked_phon_no, work_profile, message,other_details1,other_details2,other_details3 } = req.body;
        if(user_id && name && father_name && mother_name && aadhar_linked_phon_no && work_profile && message){
            const user_img = req.files;
            const aadhar_img = req.files;
            const bank_passbook_or_cheque_img = req.files;
            const nominee_aadhar_img = req.files;
            const signature_img = req.files;
            const other_file1 = req.files;
            const other_file2 = req.files;
            const other_file3 = req.files;

            const arrayImage = [];

            for (let i = 0; i < user_img.length; i++) {
               arrayImage[i] = user_img[i].filename;
            }
            for (let j = 0; j < aadhar_img.length; j++) {
               arrayImage[j] = aadhar_img[j].filename;
            }
            for (let k = 0; k < bank_passbook_or_cheque_img; k++) {
                arrayImage[k] = bank_passbook_or_cheque_img[k].filename;
            }
            for (let l = 0; l < nominee_aadhar_img.length; l++) {
               arrayImage[l] = nominee_aadhar_img[l].filename;
            }
            for (let m = 0; m < signature_img.length; m++) {
               arrayImage[m] = signature_img[m].filename;
            }
            for (let n = 0; n < other_file1.length; n++) {
                arrayImage[n] = other_file2[n].filename;
            }
            for (let o = 0; o < other_file2.length; o++) {
                arrayImage[o] = other_file3[o].filename;
            }
            for (let p = 0; p < other_file3.length; p++) {
                arrayImage[p] = other_file3[p].filename;
            }

            const labourcard_details = new LabourCard({ user_id,name, father_name, mother_name, aadhar_linked_phon_no, work_profile, message,other_details1,other_details2,other_details3, user_img: arrayImage[0], aadhar_img: arrayImage[1], bank_passbook_or_cheque_img: arrayImage[2], nominee_aadhar_img: arrayImage[3], signature_img: arrayImage[4], other_file1: arrayImage[5], other_file2: arrayImage[6], other_file3: arrayImage[7],approve_status:'0' });
            const labourcard_data = await labourcard_details.save()
            res.status(200).json({ 
                result: 'true', 
                msg: 'labour card data add successfully'
            })
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required user_id,name, father_name, mother_name, aadhar_linked_phon_no, work_profile, message, other_details1,other_details2,other_details3, user_img, aadhar_img, bank_passbook_or_cheque_img, nominee_aadhar_img, signature_img, other_file1, other_file2 & other_file3 ..'
            }); 
        }    
    } catch (error) {
        console.log(error.message)
        res.json(error.message)
    }
}

//create udidcard details
const UdidCard_Details = async (req, res) => {
    try {
        const { user_id, name, father_name, mother_name, aadhar_linked_phon_no, disability_type, message,other_details1,other_details2,other_details3 } = req.body;
        if(user_id && name && father_name && mother_name && aadhar_linked_phon_no && message){
            const user_img = req.files;
            const aadhar_img = req.files;
            const father_or_mother_aadhar_img = req.files;
            const signature_img = req.files;
            const disability_certificate = req.files;
            const other_file1 = req.files;
            const other_file2 = req.files;
            const other_file3 = req.files;

            const arrayImage = [];

            for (let i = 0; i < user_img.length; i++) {
                arrayImage[i] = user_img[i].filename;
            }
            for (let j = 0; j < aadhar_img.length; j++) {
                arrayImage[j] = aadhar_img[j].filename;
            }
            for (let k = 0; k < father_or_mother_aadhar_img; k++) {
                arrayImage[k] = father_or_mother_aadhar_img[k].filename;
            }
            for (let l = 0; l < signature_img.length; l++) {
                arrayImage[l] = signature_img[l].filename;
            }
            for (let m = 0; m < disability_certificate.length; m++) {
                arrayImage[m] = disability_certificate[m].filename;
            }
            for (let n = 0; n < other_file1.length; n++) {
                arrayImage[n] = other_file2[n].filename;
            }
            for (let o = 0; o < other_file2.length; o++) {
                 arrayImage[o] = other_file3[o].filename;
            }
            for (let p = 0; p < other_file3.length; p++) {
                 arrayImage[p] = other_file3[p].filename;
            } 
            const udidcard_details = new UdidCard({user_id, name, father_name, mother_name, aadhar_linked_phon_no, disability_type, message,other_details1,other_details2,other_details3, user_img: arrayImage[0], aadhar_img: arrayImage[1], father_or_mother_aadhar_img: arrayImage[2], signature_img: arrayImage[3], disability_certificate: arrayImage[4], other_file1: arrayImage[5], other_file2: arrayImage[6], other_file3: arrayImage[7],approve_status:'0' });
            const udidcard_data = await udidcard_details.save()
            res.status(200).json({ sucess: true, message: 'details submitted' })
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required user_id, name, father_name, mother_name, aadhar_linked_phon_no, disability_type, message,other_details1,other_details2,other_details3,user_img,aadhar_img,father_or_mother_aadhar_img,signature_img,disability_certificate,other_file1,other_file2 & other_file3 ..'
            }); 
        } 
    } catch (error) {
        console.log(error.message)
        res.json(error.message)
    }
}

// update pan card data
// const UpdatePancardData = async (req, res) => {
//     try {
//         const { id, name, father_name, phone_no, address, message } = req.body
//         console.log(req.files)
//         const aadhar_img = req.files;
//         const user_img = req.files;
//         const other_file1 = req.files;
//         const other_file2 = req.files;

//         const arrayImage = [];

//         for (let i = 0; i < aadhar_img.length; i++) {
//             arrayImage[i] = aadhar_img[i].filename;
//         }
//         for (let j = 0; j < user_img.length; j++) {
//             arrayImage[j] = user_img[j].filename;
//         }
//         for (let k = 0; k < other_file1.length; k++) {
//             arrayImage[k] = other_file1[k].filename;
//         }
//         for (let l = 0; l < other_file2.length; l++) {
//             arrayImage[l] = other_file2[l].filename;
//         }

//         const updatedData = await PanCard.findByIdAndUpdate({ _id: id }, { name, father_name, phone_no, address, message, aadhar_img: arrayImage[0], user_img: arrayImage[1], other_file1: arrayImage[2], other_file2: arrayImage[3] }, { new: true })
//         res.send(updatedData)

//     } catch (error) {
//         console.log(error.message)
//     }
// }

// create ayushman card details
const AyushmanCard_Details = async (req, res) => {
    try {
        const { user_id, name, aadhar_linked_phon_no, category_detail, message, other_details1, other_details2, other_details3 } = req.body
        if (user_id && name && aadhar_linked_phon_no && category_detail && message && req.files) {
            const aadhar_img = req.files;
            const user_img = req.files;
            const other_file1 = req.files;
            const other_file2 = req.files;
            const other_file3 = req.files;

            const arrayImage = [];

            for (let i = 0; i < aadhar_img.length; i++) {
                arrayImage[i] = aadhar_img[i].filename;
            }
            for (let j = 0; j < user_img.length; j++) {
                arrayImage[j] = user_img[j].filename;
            }
            for (let k = 0; k < other_file1.length; k++) {
                arrayImage[k] = other_file1[k].filename;
            }
            for (let l = 0; l < other_file2.length; l++) {
                arrayImage[l] = other_file2[l].filename;
            }
            for (let m = 0; m < other_file3.length; m++) {
                arrayImage[m] = other_file3[m].filename;
            }

            const ayushmanCard_Details = new AyushmanCard_Model({
                user_id, name, aadhar_linked_phon_no, category_detail, message, other_details1, other_details2, other_details3, aadhar_img: arrayImage[0], user_img: arrayImage[1], other_file1: arrayImage[2], other_file2: arrayImage[3], other_file3: arrayImage[4]
            })

            const ayushmanCardData = await ayushmanCard_Details.save()
            res.status(200).json({ result: "true", msg: 'ayushman card details submited', data: ayushmanCardData })
        } else {
            res.status(400).json({ result: "false", msg: "parameters required user_id,name, aadhar_linked_phon_no, category_detail, message,other_details1, other_details2, other_details3, aadhar_img, user_img, other_file1,other_file2 & other_file3" })
        }
    } catch (error) {
        console.log(error) 
    }
}

// create eshram card details
const EshramCard_Details = async (req, res) => {
    try {
        const { user_id, name, father_name, mother_name, aadhar_linked_phon_no, work_profile, message, other_details1, other_details2, other_details3 } = req.body
        if (user_id && name && father_name && mother_name && aadhar_linked_phon_no && work_profile && message && req.files) {
            const aadhar_img = req.files;
            const bank_passbook_or_cheque_img = req.files;
            const nominee_aadhar_img = req.files;
            const other_file1 = req.files;
            const other_file2 = req.files;
            const other_file3 = req.files;

            const arrayImage = [];

            for (let i = 0; i < aadhar_img.length; i++) {
                arrayImage[i] = aadhar_img[i].filename;
            }
            for (let j = 0; j < bank_passbook_or_cheque_img.length; j++) {
                arrayImage[j] = bank_passbook_or_cheque_img[j].filename;
            }
            for (let k = 0; k < nominee_aadhar_img.length; k++) {
                arrayImage[k] = nominee_aadhar_img[k].filename;
            }
            for (let l = 0; l < other_file1.length; l++) {
                arrayImage[l] = other_file1[l].filename;
            }
            for (let m = 0; m < other_file2.length; m++) {
                arrayImage[m] = other_file2[m].filename;
            }
            for (let n = 0; n < other_file3.length; n++) {
                arrayImage[n] = other_file3[n].filename;
            }

            const eshramCard_Details = new EshramCard_Model({
                user_id, name, father_name, mother_name, aadhar_linked_phon_no, work_profile, message, other_details1, other_details2, other_details3, aadhar_img: arrayImage[0], bank_passbook_or_cheque_img: arrayImage[1], nominee_aadhar_img: arrayImage[2], other_files1: arrayImage[3], other_files2: arrayImage[4], other_files3: arrayImage[5]
            })

            const eshramCardData = await eshramCard_Details.save()
            res.status(200).json({ result: "true", msg: 'eshram card details submited', data: eshramCardData })
        } else {
            res.status(400).json({ result: "false", msg: "parameters required user_id, name, father_name, mother_name, aadhar_linked_phon_no, work_profile, message,other_details1, other_details2, other_details3,aadhar_img,bank_passbook_or_cheque_img,nominee_aadhar_img,other_file1,other_file2 & other_file3" })
        }
    } catch (error) {
        console.log(error)
    }
}

// add pdf files
const addDocument = async (req, res) => {
    try {
        const { description } = req.body
        if (description && req.file) {
            const documentData = new documentModel({
                description, file: req.file.filename
            })
            const data = await documentData.save()

            res.status(200).json({ result: "true", msg: 'document add successfull', data: data })
        } else {
            res.status(400).json({ result: "false", msg: "parameters require description and file " })
        }
    } catch (error) {
        console.log(error)
    }
}


//  get pdf files data=
const getDocument = async (req, res) => {
    try {
        const documentData = await documentModel.find()
        if (!documentData || documentData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "document data get success", data: documentData })
        }

    } catch (error) {

    }
}

// get user data by application no
const userStatus = async (req, res) => {
    try {
        const { application_no } = req.body
        if (application_no) {
            const user = await User.findOne({ application_no: application_no })
            if (!user || user.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "user data get successfull", data: user })
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require application_no" })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// get services 
const getService = async (req, res) => {
    try {
        let { search_key } = req.body;
        if (search_key) {
            search_key = String(search_key);
            const key = {
                service: { $regex: search_key, $options: 'i' },
            };
            const data = await serviceModel.find(key);
            if (!data || data.length == 0) {
                return res.status(400).json({ result: "false", msg: "service not found" })
            }
            res.status(200).json({ result: "true", msg: 'service data get success', data: data })
        } else {
            res.status(400).json({ result: "false", msg: "parameter require search_key" })
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// send question 
const sendQuestion = async (req, res) => {
    try {
        const { user_id, question, message } = req.body;

        if (user_id && question && message) {
            var query = (question === 'Instant Service ( Frequently Used Services)' || question === 'Government ID card' || question === 'Education' || question === 'Sarkari Result' || question === 'Online Form' || question === 'Other Services') ?
                'I have a query related to service' :
                'I have a query related to Transaction';

            const questions = await questionModel.find({ user_id: user_id }).sort({ _id: -1 });

          
            if (questions.length > 0) {
                const latestQuestionTime = questions[0].createdAt;
                const currentTime = new Date();
                const timeDifference = currentTime - latestQuestionTime;

                if (timeDifference < 24 *60 *60 * 1000) {
                    return res.status(400).json({ result: "false", msg: 'You can only send a question once every 24 hours.' });
                }
            }

            const questionData = new questionModel({ user_id, question, message, query });
            const data = await questionData.save();
            res.status(200).json({ result: true, msg: 'Question sent successfully', data: data });
        } else {
            res.status(400).json({ result: false, msg: 'Parameters required: user_id, question, message' });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ result: false, msg: 'Internal server error' });
    }
};


// change password
const changePassword = async (req, res) => {
    try {
        const { pan_card_no, old_password, new_password } = req.body
        if (pan_card_no && old_password && new_password) {
            const getData = await User.findOne({ pan_card_no: pan_card_no })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (old_password == getData.password) {
                    const data = await User.findOneAndUpdate({ pan_card_no: pan_card_no }, { password: new_password })

                    res.status(200).json({ result: "true", msg: "password successfully changed" })
                } else {
                    console.log(getData)
                    res.status(400).json({ result: "false", msg: "old password is not matching" })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require pan_card_no,old_password,new_password" })
        }
    } catch (error) {
        console.log(error.message)
    }
}


// upload profile
const uploadProfile = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id && req.file) {
            const getData = User.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                const userData = await User.findByIdAndUpdate({ _id: _id }, { profile: req.file.filename }, { new: true })

                const data = await userData.save()
                res.status(200).json({ result: "true", msg: "profile successfully added", data: data })
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id, profile" })
        }
    } catch (error) {
        console.log(error.message)
    }
}


//  update profile
const updateProfileData = async (req, res) => {
    try {
        console.log(req.files)

        const { _id, name, email, phone_no, date_of_birth, gender, highest_qualification, house_no, street_no, area, city, state, district, pincode, aadhar_no, pan_card_no, user_type } = req.body
        if (_id) {
            const getData = await User.findById({ id: id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (name) {
                    updateFields.name = name
                }
                if (email){
                    updateFields.email = email
                }
                if (phone_no) {
                    updateFields.phone_no = phone_no
                }
                if (date_of_birth) {
                    updateFields.date_of_birth = date_of_birth
                }
                if (gender) {
                    updateFields.gender = gender
                }
                if (highest_qualification) {
                    updateFields.highest_qualification = highest_qualification
                }
                if (house_no) {
                    updateFields.house_no = house_no
                }
                if (street_no) {
                    updateFields.street_no = street_no
                }
                if (area) {
                    updateFields.area = area
                }
                if (city) {
                    updateFields.city = city
                }
                if (state) {
                    updateFields.state = state
                }
                if (district) {
                    updateFields.district = district
                }
                if (pincode) {
                    updateFields.pincode = pincode
                }
                if (aadhar_no) {
                    updateFields.aadhar_no = aadhar_no
                }
                if (pan_card_no) {
                    updateFields.pan_card_no = pan_card_no
                }
                if (user_type) {
                    updateFields.user_type = user_type
                }
                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'aadhar_image':
                                updateFields.aadhar_image = file.filename;
                                break;
                            case 'pan_card_image':
                                updateFields.pan_card_image = file.filename;
                                break;
                            case 'home_image':
                                updateFields.home_image = file.filename;
                                break;
                            case 'education_image':
                                updateFields.education_image = file.filename;
                                break;

                            default:
                                break;
                        }
                    }
                }

                const data = await User.findByIdAndUpdate({ id: id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "profile succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter) name, phone_no, date_of_birth, gender, highest_qualification, house_no, street_no, area, city, state, district, pincode, aadhar_no, pan_card_no, user_type,aadhar_image,pan_card_image,home_image,education_image" })
        }
    } catch (error) {
        console.log(error)
    }


}

// add contact data
const contactData = async (req, res) => {
    try {
        const { name, email, phone_no, subject, message } = req.body
        if (name && email && phone_no && subject && message) {
            const contactData = new contactModel({ name, email, phone_no, subject, message })
            const data = await contactData.save()
            res.status(200).json({ result: "true", msg: "contact data save successfully ", data: data })
        } else {
            res.status(400).json({ result: "false", message: "parameter require name, email, phone_no, subject, message" })
        }

    } catch (error) {
        console.log(error.message)
    }
}

// get profile
const getProfile = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const profileData = await User.findById({ _id: _id })
            if (!profileData || profileData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "user profile get successfull", data: profileData })
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }

    } catch (error) {
        console.log(error.message)
    }
}


// update self login data
const updateSelfLoginData = async (req, res) => {
    try {
        const { _id, name, email, phone_no, date_of_birth, gender, highest_qualification, house_no, street_no, area, city, state, district, pincode, aadhar_no, pan_card_no, user_type } = req.body
        if (_id) {
            const getData = await User.findById({ _id: _id })
            console.log(getData)
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {
                const updateFields = {};
                if (name) {
                    updateFields.name = name
                }
                if (email) {
                    updateFields.email = email
                }
                if (phone_no) {
                    updateFields.phone_no = phone_no
                }
                if (date_of_birth) {
                    updateFields.date_of_birth = date_of_birth
                }
                if (gender) {
                    updateFields.gender = gender
                }
                if (highest_qualification) {
                    updateFields.highest_qualification = highest_qualification
                }
                if (house_no) {
                    updateFields.house_no = house_no
                }
                if (street_no) {
                    updateFields.street_no = street_no
                }
                if (area) {
                    updateFields.area = area
                }
                if (city) {
                    updateFields.city = city
                }
                if (state) {
                    updateFields.state = state
                }
                if (district) {
                    updateFields.district = district
                }
                if (pincode) {
                    updateFields.pincode = pincode
                }
                if (aadhar_no) {
                    updateFields.aadhar_no = aadhar_no
                }
                if (pan_card_no) {
                    updateFields.pan_card_no = pan_card_no
                }
                if (user_type) {
                    updateFields.user_type = user_type
                }
                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'aadhar_image':
                                updateFields.aadhar_image = file.filename;
                                break;
                            case 'pan_card_image':
                                updateFields.pan_card_image = file.filename;
                                break;
                            case 'home_image':
                                updateFields.home_image = file.filename;
                                break;
                            case 'education_image':
                                updateFields.education_image = file.filename;
                                break;

                            default:
                                break;
                        }
                    }
                }
                const data = await User.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "profile succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter) name, phone_no, date_of_birth, gender, highest_qualification, house_no, street_no, area, city, state, district, pincode, aadhar_no, pan_card_no, user_type,aadhar_image,pan_card_image,home_image,education_image" })
        }
    } catch (error) {
        console.log(error)
    }

}

// get answer
const getAnswer = async (req, res) => {
    try {
        const { user_id } = req.body
        if (user_id) {
            const answerData = await questionModel.find({ user_id: user_id })
            if (!answerData || answerData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "answer data get success", data: answerData })
            }
        } else {
            //res.status(400).json({ result: "false", msg: "user_id parameter require" })
            const pendingAnswer = answerData.filter(answer => !answer.answer)
            const closeAnswer = answerData.filter(answer => answer.answer)
            res.status(200).json({ result: "true", msg: "answer data get success", pendingAnswerData: pendingAnswer, closeAnswerData: closeAnswer })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// get all user submitted data
const userSubmittedData = async (req, res) => {
    try {
        const { user_id } = req.body;

        if (user_id) {
            var data = {}
            const pancardData = await PanCard.find({ user_id: user_id })

            const ayushmanCardData = await AyushmanCard.find({ user_id: user_id })

            const labourcardData = await LabourCard.find({ user_id: user_id })

            const udidcardData = await UdidCard.find({ user_id: user_id })

            const eshramcardData = await EshramCard.find({ user_id: user_id })

            const votercardData = await VoterCard.find({ user_id: user_id })

            const incomeCertificateData = await incomeCertificateModel.find({ user_id: user_id })

            const domicileCertificateData = await domicileCertificateModel.find({ user_id: user_id })

            const castCertificateData = await castCertificateModel.find({ user_id: user_id })

            const pfWithdrawalData = await pfWithdrawalModel.find({ user_id: user_id })

            const pfKycData = await pfKycModel.find({ user_id: user_id })

            const pfNominationData = await pfNominationModel.find({ user_id: user_id })

            const pfMidTransferData = await pfMidTransferModel.find({ user_id: user_id })

            const policeVerificationData = await policeVerificationModel.find({ user_id: user_id })

            const firData = await firModel.find({ user_id: user_id })

            const lostReportData = await lostReportModel.find({ user_id: user_id })

            const aadharAddressData = await aadharAddressModel.find({ user_id: user_id })

            const ayushmanAddressData = await ayushmanAddressModel.find({ user_id: user_id })

            const pancardCorrectionData = await pancardCorrectionModel.find({ user_id: user_id })

            const upRationCardData = await upRationCardModel.find({ user_id: user_id })

            const otherFormData = await otherFormModel.find({ user_id: user_id })

            const msmeData = await msmeModel.find({ user_id: user_id })

            const foodLicenseData = await foodLicenseModel.find({ user_id: user_id })

            const freshPassportData = await freshPassportModel.find({ user_id: user_id })

            const tatkalPassportData = await tatkalPassportModel.find({ user_id: user_id })

            const renewelPassportData = await renewelPassportModel.find({ user_id: user_id })

            const railwayTicketData = await railwayTicketModel.find({ user_id: user_id })

            const insuranceData = await insuranceModel.find({ user_id: user_id })



            if (!pancardData.length == 0) {
                console.log("1")
                data = { ...data, pancardData }
            }
            if (!ayushmanCardData.length == 0) {
                data = { ...data, ayushmanCardData }
            }
            if (!labourcardData.length == 0) {
                data = { ...data, labourcardData }
            }
            if (!udidcardData.length == 0) {
                data = { ...data, udidcardData }
            }
            if (!eshramcardData.length == 0) {
                data = { ...data, eshramcardData }
            }
            if (!votercardData.length == 0) {
                data = { ...data, votercardData }
            }
            if (!incomeCertificateData.length == 0) {
                data = { ...data, incomeCertificateData }
            }
            if (!domicileCertificateData.length == 0) {
                data = { ...data, domicileCertificateData }
            }
            if (!castCertificateData.length == 0) {
                data = { ...data, castCertificateData }
            }
            if (!pfWithdrawalData.length == 0) {
                data = { ...data, pfWithdrawalData }
            }
            if (!pfKycData.length == 0) {
                data = { ...data, pfKycData }
            }
            if (!pfNominationData.length == 0) {
                data = { ...data, pfNominationData }
            }
            if (!pfMidTransferData.length == 0) {
                data = { ...data, pfMidTransferData }
            }
            if (!policeVerificationData.length == 0) {
                data = { ...data, policeVerificationData }
            }
            if (!firData.length == 0) {
                data = { ...data, firData }
            }
            if (!lostReportData.length == 0) {
                data = { ...data, lostReportData }
            }
            if (!aadharAddressData.length == 0) {
                data = { ...data, aadharAddressData }
            }
            if (!ayushmanAddressData.length == 0) {
                data = { ...data, ayushmanAddressData }
            }
            if (!pancardCorrectionData.length == 0) {
                data = { ...data, pancardCorrectionData }
            }
            if (!upRationCardData.length == 0) {
                data = { ...data, upRationCardData }
            }
            if (!otherFormData.length == 0) {
                data = { ...data, otherFormData }
            }
            if (!msmeData.length == 0) {
                data = { ...data, msmeData }
            }
            if (!foodLicenseData.length == 0) {
                data = { ...data, foodLicenseData }
            }
            if (!freshPassportData.length == 0) {
                data = { ...data, freshPassportData }
            }
            if (!tatkalPassportData.length == 0) {
                data = { ...data, tatkalPassportData }
            }
            if (!renewelPassportData.length == 0) {
                data = { ...data, renewelPassportData }
            }
            if (!railwayTicketData.length == 0) {
                data = { ...data, railwayTicketData }
            }
            if (!insuranceData.length == 0) {
                data = { ...data, insuranceData }
            }

            if (Object.keys(data).length == 0) {
                return res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                console.log(!data)
                res.status(200).json({ result: "true", msg: "data get successfull", data: data });
            }

        } else {
            res.status(400).json({ result: "false", msg: "parameter required is user_id" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ result: "false", msg: "Internal server error" });
    }
};



// get single voter card data
const singleVoterCard = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const votercardData = await VoterID_Model.findOne({ _id: _id })
            if (!votercardData || votercardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "votercardData data get success", data: votercardData })
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error.message)
    }
}
// get single pancard data
const singlePanCard = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const pancardData = await PanCard_Model.findOne({ _id: _id })
            if (!pancardData || pancardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "pancard data get success", data: pancardData })
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error.message)
    }
}
// get single labourcard data
const singleLabourCard = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const labourcardData = await LabourCard_Model.findOne({ _id: _id })
            if (!labourcardData || labourcardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "labourcard data get success", data: labourcardData })
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error.message)
    }
}
// get single udid card data
const singleUdidCard = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const udidcardData = await UdidCard_Model.findOne({ _id: _id })
            if (!udidcardData || udidcardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "udidcard data get success", data: udidcardData })
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error.message)
    }
}
// get single ayushman card data
const singleAyushmanCard = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const ayushmancardData = await AyushmanCard_Model.findOne({ _id: _id })
            if (!ayushmancardData || ayushmancardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "ayushmancard data get success", data: ayushmancardData })
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error.message)
    }
}
// get single eshram card data
const singleEshramCard = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const eshramcardData = await EshramCard_Model.findOne({ _id: _id })
            if (!eshramcardData || eshramcardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "eshramcard data get success", data: eshramcardData })
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// send otp for forget password
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ result: "false", msg: "email parameter require" })
        }
        const userData = await User.findOne({ email: email })
        if (!userData) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        function Otp() {
            const min = 100000;
            const max = 999999;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        const otp = Otp();
        console.log(otp);


        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'arunlogicalsofttech@gmail.com',
                pass: 'xdqx oucu sqqu tmwi'
            }
        });

        var mailOptions = {
            from: 'arunlogicalsofttech@gmail.com',
            to: email,
            subject: 'for forget password',
            text: `your otp is ${otp} for forget password`
        };

        transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
                console.log(error);
                res.status(400).json({ result: "false", msg: error.message })
            } else {
                console.log('Email sent: ' + info.response);
                await User.findOneAndUpdate({ email: email }, { otp: otp })
                res.status(200).json({ result: "true", msg: "otp sent to your email", otp: otp })
            }
        });
    } catch (error) {
        console.log(error.message)
    }
}

// forget password
const forgotPassword = async (req, res) => {
     try {
        const { email, otp, password } = req.body
        if (!email || !password || !otp) {
            return res.status(400).json({ result: "false", msg: "parameter require email,otp, password" })
        }

        const data = await User.findOne({ email: email })
        if (!data) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }
        
        if (data.otp != otp) {
            return res.status(400).json({ result: "false", msg: "wrong otp" })
        }

        const userData = await User.findOneAndUpdate({ email: email }, { password: password }, { new: true })


        res.status(200).json({ result: "true", msg: "password forget successfull", data: userData })

    } catch (error) {
        console.log(error.message)
    }
}


// upload income certificate details
const incomeCertificate = async (req, res) => {
    try {
        const { user_id, name, phone_no, father_name, mother_name, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !name || !phone_no || !father_name || !mother_name || !message || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id,name,phone_no,father_name,mother_name,message,user_img,aadhar_img,sabhasad_or_parshad_letterhead_img,svapramanit_ghoshnapatra_or_signature_img (optional parameter) other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }

        let user_img = null
        let aadhar_img = null
        let sabhasad_or_parshad_letterhead_img = null
        let svapramanit_ghoshnapatra_or_signature_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'user_img':
                    user_img = file.filename;
                    break;
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'sabhasad_or_parshad_letterhead_img':
                    sabhasad_or_parshad_letterhead_img = file.filename;
                    break;
                case 'svapramanit_ghoshnapatra_or_signature_img':
                    svapramanit_ghoshnapatra_or_signature_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const incomeData = new incomeCertificateModel({
            user_id, name, phone_no, father_name, mother_name,message, other_details1, other_details2, other_details3, user_img, aadhar_img, sabhasad_or_parshad_letterhead_img, svapramanit_ghoshnapatra_or_signature_img, other_file1, other_file2, other_file3

        })

        const data = await incomeData.save()
        res.status(200).json({ result: "true", msg: "income certificate details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}

// upload domicile certificate details
const domicileCertificate = async (req, res) => {
    try {
        const { user_id, name, phone_no, father_name, mother_name,message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !name || !phone_no || !father_name || !mother_name || !message || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id,name,phone_no,father_name,mother_name,message,user_img,aadhar_img,sabhasad_or_parshad_letterhead_img,svapramanit_ghoshnapatra_or_signature_img (optional parameter) other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }

        let user_img = null
        let aadhar_img = null
        let sabhasad_or_parshad_letterhead_img = null
        let svapramanit_ghoshnapatra_or_signature_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'user_img':
                    user_img = file.filename;
                    break;
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'sabhasad_or_parshad_letterhead_img':
                    sabhasad_or_parshad_letterhead_img = file.filename;
                    break;
                case 'svapramanit_ghoshnapatra_or_signature_img':
                    svapramanit_ghoshnapatra_or_signature_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const domicileData = new domicileCertificateModel({
            user_id, name, phone_no, father_name, mother_name, message, other_details1, other_details2, other_details3, user_img, aadhar_img, sabhasad_or_parshad_letterhead_img, svapramanit_ghoshnapatra_or_signature_img, other_file1, other_file2, other_file3

        })

        const data = await domicileData.save()
        res.status(200).json({ result: "true", msg: "domicile certificate details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}


// upload cast certificate details
const castCertificate = async (req, res) => {
    try {
        const { user_id, name, phone_no, father_name, mother_name, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !name || !phone_no || !father_name || !mother_name || !message || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id,name,phone_no,father_name,mother_name,message,user_img,aadhar_img,sabhasad_or_parshad_letterhead_img,svapramanit_ghoshnapatra_or_signature_img,jati_praman_patra_img (optional parameter) other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }

        let user_img = null
        let aadhar_img = null
        let sabhasad_or_parshad_letterhead_img = null
        let svapramanit_ghoshnapatra_or_signature_img = null
        let jati_praman_patra_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'user_img':
                    user_img = file.filename;
                    break;
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'sabhasad_or_parshad_letterhead_img':
                    sabhasad_or_parshad_letterhead_img = file.filename;
                    break;
                case 'svapramanit_ghoshnapatra_or_signature_img':
                    svapramanit_ghoshnapatra_or_signature_img = file.filename;
                    break;
                case 'jati_praman_patra_img':
                    jati_praman_patra_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const castData = new castCertificateModel({
            user_id, name, phone_no, father_name, mother_name, message, other_details1, other_details2, other_details3, user_img, aadhar_img, sabhasad_or_parshad_letterhead_img, svapramanit_ghoshnapatra_or_signature_img, jati_praman_patra_img, other_file1, other_file2, other_file3

        })

        const data = await castData.save()
        res.status(200).json({ result: "true", msg: "cast certificate details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}



// upload pf withdrawal details
const pfWithdrawal = async (req, res) => {
    try {
        const { user_id, uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !uan_number || !password || !phone_no || !withdraw_amount || !message || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id, uan_number, password, phone_no, withdraw_amount,message,aadhar_img,bank_passbook_or_cheque_img,pancard_img, (optional parameter) other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let aadhar_img = null
        let bank_passbook_or_cheque_img = null
        let pancard_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'bank_passbook_or_cheque_img':
                    bank_passbook_or_cheque_img = file.filename;
                    break;
                case 'pancard_img':
                    pancard_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const pfWithdrawalData = new pfWithdrawalModel({
            user_id, uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3, aadhar_img, bank_passbook_or_cheque_img, pancard_img, other_file1, other_file2, other_file3

        })

        const data = await pfWithdrawalData.save()
        res.status(200).json({ result: "true", msg: "pf withdrawal details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}
// upload pf kyc details
const pfKyc = async (req, res) => {
    try {
        const { user_id, uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !uan_number || !password || !phone_no || !withdraw_amount || !message || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id, uan_number, password, phone_no, withdraw_amount, message, aadhar_img,bank_passbook_or_cheque_img,pancard_img, (optional parameter) other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let aadhar_img = null
        let bank_passbook_or_cheque_img = null
        let pancard_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'bank_passbook_or_cheque_img':
                    bank_passbook_or_cheque_img = file.filename;
                    break;
                case 'pancard_img':
                    pancard_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const pfKycData = new pfKycModel({
            user_id, uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3, aadhar_img, bank_passbook_or_cheque_img, pancard_img, other_file1, other_file2, other_file3

        })

        const data = await pfKycData.save()
        res.status(200).json({ result: "true", msg: "pf kyc details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}
// upload pf nomination details
const pfNomination = async (req, res) => {
    try {
        const { user_id, uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !uan_number || !password || !phone_no || !withdraw_amount || !message || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id, uan_number, password, phone_no, withdraw_amount, message,aadhar_img,bank_passbook_or_cheque_img,pancard_img,nominee_aadhar_img (optional parameter) other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let aadhar_img = null
        let bank_passbook_or_cheque_img = null
        let pancard_img = null
        let nominee_aadhar_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'bank_passbook_or_cheque_img':
                    bank_passbook_or_cheque_img = file.filename;
                    break;
                case 'pancard_img':
                    pancard_img = file.filename;
                    break;
                case 'nominee_aadhar_img':
                    nominee_aadhar_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const pfNominationData = new pfNominationModel({
            user_id, uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3, aadhar_img, bank_passbook_or_cheque_img, pancard_img, nominee_aadhar_img, other_file1, other_file2, other_file3

        })

        const data = await pfNominationData.save()
        res.status(200).json({ result: "true", msg: "pf nomination details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}
// upload pf mid transfer details
const pfMidTransfer = async (req, res) => {
    try {
        const { user_id, uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !uan_number || !password || !phone_no || !withdraw_amount || !message || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id, uan_number, password, phone_no, withdraw_amount, message, aadhar_img,bank_passbook_or_cheque_img,pancard_img,(optional parameter) other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let aadhar_img = null
        let bank_passbook_or_cheque_img = null
        let pancard_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'bank_passbook_or_cheque_img':
                    bank_passbook_or_cheque_img = file.filename;
                    break;
                case 'pancard_img':
                    pancard_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const pfMidTransferData = new pfMidTransferModel({
            user_id, uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3, aadhar_img, bank_passbook_or_cheque_img, pancard_img, other_file1, other_file2, other_file3

        })

        const data = await pfMidTransferData.save()
        res.status(200).json({ result: "true", msg: "pf nomination details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}

// upload police verification details
const policeVerification = async (req, res) => {
    try {
        const { user_id, name, phone_no, father_name, email, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !name || !phone_no || !father_name || !email || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id, name,phone_no, father_name, email, user_img,aadhar_img,(optional parameter) message,other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let user_img = null
        let aadhar_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'user_img':
                    user_img = file.filename;
                    break;
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const policeVerificationData = new policeVerificationModel({
            user_id, name, phone_no, father_name, email, message, other_details1, other_details2, other_details3, user_img, aadhar_img, other_file1, other_file2, other_file3

        })

        const data = await policeVerificationData.save()
        res.status(200).json({ result: "true", msg: "police verification details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}

// upload fir details
const fir = async (req, res) => {
    try {
        const { user_id, name, phone_no, father_name, email, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !name || !phone_no || !father_name || !email || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id, name,phone_no, father_name, email, user_img,aadhar_img,fir_content_img,(optional parameter) message, other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let user_img = null
        let aadhar_img = null
        let fir_content_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'user_img':
                    user_img = file.filename;
                    break;
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'fir_content_img':
                    fir_content_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const firData = new firModel({
            user_id, name, phone_no, father_name, email, message, other_details1, other_details2, other_details3, user_img, aadhar_img, fir_content_img, other_file1, other_file2, other_file3

        })

        const data = await firData.save()
        res.status(200).json({ result: "true", msg: "fir details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}


// upload lost report details
const lostReport = async (req, res) => {
    try {
        const { user_id, name, phone_no, father_name, email, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !name || !phone_no || !father_name || !email || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id, name,phone_no, father_name, email, user_img,aadhar_img,fir_content_img,(optional parameter) message, other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let user_img = null
        let aadhar_img = null
        let fir_content_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'user_img':
                    user_img = file.filename;
                    break;
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'fir_content_img':
                    fir_content_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const lostReportData = new lostReportModel({
            user_id, name, phone_no, father_name, email, message, other_details1, other_details2, other_details3, user_img, aadhar_img, fir_content_img, other_file1, other_file2, other_file3

        })

        const data = await lostReportData.save()
        res.status(200).json({ result: "true", msg: "lost report details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}


// upload aadhar address change  details
const aadharAddressChange = async (req, res) => {
    try {
        const { user_id, aadhar_number, aadhar_linked_phone_no, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !aadhar_number || !aadhar_linked_phone_no || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require  user_id, aadhar_number, aadhar_linked_phone_no, address_proof_img,(optional parameter)message, other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }



        let address_proof_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {

                case 'address_proof_img':
                    address_proof_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const aadharAddressData = new aadharAddressModel({
            user_id, aadhar_number, aadhar_linked_phone_no, message, other_details1, other_details2, other_details3, address_proof_img, other_file1, other_file2, other_file3

        })

        const data = await aadharAddressData.save()
        res.status(200).json({ result: "true", msg: "aadhar address change details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}


// upload ayushma address change  details
const ayushmanAddressChange = async (req, res) => {
    try {
        const { user_id, aadhar_number, aadhar_linked_phone_no, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !aadhar_number || !aadhar_linked_phone_no || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require  user_id, aadhar_number, aadhar_linked_phone_no, user_img,aadhar_img,(optional parameter)message, other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let user_img = null
        let aadhar_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {

                case 'user_img':
                    user_img = file.filename;
                    break;
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const ayushmanAddressData = new ayushmanAddressModel({
            user_id, aadhar_number, aadhar_linked_phone_no, message, other_details1, other_details2, other_details3, aadhar_img, user_img, other_file1, other_file2, other_file3

        })

        const data = await ayushmanAddressData.save()
        res.status(200).json({ result: "true", msg: "ayushman address change details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}

// upload up ration card  details
const upRationCard = async (req, res) => {
    try {
        const { user_id, phone_no, father_name, mother_name, husband_name, rashan_cotedar_name, bijli_bil_no, gas_connection_no, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !phone_no || !father_name || !mother_name || !husband_name || !gas_connection_no || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require  user_id, phone_no, father_name, mother_name, husband_name, rashan_cotedar_name, bijli_bil_no, gas_connection_no, user_img,aadhar_img,bank_passbook_img,family_aadhar_img,(optional parameter)   message, other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let user_img = null
        let aadhar_img = null
        let bank_passbook_img = null
        let family_aadhar_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {

                case 'user_img':
                    user_img = file.filename;
                    break;
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'bank_passbook_img':
                    bank_passbook_img = file.filename;
                    break;
                case 'family_aadhar_img':
                    family_aadhar_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const upRationCardData = new upRationCardModel({
            user_id, phone_no, father_name, mother_name, husband_name, rashan_cotedar_name, bijli_bil_no, gas_connection_no, message, other_details1, other_details2, other_details3, user_img, aadhar_img, bank_passbook_img, family_aadhar_img, other_file1, other_file2, other_file3

        })

        const data = await upRationCardData.save()
        res.status(200).json({ result: "true", msg: "up ration card details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}

// upload pan card correction details
const pancardCorrection = async (req, res) => {
    try {
        const { user_id, name, father_name, phone_no, address, message, email, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !name || !father_name || !phone_no || !address || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require  user_id, name, father_name, phone_no, address, user_img,aadhar_img,signature_img,correction_proof_img,(optional parameter)   message,email, other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let user_img = null
        let aadhar_img = null
        let signature_img = null
        let correction_proof_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {

                case 'user_img':
                    user_img = file.filename;
                    break;
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'signature_img':
                    signature_img = file.filename;
                    break;
                case 'correction_proof_img':
                    correction_proof_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const pancardCorrectionData = new pancardCorrectionModel({
            user_id, name, father_name, phone_no, address, message, email, other_details1, other_details2, other_details3, user_img, aadhar_img, signature_img, correction_proof_img, other_file1, other_file2, other_file3

        })

        const data = await pancardCorrectionData.save()
        res.status(200).json({ result: "true", msg: "pancard correction details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}

// upload other form details
const otherForm = async (req, res) => {
    try {
        const { user_id, category, name, phone_no, email, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !category || !name || !phone_no || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require  user_id, category, name, phone_no, email, user_img,aadhar_img,signature_img,tenth_result_img,add_document,(optional parameter) message, other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }



        let user_img = null
        let aadhar_img = null
        let signature_img = null
        let tenth_result_img = null
        let add_document = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null


        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {

                case 'user_img':
                    user_img = file.filename;
                    break;
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'signature_img':
                    signature_img = file.filename;
                    break;
                case 'tenth_result_img':
                    tenth_result_img = file.filename;
                    break;
                case 'add_document':
                    add_document = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const otherFormData = new otherFormModel({
            user_id, category, name, phone_no, email, message, other_details1, other_details2, other_details3, user_img, aadhar_img, signature_img, tenth_result_img, add_document, other_file1, other_file2, other_file3

        })

        const data = await otherFormData.save()
        res.status(200).json({ result: "true", msg: "other form details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
        res.status(400).json({ result: "false", msg: error.message })
    }
}

// get single income certificate data
const singleIncomeCertificate = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const incomeCertificateData = await incomeCertificateModel.findById({ _id: _id })

        if (!incomeCertificateData || incomeCertificateData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "income certificate data get success", data: incomeCertificateData })
    } catch (error) {
        console.log(error.message)
    }
}

// get single domicile certificate data
const singleDomicileCertificate = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const domicileCertificateData = await domicileCertificateModel.findById({ _id: _id })

        if (!domicileCertificateData || domicileCertificateData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "domicile certificate data get success", data: domicileCertificateData })
    } catch (error) {
        console.log(error.message)
    }
}

// get single cast certificate data
const singleCastCertificate = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const castCertificateData = await castCertificateModel.findById({ _id: _id })

        if (!castCertificateData || castCertificateData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "cast certificate data get success", data: castCertificateData })
    } catch (error) {
        console.log(error.message)
    }
}

// get single pf withdrawal data
const singlePfWithdrawal = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const pfWithdrawalData = await pfWithdrawalModel.findById({ _id: _id })

        if (!pfWithdrawalData || pfWithdrawalData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "pf withdrawal data get success", data: pfWithdrawalData })
    } catch (error) {
        console.log(error.message)
    }
}

// get single pf kyc data
const singlePfKyc = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const pfKycData = await pfKycModel.findById({ _id: _id })

        if (!pfKycData || pfKycData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "pf kyc data get success", data: pfKycData })
    } catch (error) {
        console.log(error.message)
    }
}

// get single pf nomination data
const singlePfNomination = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const pfNominationData = await pfNominationModel.findById({ _id: _id })

        if (!pfNominationData || pfNominationData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "pf nomination data get success", data: pfNominationData })
    } catch (error) {
        console.log(error.message)
    }
}

// get single pf mid transfer data
const singlePfMidTransfer = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const pfMidTransferData = await pfMidTransferModel.findById({ _id: _id })

        if (!pfMidTransferData || pfMidTransferData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "pf mid transfer data get success", data: pfMidTransferData })
    } catch (error) {
        console.log(error.message)
    }
}

// get single police verification data
const singlePoliceVerification = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const policeVerificationData = await policeVerificationModel.findById({ _id: _id })

        if (!policeVerificationData || policeVerificationData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: " police verification data get success", data: policeVerificationData })
    } catch (error) {
        console.log(error.message)
    }
}



// get single fir data
const singleFir = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const firData = await firModel.findById({ _id: _id })

        if (!firData || firData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "fir data get success", data: firData })
    } catch (error) {
        console.log(error.message)
    }
}

// get single lost report data
const singleLostReport = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const lostReportData = await lostReportModel.findById({ _id: _id })

        if (!lostReportData || lostReportData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "lost report data get success", data: lostReportData })
    } catch (error) {
        console.log(error.message)
    }
}

// get single aadhar address data
const singleAadharAddress = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const aadharAddressData = await aadharAddressModel.findById({ _id: _id })

        if (!aadharAddressData || aadharAddressData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "aadhar address data get success", data: aadharAddressData })
    } catch (error) {
        console.log(error.message)
    }
}

// get single ayushman address data
const singleAyushmanAddress = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const ayushmanAddressData = await ayushmanAddressModel.findById({ _id: _id })

        if (!ayushmanAddressData || ayushmanAddressData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "ayushman address data get success", data: ayushmanAddressData })
    } catch (error) {
        console.log(error.message)
    }
}

// get single up ration cart data
const singleUpRationCard = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const upRationCardData = await upRationCardModel.findById({ _id: _id })

        if (!upRationCardData || upRationCardData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "up ration card data get success", data: upRationCardData })
    } catch (error) {
        console.log(error.message)
    }
}


// get single pancard correction  data
const singlePancardCorrection = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const pancardCorrectionData = await pancardCorrectionModel.findById({ _id: _id })

        if (!pancardCorrectionData || pancardCorrectionData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "pancard correction data get success", data: pancardCorrectionData })
    } catch (error) {
        console.log(error.message)
    }
}



// get single other form data
const singleOtherForm = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const otherFormData = await otherFormModel.findById({ _id: _id })

        if (!otherFormData || otherFormData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "other form data get success", data: otherFormData })
    } catch (error) {
        console.log(error.message)
    }
}

// upload msme details
const msme = async (req, res) => {
    try {
        const { user_id, name, phone_no, email, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !name || !phone_no || !email || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id, name,phone_no, email, user_img,aadhar_img,office_address_proof_img,(optional parameter) message, other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let user_img = null
        let aadhar_img = null
        let office_address_proof_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'user_img':
                    user_img = file.filename;
                    break;
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'office_address_proof_img':
                    office_address_proof_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const msmeData = new msmeModel({
            user_id, name, phone_no, email, message, other_details1, other_details2, other_details3, user_img, aadhar_img, office_address_proof_img, other_file1, other_file2, other_file3

        })

        const data = await msmeData.save()
        res.status(200).json({ result: "true", msg: "msme details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}


// upload food license details
const foodLicense = async (req, res) => {
    try {
        const { user_id, name, phone_no, email, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !name || !phone_no || !email || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id, name,phone_no, email, user_img,aadhar_img,office_address_proof_img,(optional parameter) message, other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let user_img = null
        let aadhar_img = null
        let office_address_proof_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'user_img':
                    user_img = file.filename;
                    break;
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'office_address_proof_img':
                    office_address_proof_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const foodLicenseData = new foodLicenseModel({
            user_id, name, phone_no, email, message, other_details1, other_details2, other_details3, user_img, aadhar_img, office_address_proof_img, other_file1, other_file2, other_file3

        })

        const data = await foodLicenseData.save()
        res.status(200).json({ result: "true", msg: "food license details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}


// upload fresh passport  details
const freshPassport = async (req, res) => {
    try {
        const { user_id, name, phone_no, email, mother_name, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !name || !phone_no || !email || !mother_name || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id, name, phone_no, email, mother_name, aadhar_img,pancard_img,tenth_marksheet_img,(optional parameter) message, other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let aadhar_img = null
        let pancard_img = null
        let tenth_marksheet_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'pancard_img':
                    pancard_img = file.filename;
                    break;
                case 'tenth_marksheet_img':
                    tenth_marksheet_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const freshPassportData = new freshPassportModel({
            user_id, name, phone_no, email, mother_name, message, other_details1, other_details2, other_details3, aadhar_img, pancard_img, tenth_marksheet_img, other_file1, other_file2, other_file3

        })

        const data = await freshPassportData.save()
        res.status(200).json({ result: "true", msg: "fresh passport details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}


// upload tatkal passport  details
const tatkalPassport = async (req, res) => {
    try {
        const { user_id, name, phone_no, email, mother_name, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !name || !phone_no || !email || !mother_name || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id, name, phone_no, email, mother_name, aadhar_img,pancard_img,tenth_marksheet_img,(optional parameter) message, other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let aadhar_img = null
        let pancard_img = null
        let tenth_marksheet_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'pancard_img':
                    pancard_img = file.filename;
                    break;
                case 'tenth_marksheet_img':
                    tenth_marksheet_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const foodLicenseData = new tatkalPassportModel({
            user_id, name, phone_no, email, mother_name, message, other_details1, other_details2, other_details3, aadhar_img, pancard_img, tenth_marksheet_img, other_file1, other_file2, other_file3

        })

        const data = await foodLicenseData.save()
        res.status(200).json({ result: "true", msg: "tatkal passport details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}


// upload renewel passport  details
const renewelPassport = async (req, res) => {
    try {
        const { user_id, name, phone_no, email, mother_name, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !name || !phone_no || !email || !mother_name || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id, name, phone_no, email, mother_name, aadhar_img,pancard_img,tenth_marksheet_img,old_passport_or_fir_img (optional parameter) message, other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let aadhar_img = null
        let pancard_img = null
        let tenth_marksheet_img = null
        let old_passport_or_fir_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'aadhar_img':
                    aadhar_img = file.filename;
                    break;
                case 'pancard_img':
                    pancard_img = file.filename;
                    break;
                case 'old_passport_or_fir_img':
                    old_passport_or_fir_img = file.filename;
                    break;
                case 'tenth_marksheet_img':
                    tenth_marksheet_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const foodLicenseData = new renewelPassportModel({
            user_id, name, phone_no, email, mother_name, message, other_details1, other_details2, other_details3, aadhar_img, pancard_img, tenth_marksheet_img, old_passport_or_fir_img, other_file1, other_file2, other_file3

        })

        const data = await foodLicenseData.save()
        res.status(200).json({ result: "true", msg: "renewel passport details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}


// upload railway ticket  details
const railwayTicket = async (req, res) => {
    try {
        const { user_id, from, to, date, train_no, ticket_category, phone_no, passengers, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !from || !to || !date || !train_no || !ticket_category || !phone_no || !passengers || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require  user_id, from, to, date, train_no, ticket_category, phone_no, passengers, irctc_train_status_img (optional parameter) message, other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }

        let irctc_train_status_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        //var passengersData = [{ age: "21", gender: "male" }, { age: "23", gender: "male" }]
        const passengersData = JSON.parse(passengers);


        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'irctc_train_status_img':
                    irctc_train_status_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const railwayTicketData = new railwayTicketModel({
            user_id, from, to, date, train_no, ticket_category, phone_no, passengers: passengersData, message, other_details1, other_details2, other_details3, irctc_train_status_img, other_file1, other_file2, other_file3

        })

        const data = await railwayTicketData.save()
        res.status(200).json({ result: "true", msg: "railway ticket  details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}


// upload insurance   details
const insurance = async (req, res) => {
    try {
        const { user_id, name, phone_no, email, category, message, other_details1, other_details2, other_details3 } = req.body

        if (!user_id || !name || !phone_no || !email || !category || !req.files) {
            return res.status(400).json({ result: "false", msg: "parameter require  user_id, name, phone_no, email, category,rc_img,owner_id_img,old_insurance_img (optional parameter) message, other_details1,other_details2,other_details3,other_file1,other_file2,other_file3" })
        }


        let rc_img = null
        let owner_id_img = null
        let old_insurance_img = null
        let other_file1 = null
        let other_file2 = null
        let other_file3 = null

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];

            switch (file.fieldname) {
                case 'rc_img':
                    rc_img = file.filename;
                    break;
                case 'owner_id_img':
                    owner_id_img = file.filename;
                    break;
                case 'old_insurance_img':
                    old_insurance_img = file.filename;
                    break;
                case 'other_file1':
                    other_file1 = file.filename;
                    break;
                case 'other_file2':
                    other_file2 = file.filename;
                    break;
                case 'other_file3':
                    other_file3 = file.filename;
                    break;

                default:
                    break;
            }
        }

        const insuranceData = new insuranceModel({
            user_id, name, phone_no, email, category, message, other_details1, other_details2, other_details3, rc_img, owner_id_img, old_insurance_img, other_file1, other_file2, other_file3

        })

        const data = await insuranceData.save()
        res.status(200).json({ result: "true", msg: "insurance  details submit successfull", data: data })


    } catch (error) {
        console.log(error.message)
    }
}




// get single msme data
const singleMsme = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const msmeData = await msmeModel.findById({ _id: _id })

        if (!msmeData || msmeData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "msme data get success", data: msmeData })
    } catch (error) {
        console.log(error.message)
    }
}


// get single food license data
const singleFoodLicense = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const foodLicenseData = await foodLicenseModel.findById({ _id: _id })

        if (!foodLicenseData || foodLicenseData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "food license data get success", data: foodLicenseData })
    } catch (error) {
        console.log(error.message)
    }
}


// get single fresh passport data
const singleFreshPassport = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const freshPassportData = await freshPassportModel.findById({ _id: _id })

        if (!freshPassportData || freshPassportData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "fresh passport data get success", data: freshPassportData })
    } catch (error) {
        console.log(error.message)
    }
}


// get single tatkal passport data
const singleTatkalPassport = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const tatkalPassportData = await tatkalPassportModel.findById({ _id: _id })

        if (!tatkalPassportData || tatkalPassportData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "tatkal passport data get success", data: tatkalPassportData })
    } catch (error) {
        console.log(error.message)
    }
}


// get single renewel passport data
const singleRenewelPassport = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const renewelPassportData = await renewelPassportModel.findById({ _id: _id })

        if (!renewelPassportData || renewelPassportData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "renewel passport data get success", data: renewelPassportData })
    } catch (error) {
        console.log(error.message)
    }
}


// get single railway ticket data
const singleRailwayTicket = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const railwayTicketData = await railwayTicketModel.findById({ _id: _id })

        if (!railwayTicketData || railwayTicketData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "railway ticket data get success", data: railwayTicketData })
    } catch (error) {
        console.log(error.message)
    }
}


// get single insurance data
const singleInsurance = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const insuranceData = await insuranceModel.findById({ _id: _id })

        if (!insuranceData || insuranceData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        res.status(200).json({ result: "true", msg: "insurance data get success", data: insuranceData })
    } catch (error) {
        console.log(error.message)
    }
}

// add query box details
const queryBox = async (req, res) => {
    try {
        const { user_id, name, phone_no, email, concern } = req.body
        if (!user_id || !name || !phone_no || !email || !concern) {
            return res.status(400).json({ result: "false", msg: "parameter require user_id,name,phone_no,email,concern" })
        }

        const queryData = new queryBoxModel({
            user_id, name, phone_no, email, concern
        })
        const data = await queryData.save()
        res.status(200).json({
            result: "true", msg: "We’ll get back to you soon with the relevant and exact information that matches with your concern.", data: data
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ result: "false", msg: "Internel Server Error" })
    }
}



 
module.exports ={
	User_Signup,
    Self_Login,
    Verify_Otp,
    Operator_Login,
    Pancard_Details,
    VoterId_Details,
    LabourCard_Details,
    UdidCard_Details, 
    AyushmanCard_Details, 
    EshramCard_Details,
    addDocument,
    getDocument,
    userStatus,
    getService, 
    sendQuestion,
    changePassword,
    uploadProfile,
    updateProfileData,
    contactData,
    getProfile,
    updateSelfLoginData,
    getAnswer,
    userSubmittedData,
    singleVoterCard,
    singlePanCard,
    singleLabourCard,
    singleUdidCard,
    singleAyushmanCard, 
    singleEshramCard,
    singleIncomeCertificate,
    singleDomicileCertificate,
    singleCastCertificate,
    singlePfWithdrawal,
    singlePfKyc,
    singlePfNomination,
    singlePfMidTransfer,
    singlePoliceVerification,
    singleFir,
    singleLostReport,
    singleAadharAddress,
    singleAyushmanAddress,
    singleUpRationCard,
    singlePancardCorrection,
    singleOtherForm,
    sendOtp,
    forgotPassword,
    incomeCertificate,
    domicileCertificate,
    castCertificate,
    pfWithdrawal,
    pfKyc,
    pfNomination,
    pfMidTransfer,
    policeVerification,
    fir,
    lostReport,
    aadharAddressChange,
    ayushmanAddressChange,
    upRationCard,
    pancardCorrection,
    otherForm,
    msme,
    foodLicense,
    freshPassport,
    tatkalPassport,
    renewelPassport,
    railwayTicket,
    insurance,
    singleMsme,
    singleFoodLicense,
    singleFreshPassport,
    singleTatkalPassport,
    singleRenewelPassport,
    singleRailwayTicket,
    singleInsurance,
    queryBox
    //UpdatePancardData
}
