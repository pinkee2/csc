// import dependancies and models in controllers js files

const jwt = require("jsonwebtoken");
const Admin=require('../models/admin_models');
const User=require('../models/user_models'); 
const PanCard = require("../models/pancard_models");
const VoterCard = require("../models/voterid_models");
const LabourCard = require("../models/labourcard_models");
const UdidCard = require("../models/udidcard_models");
const AyushmanCard = require("../models/ayushmancard_models");
const EshramCard = require("../models/esharamcard_models");
const subAdminModel = require("../models/sub_admin_models");
const chatModel = require("../models/chat_models");
const serviceModel = require("../models/all_service_models");
const questionModel = require("../models/question_models");
const contactModel = require("../models/contact_models");
const answerModel = require("../models/answer_models");
const incomeCertificateModel = require("../models/income_models");
const domicileCertificateModel = require("../models/domicile_models");
const castCertificateModel = require("../models/caste_models");
const pfWithdrawalModel = require("../models/pf_withdrawal_models");
const pfKycModel = require("../models/pf_kyc_models");
const pfNominationModel = require("../models/pf_nomination_models");
const pfMidTransferModel = require("../models/pf_mid_transfer_models");
const policeVerificationModel = require("../models/police_verification_models");
const firModel = require("../models/fir_models");
const lostReportModel = require("../models/lost_report_models");
const aadharAddressModel = require("../models/aadhar_address_models");
const ayushmanAddressModel = require("../models/ayushman_address_models");
const upRationCardModel = require("../models/up_rationcard_models");
const pancardCorrectionModel = require("../models/pancard_correction_models");
const otherFormModel = require("../models/other_form_models");
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

//create admin login api
 const Admin_Login =async(req,res)=>{
    const {email,password} =req.body; 

    try{ 
        if(email && password){ 
            const admin = await Admin.findOne({email:email,password:password});
           
            if(admin){
                const _id = admin._id
                const token = jwt.sign({_id: admin._id, email },TOKEN_KEY,{expiresIn: "1h",});
                const admin_data = await Admin.findByIdAndUpdate({_id:_id},{$set:{token}},{new:true});
                res.status(200).json({
                    result:'true',
                    msg:'admin successfully login..',
                    //data:admin_data
                    data:{
                    _id:admin_data._id,
                    email:admin_data.email,
                    password:admin_data.password,
                    token:admin_data.token
                    }
                });
            }else{   
                res.status(400).json({
                    result:'false',
                    msg:'email does not exist..'
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


// get user self list api 
const User_Self_List=async(req,res)=>{
    try{     
        const result = await User.find({'user_type':'self'}); 
        if(!result || result.length==0){
            res.status(400).json({
                result: 'false',
                msg: 'record not found..'
            })
        }else{
            res.status(200).json({
                result: 'true',
                msg: 'user data get successfully..',
                data:result
            })
        }  
    }catch(error){
        console.log(error.message);
    }
};

// get user operator list api
const User_Operator_List=async(req,res)=>{
    try{     
        const result = await User.find({'user_type':'operator'}); 
        if(!result || result.length==0){
            res.status(400).json({
                result: 'false',
                msg: 'record not found..'
            })
        }else{
            res.status(200).json({
                result: 'true',
                msg: 'user data get successfully..',
                data:result
            })
        }  
    }catch(error){
        console.log(error.message);
    }
};

//create approve status by admin api
 const Approve_Status =async(req,res)=>{
    const {_id} =req.body;
    try{
        if(_id){ 
            const result = await User.findById({_id:_id});
            if(!result || result.length==0){
                res.status(400).json({
                    result:'false',
                    msg:'_id does not exit..'
                });   
            }else{ 
                if(result.approve_status == '0'){
                    const approve_data = await User.findByIdAndUpdate({_id:_id},{$set:{'approve_status':'1'}},{new:true});
                    res.status(200).json({
                        result:'true',
                        msg:'operator approved successfully by Admin..',
                        data:{
                            _id:approve_data._id,
                            approve_status:approve_data.approve_status,
                        }
                    });
                }else{
                    const approve_data = await User.findByIdAndUpdate({_id:_id},{$set:{'approve_status':'0'}},{new:true});
                     res.status(200).json({
                        result:'true',
                        msg:'operator unapproved successfully by Admin..',
                        data:{
                            _id:approve_data._id,
                           approve_status:approve_data.approve_status,
                        }
                    });
                }
            }
        }else{
            res.status(400).json({
                result:'false',
                msg:'parameter required _id..'
            }); 
        }        
    }catch(error){
        console.log(error.message)
    }
};

// get pan card data
const GetPancardData = async (req, res) => {
    try {
        const pancardData = await PanCard.find({})
        if(!pancardData || pancardData.length==0){
            res.status(400).json({ 
                result: 'false',
                msg: 'record not found', 
            })
        }else{
            res.status(200).json({ 
               result: 'true',
               msg: 'pan card data get successfully', 
               data: pancardData 
            })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// update pan card data
const UpdatePancardData = async (req, res) => {
    try {
        const { user_id, name, father_name, phone_no, address, message, email, other_details1, other_details2, other_details3 } = req.body
        if (user_id) {
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

            const updatedData = await PanCard_Model.findOneAndUpdate({ user_id: user_id }, { name, father_name, phone_no, address, message, email, other_details1, other_details2, other_details3, aadhar_img: arrayImage[0], user_img: arrayImage[1], other_file1: arrayImage[2], other_file2: arrayImage[3], other_file3: arrayImage[4] }, { new: true })
            res.status(200).json({ result: "true", msg: 'pan card data updated successfully', data: updatedData })
        } else {
            res.status(400).json({
                result: "false",
                msg: 'user_id required  (optional parameter) name, father_name, mother_name, aadhar_linked_phon_no,disability_type, message, email,aadhar_img,user_img,father_or_mother_aadhar_img,disability_certificate,signature_img,other_file1,other_file2 ,other_file3,other_details1,other_details2,other_details3'
            });
        }
    } catch (error) {
        console.log(error.message)
    }
}

// delete pan card data
const DeletePanCardData = async (req, res) => {
    try {
        const { _id } = req.body;
        if (_id) {
            await PanCard.findByIdAndDelete({ _id: _id })
            res.status(200).json({ result: "true", msg: "pan card data deleted" })
        } else {
            res.status(400).json({ result: "false", msg: '_id required' })
        }
    } catch (error) {
        console.log(error.message)
    }
}



// get voterid data
const GetVoteridData = async (req, res) => {
    try {
        const voteridData = await VoterCard.find({});
        if(!voteridData || voteridData.length==0){
            res.status(400).json({ 
                result: 'false',
                msg: 'record not found', 
            })
        }else{
            res.status(200).json({ 
                result: 'true', 
                msg: 'voter card data get successfully', 
                data: voteridData 
            })
        }
    } catch (error) {
        console.log(error.message)
    }
}


// update voterid data
const UpdateVoteridData = async (req, res) => {
    try {
        const { user_id, name, father_name, mother_name, aadhar_linked_phon_no, message, other_details1, other_details2, other_details3 } = req.body
        if (user_id) {
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
            for (let o = 0; o < other_file3.length; o++) {
                arrayImage[o] = other_file3[o].filename;
            }

            const updatedData = await VoterCard.findOneAndUpdate({ user_id: user_id }, { name, father_name, mother_name, aadhar_linked_phon_no, message, other_details1, other_details2, other_details3, user_img: arrayImage[0], aadhar_img: arrayImage[1], family_voterid_img: arrayImage[2], signature_img: arrayImage[3], other_file1: arrayImage[4], other_file2: arrayImage[5], other_file3: arrayImage[6] }, { new: true })
            res.status(200).json({ result: "true", msg: 'voter id card data updated succesfully', data: updatedData })
        } else {
            res.status(400).json({ result: "false", msg: 'user_id required (optional parameter)  name, father_name, mother_name, aadhar_linked_phon_no, message,other_details1,other_details2,other_details3, aadhar_img,user_img,family_voterid_img,signature_img,other_file1,other_file2,other_file3' })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// delete voter id card data
const DeleteVoterIdCardData = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            await VoterCard.findByIdAndDelete({ _id: _id })
            res.status(200).json({ result: "true", msg: "voter id  data deleted" })
        } else {
            res.status(400).json({ result: "false", msg: '_id required' })
        }
    } catch (error) {
        console.log(error.message)
    }
}


// get labourcard data
const GetLabourCardData = async (req, res) => {
    try {
        const labourCardData = await LabourCard.find({});
        if(!labourCardData || labourCardData.length==0){
            res.status(400).json({ 
                result: 'false',
                msg: 'record not found', 
            })
        }else{
            res.status(200).json({ 
                result: 'true',
                msg: 'labour card data get successfully', 
                data: labourCardData 
            }) 
        }  
    } catch (error) {
        console.log(error.message)
    }
}

// update labourcard data
const UpdateLabourCardData = async (req, res) => {
    try {
        const { user_id, name, father_name, mother_name, aadhar_linked_phon_no, work_profile, message, other_details1, other_details2, other_details3 } = req.body
        if (user_id) {
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
            for (let k = 0; k < bank_passbook_or_cheque_img.length; k++) {
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

            const updatedData = await LabourCard.findOneAndUpdate({ user_id: user_id }, { name, father_name, mother_name, aadhar_linked_phon_no, work_profile, message, other_details1, other_details2, other_details3, user_img: arrayImage[0], aadhar_img: arrayImage[1], bank_passbook_or_cheque_img: arrayImage[2], nominee_aadhar_img: arrayImage[3], signature_img: arrayImage[4], other_file1: arrayImage[5], other_file2: arrayImage[6], other_file3: arrayImage[7] }, { new: true })
            res.status(200).json({ result: "true", msg: 'labour card data updated succesfully', data: updatedData })
        }else {
            res.status(400).json({
                result: "false",
                msg: 'user_id required (optional parameter) name, father_name, mother_name, aadhar_linked_phon_no, work_profile, message, aadhar_img,user_img,bank_passbook_or_cheque_img,nominee_aadhar_img,signature_img,other_file1,other_file2,other_file3,other_details1,other_details2,other_details3'
            });
        }
    } catch (error) {
        console.log(error.message)
    }
}


// delete labour  card data
const DeleteLabourCardData = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            await LabourCard.findByIdAndDelete({ _id: _id })
            res.status(200).json({ result: "true", msg: "labour card  data deleted" })
        } else {
            res.status(400).json({ result: "false", msg: '_id required' })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// get udid data
const GetUdidCardData = async (req, res) => {
    try {
        const udidCardData = await UdidCard.find({});
        if(!udidCardData || udidCardData.length==0){
            res.status(400).json({ 
                result: 'false',
                msg: 'record not found', 
            })
        }else{
            res.status(200).json({ 
                result: 'true',
                msg: 'uid card data get successfully',  
                data: udidCardData 
            })
        }    
    } catch (error) {
        console.log(error.message)
    }
}

// update udid card data
const UpdateUdidCardData = async (req, res) => {
    try {
        const { user_id, name, father_name, mother_name, aadhar_linked_phon_no, disability_type, message, other_details1, other_details2, other_details3 } = req.body
        if (user_id) {
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
            for (let k = 0; k < father_or_mother_aadhar_img.length; k++) {
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
            const updatedData = await UdidCard.findOneAndUpdate({ user_id: user_id }, { name, father_name, mother_name, aadhar_linked_phon_no, disability_type, message, other_details1, other_details2, other_details3, user_img: arrayImage[0], aadhar_img: arrayImage[1], father_or_mother_aadhar_img: arrayImage[2], signature_img: arrayImage[3], disability_certificate: arrayImage[4], other_file1: arrayImage[5], other_file2: arrayImage[6], other_file3: arrayImage[7] }, { new: true })
            res.status(200).json({ result: "true", msg: 'udid card data updated succesfully', updatedUdidCardData: updatedData })
        }else {
            res.status(400).json({
                result: "false",
                msg: 'user_id required (optional parameter) name, father_name, mother_name, aadhar_linked_phon_no, disability_type, message, aadhar_img,user_img,father_or_mother_aadhar_img,signature_img,disability_certificate,other_file1,other_file2,other_file3,other_details1,other_details2,other_details3'
            });
        }
    } catch (error) {
        console.log(error.message)
    }
}

// delete udid  card data
const DeleteUdidCardData = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            await UdidCard.findByIdAndDelete({ _id: _id })
            res.status(200).json({ result: "true", msg: "udid card data deleted" })
        } else {
            res.status(400).json({ result: "false", msg: '_id required' })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// get ayushman card data
const GetAyushmanCardData = async (req, res) => {
    try {
        const ayushmanCardData = await AyushmanCard.find()
        if (!ayushmanCardData || ayushmanCardData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "ayushman card data get successfull", data: ayushmanCardData })
        }

    } catch (error) {
        console.log(error.message)
    }
}

// update ayushman card data
const UpdateAyushmanCardData = async (req, res) => {
    try {
        const { user_id, name, aadhar_linked_phon_no, category_detail, message, other_details1, other_details2, other_details3 } = req.body
        if (user_id) {
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

            const updatedData = await AyushmanCard_Model.findOneAndUpdate({ user_id: user_id }, { name, aadhar_linked_phon_no, category_detail, message, other_details1, other_details2, other_details3, aadhar_img: arrayImage[0], user_img: arrayImage[1], other_file1: arrayImage[2], other_file2: arrayImage[3], other_file3: arrayImage[4] }, { new: true })
            res.status(200).json({ result: "true", msg: 'ayushman card data updated succesfully', data: updatedData })
        }
        else {
            res.status(400).json({
                result: "false",
                msg: 'user_id required (optional parameter) name, aadhar_linked_phon_no, category_detail, message, aadhar_img,user_img,other_file1,other_file2,other_file3,other_details1,other_details2,other_details3'
            });
        }
    } catch (error) {
        console.log(error.message)
    }
}


// delete ayuhman card data
const DeleteAyushmanCardData = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            await AyushmanCard.findByIdAndDelete({ _id: _id })
            res.status(200).json({ result: "true", msg: "ayushman card data deleted" })
        } else {
            res.status(400).json({ result: "false", msg: "_id required" })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// get eshram card data
const GetEshramCardData = async (req, res) => {
    try {
        const eshramCardData = await EshramCard.find()
        if (!eshramCardData || eshramCardData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "eshram card data get successfull", data: eshramCardData })
        }
    } catch (error) {
        console.log(error.message)
    }
}


// update ayushman card data
const UpdateEshramCardData = async (req, res) => {
    try {
        const { user_id, name, father_name, mother_name, aadhar_linked_phon_no, work_profile, message, other_details1, other_details2, other_details3 } = req.body
        if (user_id) {
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

            const updatedData = await EshramCard.findOneAndUpdate({ user_id: user_id }, { name, father_name, mother_name, aadhar_linked_phon_no, work_profile, message, other_details1, other_details2, other_details3, aadhar_img: arrayImage[0], bank_passbook_or_cheque_img: arrayImage[1], nominee_aadhar_img: arrayImage[2], other_file1: arrayImage[3], other_file2: arrayImage[4], other_file3: arrayImage[5] }, { new: true })
            res.status(200).json({ result: "true", msg: 'eshram card data updated succesfully', data: updatedData })
        }
        else {
            res.status(400).json({
                result: "false",
                msg: 'user_id required (optional parameter)  name, father_name, mother_name, aadhar_linked_phon_no, work_profile, message, aadhar_img,bank_passbook_or_cheque_img,nominee_aadhar_img,other_file1,other_file2,other_file3,other_details1,other_details2,other_details3'
            });
        }
    } catch (error) {
        console.log(error.message)
    }
}


// delete eshram card data
const DeleteEshramCardData = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            await EshramCard.findByIdAndDelete({ _id: _id })
            res.status(200).json({ result: "true", msg: "eshram card data deleted" })
        } else {
            res.status(400).json({ result: "false", msg: "_id required" })
        }

    } catch (error) {
        console.log(error.message)
    }
}


// create sub admin
const createSubAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email && password) {
            const data = await subAdminModel.findOne({ email: email })
            if (data) {
                res.status(400).json({ result: "false", msg: "operator allready exists" })
            } else {
                const subAdmin = new subAdminModel({ email, password })
                const subAdminData = await subAdmin.save()
                res.status(200).json({ result: "true", msg: 'operator created successfully', data: subAdminData })
            }
        } else {
            res.status(400).json({ result: "false", msg: "email and password required" })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// get sub admins
const getSubAdmins = async (req, res) => {
    try {
        const subAdmins = await subAdminModel.find()
        if (!subAdmins || subAdmins.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "sub admin data get success", data: subAdmins })
        }


    } catch (error) {
        console.log(error.message)
    }
}

// update sub admin details
const updateSubAdmin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (email) {
            const getSubAdmin = await subAdminModel.findOne({ email: email })
            if (getSubAdmin) {
                const data = await subAdminModel.findOneAndUpdate({ email: email }, { email: email, password: password }, { new: true })
                res.status(200).json({ result: "true", msg: "operator update successfull", data: data })
            } else {
                res.status(400).json({ result: "false", msg: "record not found" })
            }

        } else {
            res.status(400).json({ result: "false", msg: "email required " })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// delete sub admin 
const deleteSubAdmin = async (req, res) => {
    try {
        const { email } = req.body
        if (email) {
            const subAdmin = await subAdminModel.findOne({ email: email })
            if (subAdmin) {
                await subAdminModel.findOneAndDelete({ email: email })
                res.status(200).json({ result: "true", msg: "sub admin deleted" })
            } else {
                res.status(400).json({ result: "false", msg: "record not found" })
            }
        } else {
            res.status(400).json({ result: "false", msg: "email required" })
        }
    } catch (error) {
        console.log(error.message)
    }
}

//get accessable data
const givAccess = async (req, res) => {
    try {
        const { email, access } = req.body
        var data = {}
        if (email && access) {
            const subAdmin = await subAdminModel.findOne({ email: email })
            if (!subAdmin || subAdmin.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                const data = await subAdminModel.findOneAndUpdate({ email: email }, { access: access }, {
                    new
                        : true
                })
                res.status(200).json({ result: "true", msg: "access give successfull" })
            }
        } else {
            res.status(400).json({ result: "false", msg: " parameter required email & access" })
        }

    } catch (error) {
        console.log(error.message)
    }
}

// send message controller 
const sendMessage = async (req, res) => {
    try {
        const { admin_id, sub_admin_id, message } = req.body
        if (admin_id && sub_admin_id && message) {
            const chats = new chatModel({ admin_id, sub_admin_id, message })
            const data = await chats.save()
            res.status(200).json({ result: "true", msg: "message send success", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "parameter require admin_id, sub_admin_id, message" })
        }
    } catch (error) {
        console.log(error.message)
    }
}


// get messages controller
const getMessage = async (req, res) => {
    try {
        const messages = await chatModel.find()
        if (!messages || messages.length == 0) {
            res.status(400), json({ result: "false", msg: "record not found" })
        } else {
            const arr = messages.map((items, index) => {
                return items.message
            })
            console.log(arr)
            res.status(200).json({ result: "true", msg: "messages get success", data: messages })
        }
    } catch (error) {

    }
}

// add service
const addService = async (req, res) => {
    try {
        const { service } = req.body
        if (service && req.file) {
            const serviceData = new serviceModel({ image: req.file.filename, service: service })
            const data = await serviceData.save()
            res.status(200).json({ result: "true", msg: "service add successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "parameter require image & service" })
        }
    } catch (error) {
        console.log(error.message)
    }
}


// get question
const getQuestion = async (req, res) => {
    try {
        const data = await questionModel.find()
        if (!data || data.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        }
        else {
            res.status(200).json({ result: "true", msg: "question data get succes", data: data })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// get contact data
const getContact = async (req, res) => {
    try {
        const data = await contactModel.find()
        if (!data || data.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "contact data get successfull", data: data })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// get single pancard data
const getSinglePancardData = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const pancardData = await PanCard_Model.findById({ _id: _id })
            if (!pancardData || pancardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "pancard data get success", data: pancardData })
            }
        } else {
            res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
    } catch (error) {
        console.log(error.message)
    }
}
// get single ayushman card data
const getSingleAyushmanCardData = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const ayushmanCardData = await AyushmanCard_Model.findById({ _id: _id })
            if (!ayushmanCardData || ayushmanCardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "ayushman card data get success", data: ayushmanCardData })
            }
        } else {
            res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// get single voter card data
const getSingleVoterCardData = async (req, res) => {
    try {
        const { _id } = req.body;
        if (_id) {
            const voterCardData = await VoterID_Model.findById({ _id: _id })
            if (!voterCardData || voterCardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "voter card data get success", data: voterCardData })
            }
        } else {
            res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
    } catch (error) {

    }
}


// get single labour card data
const getSingleLabourCardData = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const labourCardData = await LabourCard_Model.findById({ _id: _id })
            if (!labourCardData || labourCardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "labour card data get success", data: labourCardData })
            }
        } else {
            res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// get single eshram card data
const getSingleEshramCardData = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const eshramCardData = await EshramCard_Model.findById({ _id: _id })
            if (!eshramCardData || eshramCardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "eshram card data get success", data: eshramCardData })
            }
        } else {
            res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// get single udid card data
const getSingleUdidCardData = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const udidCardData = await UdidCard_Model.findById({ _id: _id })
            if (!udidCardData || udidCardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "udid card data get success", data: udidCardData })
            }
        } else {
            res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
    } catch (error) {
        console.log(error.message)
    }
}


// send answer
const sendAnswer = async (req, res) => {
    try {
        const { _id, answer } = req.body
        if (_id && answer) {
            const answerData = await questionModel.findByIdAndUpdate({ id: id }, { answer: answer }, { new: true })
            res.status(200).json({ result: "true", message: "answer send successfull", data: answerData })
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id & answer" })
        }
    } catch (error) {
        console.log(error.message)
    }
}

// get  single   user
const getSingleUser = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const data = await User.findById({ _id: _id })
        if (!data) {
            return res.status(200).json({ result: "false", msg: "record not found" })
        }
        return res.status(200).json({ result: "true", msg: "data get success", data: data })
    } catch (error) {
        console.log(error.message)
    }
}

// get all income certificate data
const allIncomeCertificate = async (req, res) => {
    try {
        const incomeCertificateData = await incomeCertificateModel.find()
        if (!incomeCertificateData || incomeCertificateData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "income certificate  data get successfull", data: incomeCertificateData })
        }

    } catch (error) {
        console.log(error.message)
    }
}


// get all domicile certificate data
const allDomicileCertificate = async (req, res) => {
    try {
        const domicileCertificateData = await domicileCertificateModel.find()
        if (!domicileCertificateData || domicileCertificateData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "domicile certificate  data get successfull", data: domicileCertificateData })
        }

    } catch (error) {
        console.log(error.message)
    }
}


// get all cast certificate data
const allCastCertificate = async (req, res) => {
    try {
        const castCertificateData = await castCertificateModel.find()
        if (!castCertificateData || castCertificateData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "cast certificate  data get successfull", data: castCertificateData })
        }

    } catch (error) {
        console.log(error.message)
    }
}


// get all pf withdrawal  data
const allPfWithdrawal = async (req, res) => {
    try {
        const pfWithdrawalData = await pfWithdrawalModel.find()
        if (!pfWithdrawalData || pfWithdrawalData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "pf withdrawal   data get successfull", data: pfWithdrawalData })
        }

    } catch (error) {
        console.log(error.message)
    }
}


// get all pf kyc  data
const allPfKyc = async (req, res) => {
    try {
        const pfKycData = await pfKycModel.find()
        if (!pfKycData || pfKycData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "pf kyc data get successfull", data: pfKycData })
        }

    } catch (error) {
        console.log(error.message)
    }
}


// get all pf nomination  data
const allPfNomination = async (req, res) => {
    try {
        const pfNominationData = await pfNominationModel.find()
        if (!pfNominationData || pfNominationData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "pf nomination data get successfull", data: pfNominationData })
        }

    } catch (error) {
        console.log(error.message)
    }
}


// get all pf mid transfer  data
const allPfMidTransfer = async (req, res) => {
    try {
        const pfMidTransferData = await pfMidTransferModel.find()
        if (!pfMidTransferData || pfMidTransferData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "pf mid transfer data get successfull", data: pfMidTransferData })
        }

    } catch (error) {
        console.log(error.message)
    }
}


// get all police verification  data
const allPoliceVerification = async (req, res) => {
    try {
        const policeVerificationData = await policeVerificationModel.find()
        if (!policeVerificationData || policeVerificationData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "police verification data get successfull", data: policeVerificationData })
        }

    } catch (error) {
        console.log(error.message)
    }
}



// get all fir data
const allFir = async (req, res) => {
    try {
        const firData = await firModel.find()
        if (!firData || firData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "fir data get successfull", data: firData })
        }

    } catch (error) {
        console.log(error.message)
    }
}



// get all lost report data
const allLostReport = async (req, res) => {
    try {
        const lostReportData = await lostReportModel.find()
        if (!lostReportData || lostReportData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "lost report data get successfull", data: lostReportData })
        }

    } catch (error) {
        console.log(error.message)
    }
}



// get all aadhar address data
const allAadharAdress = async (req, res) => {
    try {
        const aadharAddressData = await aadharAddressModel.find()
        if (!aadharAddressData || aadharAddressData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "aadhar address  data get successfull", data: aadharAddressData })
        }

    } catch (error) {
        console.log(error.message)
    }
}



// get all ayushman address data
const allAyushmanAdress = async (req, res) => {
    try {
        const ayushmanAddressData = await ayushmanAddressModel.find()
        if (!ayushmanAddressData || ayushmanAddressData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "ayushman address  data get successfull", data: ayushmanAddressData })
        }

    } catch (error) {
        console.log(error.message)
    }
}


// get all up ration card  data
const allUpRationCard = async (req, res) => {
    try {
        const upRationCardData = await upRationCardModel.find()
        if (!upRationCardData || upRationCardData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "up ration card data get successfull", data: upRationCardData })
        }

    } catch (error) {
        console.log(error.message)
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

        res.status(200).json({ result: "true", msg: "up ration card address data get success", data: upRationCardData })
    } catch (error) {
        console.log(error.message)
    }
}

// get all pancard correction  data
const allPancardCorrection = async (req, res) => {
    try {
        const pancardCorrectionData = await pancardCorrectionModel.find()
        if (!pancardCorrectionData || pancardCorrectionData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "pancard correction data get successfull", data: pancardCorrectionData })
        }

    } catch (error) {
        console.log(error.message)
    }
}




// get all other form  data
const allOtherForm = async (req, res) => {
    try {
        const otherFormData = await otherFormModel.find()
        if (!otherFormData || otherFormData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "other form data get successfull", data: otherFormData })
        }

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


// delete income certificate data
const deleteIncomeCertificate = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await incomeCertificateModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "income certificate data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete income certificate data
const deleteDomicileCertificate = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await domicileCertificateModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "domicile certificate data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete cast certificate data
const deleteCastCertificate = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await castCertificateModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "cast certificate data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete pf withdrawal data
const deletePfWithdrawal = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await pfWithdrawalModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "pf withdrawal data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete pf kyc data
const deletePfKyc = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await pfKycModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "pf kyc data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete pf nomination data
const deletePfNomination = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await pfNominationModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "pf nomination data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete pf mid transfer data
const deletePfMidTransfer = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await pfMidTransferModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "pf mid transfer data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete police verification data
const deletePoliceVerification = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await policeVerificationModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "police verification data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete fir data
const deleteFir = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await firModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "fir data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete lost report data
const deleteLostReport = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await lostReportModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "lost report data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete aadhar address data
const deleteAadharAddress = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await aadharAddressModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "aadhar address data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete ayushman address data
const deleteAyushmanAddress = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await ayushmanAddressModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "ayushman address data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete up ration card data
const deleteUpRationCard = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await upRationCardModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "up ration card data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete panard correction  data
const deletePancardCorrection = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await pancardCorrectionModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "pancard correction data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete other form  data
const deleteOtherForm = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await otherFormModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "other form data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

//  update income certificate
const updateIncomeCertificate = async (req, res) => {
    try {


        const { _id, name, phone_no, father_name, mother_name, message, other_details1, other_details2, other_details3 } = req.body
        if (_id) {
            const getData = await incomeCertificateModel.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (name) {
                    updateFields.name = name
                }
                if (phone_no) {
                    updateFields.phone_no = phone_no
                }
                if (father_name) {
                    updateFields.father_name = father_name
                }
                if (mother_name) {
                    updateFields.mother_name = mother_name
                }
                if (message) {
                    updateFields.message = message
                }
                if (other_details1) {
                    updateFields.other_details1 = other_details1
                }
                if (other_details2) {
                    updateFields.other_details2 = other_details2
                }
                if (other_details3) {
                    updateFields.other_details3 = other_details3
                }

                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'user_img':
                                updateFields.user_img = file.filename;
                                break;
                            case 'aadhar_img':
                                updateFields.aadhar_img = file.filename;
                                break;
                            case 'sabhasad_or_parshad_letterhead_img':
                                updateFields.sabhasad_or_parshad_letterhead_img = file.filename;
                                break;
                            case 'svapramanit_ghoshnapatra_or_signature_img':
                                updateFields.svapramanit_ghoshnapatra_or_signature_img = file.filename;
                                break;
                            case 'other_file1':
                                updateFields.other_file1 = file.filename;
                                break;
                            case 'other_file2':
                                updateFields.other_file2 = file.filename;
                                break;
                            case 'other_file3':
                                updateFields.other_file3 = file.filename;
                                break;
                            default:
                                break;
                        }
                    }
                }
                const data = await incomeCertificateModel.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "income certificate data succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter) name, phone_no, father_name, mother_name, message, other_details1, other_details2, other_details3,user_img,aadhar_image,sabhasad_or_parshad_letterhead_img,svapramanit_ghoshnapatra_or_signature_img,other_file1,other_file2,other_file3" })
        }
    } catch (error) {
        console.log(error)
    }


}



//  update domicile certificate
const updateDomicileCertificate = async (req, res) => {
    try {


        const { _id, name, phone_no, father_name, mother_name, message, other_details1, other_details2, other_details3 } = req.body
        if (_id) {
            const getData = await domicileCertificateModel.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (name) {
                    updateFields.name = name
                }
                if (phone_no) {
                    updateFields.phone_no = phone_no
                }
                if (father_name) {
                    updateFields.father_name = father_name
                }
                if (mother_name) {
                    updateFields.mother_name = mother_name
                }
                if (message) {
                    updateFields.message = message
                }
                if (other_details1) {
                    updateFields.other_details1 = other_details1
                }
                if (other_details2) {
                    updateFields.other_details2 = other_details2
                }
                if (other_details3) {
                    updateFields.other_details3 = other_details3
                }

                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'user_img':
                                updateFields.user_img = file.filename;
                                break;
                            case 'aadhar_img':
                                updateFields.aadhar_img = file.filename;
                                break;
                            case 'sabhasad_or_parshad_letterhead_img':
                                updateFields.sabhasad_or_parshad_letterhead_img = file.filename;
                                break;
                            case 'svapramanit_ghoshnapatra_or_signature_img':
                                updateFields.svapramanit_ghoshnapatra_or_signature_img = file.filename;
                                break;
                            case 'other_file1':
                                updateFields.other_file1 = file.filename;
                                break;
                            case 'other_file2':
                                updateFields.other_file2 = file.filename;
                                break;
                            case 'other_file3':
                                updateFields.other_file3 = file.filename;
                                break;
                            default:
                                break;
                        }
                    }
                }
                const data = await domicileCertificateModel.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "domicile certificate data succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter) name, phone_no, father_name, mother_name, message, other_details1, other_details2, other_details3,user_img,aadhar_image,sabhasad_or_parshad_letterhead_img,svapramanit_ghoshnapatra_or_signature_img,other_file1,other_file2,other_file3" })
        }
    } catch (error) {
        console.log(error)
    }


}


//  update cast certificate
const updateCastCertificate = async (req, res) => {
    try {


        const { _id, name, phone_no, father_name, mother_name, message, other_details1, other_details2, other_details3 } = req.body
        if (_id) {
            const getData = await castCertificateModel.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (name) {
                    updateFields.name = name
                }
                if (phone_no) {
                    updateFields.phone_no = phone_no
                }
                if (father_name) {
                    updateFields.father_name = father_name
                }
                if (mother_name) {
                    updateFields.mother_name = mother_name
                }
                if (message) {
                    updateFields.message = message
                }
                if (other_details1) {
                    updateFields.other_details1 = other_details1
                }
                if (other_details2) {
                    updateFields.other_details2 = other_details2
                }
                if (other_details3) {
                    updateFields.other_details3 = other_details3
                }

                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'user_img':
                                updateFields.user_img = file.filename;
                                break;
                            case 'aadhar_img':
                                updateFields.aadhar_img = file.filename;
                                break;
                            case 'sabhasad_or_parshad_letterhead_img':
                                updateFields.sabhasad_or_parshad_letterhead_img = file.filename;
                                break;

                            case 'svapramanit_ghoshnapatra_or_signature_img':
                                updateFields.svapramanit_ghoshnapatra_or_signature_img = file.filename;
                                break;
                            case 'jati_praman_patra_img':
                                updateFields.jati_praman_patra_img = file.filename;
                                break;
                            case 'other_file1':
                                updateFields.other_file1 = file.filename;
                                break;
                            case 'other_file2':
                                updateFields.other_file2 = file.filename;
                                break;
                            case 'other_file3':
                                updateFields.other_file3 = file.filename;
                                break;
                            default:
                                break;
                        }
                    }
                }
                const data = await castCertificateModel.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "cast certificate data succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter) name, phone_no, father_name, mother_name, message, other_details1, other_details2, other_details3,user_img,aadhar_image,sabhasad_or_parshad_letterhead_img,svapramanit_ghoshnapatra_or_signature_img,jati_praman_patra_img,other_file1,other_file2,other_file3" })
        }
    } catch (error) {
        console.log(error)
    }


}

//  update pf withdrawal
const updatePfWithdrawal = async (req, res) => {
    try {


        const { _id, uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3 } = req.body
        if (_id) {
            const getData = await pfWithdrawalModel.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (uan_number) {
                    updateFields.uan_number = uan_number
                }
                if (password) {
                    updateFields.password = password
                }
                if (phone_no) {
                    updateFields.phone_no = phone_no
                }
                if (withdraw_amount) {
                    updateFields.withdraw_amount = withdraw_amount
                }
                if (message) {
                    updateFields.message = message
                }
                if (other_details1) {
                    updateFields.other_details1 = other_details1
                }
                if (other_details2) {
                    updateFields.other_details2 = other_details2
                }
                if (other_details3) {
                    updateFields.other_details3 = other_details3
                }

                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'aadhar_img':
                                updateFields.aadhar_img = file.filename;
                                break;
                            case 'bank_passbook_or_cheque_img':
                                updateFields.bank_passbook_or_cheque_img = file.filename;
                                break;
                            case 'pancard_img':
                                updateFields.pancard_img = file.filename;
                                break;

                            case 'other_file1':
                                updateFields.other_file1 = file.filename;
                                break;
                            case 'other_file2':
                                updateFields.other_file2 = file.filename;
                                break;
                            case 'other_file3':
                                updateFields.other_file3 = file.filename;
                                break;
                            default:
                                break;
                        }
                    }
                }
                const data = await pfWithdrawalModel.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "pf withdrawal data succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter)  uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3,aadhar_image,bank_passbook_or_cheque_img,pancard_img,other_file1,other_file2,other_file3" })
        }
    } catch (error) {
        console.log(error)
    }


}

//  update pf kyc
const updatePfKyc = async (req, res) => {
    try {


        const { _id, uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3 } = req.body
        if (_id) {
            const getData = await pfKycModel.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (uan_number) {
                    updateFields.uan_number = uan_number
                }
                if (password) {
                    updateFields.password = password
                }
                if (phone_no) {
                    updateFields.phone_no = phone_no
                }
                if (withdraw_amount) {
                    updateFields.withdraw_amount = withdraw_amount
                }
                if (message) {
                    updateFields.message = message
                }
                if (other_details1) {
                    updateFields.other_details1 = other_details1
                }
                if (other_details2) {
                    updateFields.other_details2 = other_details2
                }
                if (other_details3) {
                    updateFields.other_details3 = other_details3
                }

                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'aadhar_img':
                                updateFields.aadhar_img = file.filename;
                                break;
                            case 'bank_passbook_or_cheque_img':
                                updateFields.bank_passbook_or_cheque_img = file.filename;
                                break;
                            case 'pancard_img':
                                updateFields.pancard_img = file.filename;
                                break;

                            case 'other_file1':
                                updateFields.other_file1 = file.filename;
                                break;
                            case 'other_file2':
                                updateFields.other_file2 = file.filename;
                                break;
                            case 'other_file3':
                                updateFields.other_file3 = file.filename;
                                break;
                            default:
                                break;
                        }
                    }
                }
                const data = await pfKycModel.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "pf kyc data succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter)uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3 ,aadhar_image,bank_passbook_or_cheque_img,pancard_img,other_file1,other_file2,other_file3" })
        }
    } catch (error) {
        console.log(error)
    }


}

//  update pf nomination
const updatePfNomination = async (req, res) => {
    try {


        const { _id, uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3 } = req.body
        if (_id) {
            const getData = await pfNominationModel.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (uan_number) {
                    updateFields.uan_number = uan_number
                }
                if (password) {
                    updateFields.password = password
                }
                if (phone_no) {
                    updateFields.phone_no = phone_no
                }
                if (withdraw_amount) {
                    updateFields.withdraw_amount = withdraw_amount
                }
                if (message) {
                    updateFields.message = message
                }
                if (other_details1) {
                    updateFields.other_details1 = other_details1
                }
                if (other_details2) {
                    updateFields.other_details2 = other_details2
                }
                if (other_details3) {
                    updateFields.other_details3 = other_details3
                }

                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'aadhar_img':
                                updateFields.aadhar_img = file.filename;
                                break;
                            case 'bank_passbook_or_cheque_img':
                                updateFields.bank_passbook_or_cheque_img = file.filename;
                                break;
                            case 'pancard_img':
                                updateFields.pancard_img = file.filename;
                                break;
                            case 'nominee_aadhar_img':
                                updateFields.nominee_aadhar_img = file.filename;
                                break;

                            case 'other_file1':
                                updateFields.other_file1 = file.filename;
                                break;
                            case 'other_file2':
                                updateFields.other_file2 = file.filename;
                                break;
                            case 'other_file3':
                                updateFields.other_file3 = file.filename;
                                break;
                            default:
                                break;
                        }
                    }
                }
                const data = await pfNominationModel.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "pf nomination data succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter)  uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3 ,aadhar_image,bank_passbook_or_cheque_img,pancard_img,nominee_aadhar_img,other_file1,other_file2,other_file3" })
        }
    } catch (error) {
        console.log(error)
    }


}

//  update pf Mid Transfer
const updatePfMidTransfer = async (req, res) => {
    try {


        const { _id, uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3 } = req.body
        if (_id) {
            const getData = await pfMidTransferModel.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (uan_number) {
                    updateFields.uan_number = uan_number
                }
                if (password) {
                    updateFields.password = password
                }
                if (phone_no) {
                    updateFields.phone_no = phone_no
                }
                if (withdraw_amount) {
                    updateFields.withdraw_amount = withdraw_amount
                }
                if (message) {
                    updateFields.message = message
                }
                if (other_details1) {
                    updateFields.other_details1 = other_details1
                }
                if (other_details2) {
                    updateFields.other_details2 = other_details2
                }
                if (other_details3) {
                    updateFields.other_details3 = other_details3
                }

                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'aadhar_img':
                                updateFields.aadhar_img = file.filename;
                                break;
                            case 'bank_passbook_or_cheque_img':
                                updateFields.bank_passbook_or_cheque_img = file.filename;
                                break;
                            case 'pancard_img':
                                updateFields.pancard_img = file.filename;
                                break;
                            case 'other_file1':
                                updateFields.other_file1 = file.filename;
                                break;
                            case 'other_file2':
                                updateFields.other_file2 = file.filename;
                                break;
                            case 'other_file3':
                                updateFields.other_file3 = file.filename;
                                break;
                            default:
                                break;
                        }
                    }
                }
                const data = await pfMidTransferModel.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "pf mid transfer data succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter)  uan_number, password, phone_no, withdraw_amount, message, other_details1, other_details2, other_details3 ,aadhar_image,bank_passbook_or_cheque_img,pancard_img,other_file1,other_file2,other_file3" })
        }
    } catch (error) {
        console.log(error)
    }


}

//  update police verification
const updatePoliceVerification = async (req, res) => {
    try {


        const { _id, name, phone_no, father_name, email, message, other_details1, other_details2, other_details3 } = req.body
        if (_id) {
            const getData = await policeVerificationModel.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (name) {
                    updateFields.name = name
                }
                if (phone_no) {
                    updateFields.phone_no = phone_no
                }
                if (father_name) {
                    updateFields.father_name = father_name
                }
                if (email) {
                    updateFields.email = email
                }
                if (message) {
                    updateFields.message = message
                }
                if (other_details1) {
                    updateFields.other_details1 = other_details1
                }
                if (other_details2) {
                    updateFields.other_details2 = other_details2
                }
                if (other_details3) {
                    updateFields.other_details3 = other_details3
                }

                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'user_img':
                                updateFields.user_img = file.filename;
                                break;
                            case 'aadhar_img':
                                updateFields.aadhar_img = file.filename;
                                break;

                            case 'other_file1':
                                updateFields.other_file1 = file.filename;
                                break;
                            case 'other_file2':
                                updateFields.other_file2 = file.filename;
                                break;
                            case 'other_file3':
                                updateFields.other_file3 = file.filename;
                                break;
                            default:
                                break;
                        }
                    }
                }
                const data = await policeVerificationModel.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "police verification data succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter)  name, phone_no, father_name, email, message, other_details1, other_details2, other_details3 ,aadhar_image,user_img,other_file1,other_file2,other_file3" })
        }
    } catch (error) {
        console.log(error)
    }


}

//  update fir 
const updateFir = async (req, res) => {
    try {


        const { _id, name, phone_no, father_name, email, message, other_details1, other_details2, other_details3 } = req.body
        if (_id) {
            const getData = await firModel.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (name) {
                    updateFields.name = name
                }
                if (phone_no) {
                    updateFields.phone_no = phone_no
                }
                if (father_name) {
                    updateFields.father_name = father_name
                }
                if (email) {
                    updateFields.email = email
                }
                if (message) {
                    updateFields.message = message
                }
                if (other_details1) {
                    updateFields.other_details1 = other_details1
                }
                if (other_details2) {
                    updateFields.other_details2 = other_details2
                }
                if (other_details3) {
                    updateFields.other_details3 = other_details3
                }

                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'user_img':
                                updateFields.user_img = file.filename;
                                break;
                            case 'aadhar_img':
                                updateFields.aadhar_img = file.filename;
                                break;
                            case 'fir_content_img':
                                updateFields.fir_content_img = file.filename;
                                break;

                            case 'other_file1':
                                updateFields.other_file1 = file.filename;
                                break;
                            case 'other_file2':
                                updateFields.other_file2 = file.filename;
                                break;
                            case 'other_file3':
                                updateFields.other_file3 = file.filename;
                                break;
                            default:
                                break;
                        }
                    }
                }
                const data = await firModel.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "fir data succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter)  name, phone_no, father_name, email, message, other_details1, other_details2, other_details3 ,aadhar_image,user_img,fir_content_img,other_file1,other_file2,other_file3" })
        }
    } catch (error) {
        console.log(error)
    }


}


//  update lost report 
const updateLostReport = async (req, res) => {
    try {


        const { _id, name, phone_no, father_name, email, message, other_details1, other_details2, other_details3 } = req.body
        if (_id) {
            const getData = await lostReportModel.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (name) {
                    updateFields.name = name
                }
                if (phone_no) {
                    updateFields.phone_no = phone_no
                }
                if (father_name) {
                    updateFields.father_name = father_name
                }
                if (email) {
                    updateFields.email = email
                }
                if (message) {
                    updateFields.message = message
                }
                if (other_details1) {
                    updateFields.other_details1 = other_details1
                }
                if (other_details2) {
                    updateFields.other_details2 = other_details2
                }
                if (other_details3) {
                    updateFields.other_details3 = other_details3
                }

                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'user_img':
                                updateFields.user_img = file.filename;
                                break;
                            case 'aadhar_img':
                                updateFields.aadhar_img = file.filename;
                                break;
                            case 'fir_content_img':
                                updateFields.fir_content_img = file.filename;
                                break;

                            case 'other_file1':
                                updateFields.other_file1 = file.filename;
                                break;
                            case 'other_file2':
                                updateFields.other_file2 = file.filename;
                                break;
                            case 'other_file3':
                                updateFields.other_file3 = file.filename;
                                break;
                            default:
                                break;
                        }
                    }
                }
                const data = await lostReportModel.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "lost report data succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter)  name, phone_no, father_name, email, message, other_details1, other_details2, other_details3 ,aadhar_image,user_img,fir_content_img,other_file1,other_file2,other_file3" })
        }
    } catch (error) {
        console.log(error)
    }


}


//  update  aadhar address 
const updateAadharAddress = async (req, res) => {
    try {


        const { _id, aadhar_number, aadhar_linked_phone_no, message, other_details1, other_details2, other_details3 } = req.body
        if (_id) {
            const getData = await aadharAddressModel.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (aadhar_number) {
                    updateFields.aadhar_number = aadhar_number
                }
                if (aadhar_linked_phone_no) {
                    updateFields.aadhar_linked_phone_no = aadhar_linked_phone_no
                }
                if (message) {
                    updateFields.message = message
                }
                if (other_details1) {
                    updateFields.other_details1 = other_details1
                }
                if (other_details2) {
                    updateFields.other_details2 = other_details2
                }
                if (other_details3) {
                    updateFields.other_details3 = other_details3
                }

                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'address_proof_img':
                                updateFields.address_proof_img = file.filename;
                                break;

                            case 'other_file1':
                                updateFields.other_file1 = file.filename;
                                break;
                            case 'other_file2':
                                updateFields.other_file2 = file.filename;
                                break;
                            case 'other_file3':
                                updateFields.other_file3 = file.filename;
                                break;
                            default:
                                break;
                        }
                    }
                }
                const data = await aadharAddressModel.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "aadhar address data succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter)  aadhar_number, aadhar_linked_phone_no, message, other_details1, other_details2, other_details3,address_proof_img,other_file1,other_file2,other_file3" })
        }
    } catch (error) {
        console.log(error)
    }


}


//  update  ayushman address 
const updateAyushmanrAddress = async (req, res) => {
    try {


        const { _id, aadhar_number, aadhar_linked_phone_no, message, other_details1, other_details2, other_details3 } = req.body
        if (_id) {
            const getData = await ayushmanAddressModel.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (aadhar_number) {
                    updateFields.aadhar_number = aadhar_number
                }
                if (aadhar_linked_phone_no) {
                    updateFields.aadhar_linked_phone_no = aadhar_linked_phone_no
                }
                if (message) {
                    updateFields.message = message
                }
                if (other_details1) {
                    updateFields.other_details1 = other_details1
                }
                if (other_details2) {
                    updateFields.other_details2 = other_details2
                }
                if (other_details3) {
                    updateFields.other_details3 = other_details3
                }

                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'user_img':
                                updateFields.user_img = file.filename;
                                break;
                            case 'aadhar_img':
                                updateFields.aadhar_img = file.filename;
                                break;

                            case 'other_file1':
                                updateFields.other_file1 = file.filename;
                                break;
                            case 'other_file2':
                                updateFields.other_file2 = file.filename;
                                break;
                            case 'other_file3':
                                updateFields.other_file3 = file.filename;
                                break;
                            default:
                                break;
                        }
                    }
                }
                const data = await ayushmanAddressModel.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "ayushman address data succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter)  aadhar_number, aadhar_linked_phone_no, message, other_details1, other_details2, other_details3,user_img,aadhar_img,other_file1,other_file2,other_file3" })
        }
    } catch (error) {
        console.log(error)
    }


}


//  update  up ration card 
const updateUpRationCard = async (req, res) => {
    try {


        const { _id, phone_no, father_name, mother_name, husband_name, rashan_cotedar_name, bijli_bil_no, gas_connection_no, message, other_details1, other_details2, other_details3 } = req.body
        if (_id) {
            const getData = await upRationCardModel.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (phone_no) {
                    updateFields.phone_no = phone_no
                }
                if (father_name) {
                    updateFields.father_name = father_name
                }
                if (mother_name) {
                    updateFields.mother_name = mother_name
                }
                if (husband_name) {
                    updateFields.husband_name = husband_name
                }
                if (rashan_cotedar_name) {
                    updateFields.rashan_cotedar_name = rashan_cotedar_name
                }
                if (bijli_bil_no) {
                    updateFields.bijli_bil_no = bijli_bil_no
                }
                if (gas_connection_no) {
                    updateFields.gas_connection_no = gas_connection_no
                }
                if (message) {
                    updateFields.message = message
                }
                if (other_details1) {
                    updateFields.other_details1 = other_details1
                }
                if (other_details2) {
                    updateFields.other_details2 = other_details2
                }
                if (other_details3) {
                    updateFields.other_details3 = other_details3
                }

                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'user_img':
                                updateFields.user_img = file.filename;
                                break;
                            case 'aadhar_img':
                                updateFields.aadhar_img = file.filename;
                                break;
                            case 'bank_passbook_img':
                                updateFields.bank_passbook_img = file.filename;
                                break;
                            case 'family_aadhar_img':
                                updateFields.family_aadhar_img = file.filename;
                                break;

                            case 'other_file1':
                                updateFields.other_file1 = file.filename;
                                break;
                            case 'other_file2':
                                updateFields.other_file2 = file.filename;
                                break;
                            case 'other_file3':
                                updateFields.other_file3 = file.filename;
                                break;
                            default:
                                break;
                        }
                    }
                }
                const data = await upRationCardModel.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "up rationcard  data succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter)  phone_no, father_name, mother_name, husband_name, rashan_cotedar_name, bijli_bil_no, gas_connection_no, message, other_details1, other_details2, other_details3,user_img,aadhar_img,bank_passbook_img,family_aadhar_img,other_file1,other_file2,other_file3" })
        }
    } catch (error) {
        console.log(error)
    }


}


//  update  pancard correction
const updatePancardCorrection = async (req, res) => {
    try {


        const { _id, name, father_name, phone_no, address, message, email, other_details1, other_details2, other_details3 } = req.body
        if (_id) {
            const getData = await pancardCorrectionModel.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (name) {
                    updateFields.name = name
                }
                if (father_name) {
                    updateFields.father_name = father_name
                }
                if (phone_no) {
                    updateFields.phone_no = phone_no
                }
                if (address) {
                    updateFields.address = address
                }
                if (message) {
                    updateFields.message = message
                }
                if (email) {
                    updateFields.email = email
                }
                if (other_details1) {
                    updateFields.other_details1 = other_details1
                }
                if (other_details2) {
                    updateFields.other_details2 = other_details2
                }
                if (other_details3) {
                    updateFields.other_details3 = other_details3
                }

                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'user_img':
                                updateFields.user_img = file.filename;
                                break;
                            case 'aadhar_img':
                                updateFields.aadhar_img = file.filename;
                                break;
                            case 'signature_img':
                                updateFields.signature_img = file.filename;
                                break;
                            case 'correction_proof_img':
                                updateFields.correction_proof_img = file.filename;
                                break;

                            case 'other_file1':
                                updateFields.other_file1 = file.filename;
                                break;
                            case 'other_file2':
                                updateFields.other_file2 = file.filename;
                                break;
                            case 'other_file3':
                                updateFields.other_file3 = file.filename;
                                break;
                            default:
                                break;
                        }
                    }
                }
                const data = await pancardCorrectionModel.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "pancard correction data succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter)  name, father_name, phone_no, address, message, email, other_details1, other_details2, other_details3,user_img,aadhar_img,signature_img,correction_proof_img,other_file1,other_file2,other_file3" })
        }
    } catch (error) {
        console.log(error)
    }


}


//  update  other form 
const updateOtherForm = async (req, res) => {
    try {


        const { _id, category, name, phone_no, email, message, other_details1, other_details2, other_details3 } = req.body
        if (_id) {
            const getData = await otherFormModel.findById({ _id: _id })
            if (!getData || getData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })

            } else {

                const updateFields = {};
                if (category) {
                    updateFields.category = category
                }
                if (name) {
                    updateFields.name = name
                }
                if (phone_no) {
                    updateFields.phone_no = phone_no
                }
                if (email) {
                    updateFields.email = email
                }
                if (message) {
                    updateFields.message = message
                }

                if (other_details1) {
                    updateFields.other_details1 = other_details1
                }
                if (other_details2) {
                    updateFields.other_details2 = other_details2
                }
                if (other_details3) {
                    updateFields.other_details3 = other_details3
                }

                if (req.files) {
                    for (let i = 0; i < req.files.length; i++) {
                        const file = req.files[i];

                        switch (file.fieldname) {
                            case 'user_img':
                                updateFields.user_img = file.filename;
                                break;
                            case 'aadhar_img':
                                updateFields.aadhar_img = file.filename;
                                break;
                            case 'signature_img':
                                updateFields.signature_img = file.filename;
                                break;
                            case 'tenth_result_img':
                                updateFields.tenth_result_img = file.filename;
                                break;
                            case 'add_document':
                                updateFields.add_document = file.filename;
                                break;

                            case 'other_file1':
                                updateFields.other_file1 = file.filename;
                                break;
                            case 'other_file2':
                                updateFields.other_file2 = file.filename;
                                break;
                            case 'other_file3':
                                updateFields.other_file3 = file.filename;
                                break;
                            default:
                                break;
                        }
                    }
                }
                const data = await otherFormModel.findByIdAndUpdate({ _id: _id }, { $set: updateFields }, { new: true })
                res.status(200).json({ result: "true", msg: "other form  data succesfully updated", data: data })

            }
        } else {

            res.status(400).json({ result: "false", msg: "_id parameter required (optional parameter) category, name, phone_no, email, message, other_details1, other_details2, other_details3,user_img,aadhar_img,signature_img,tenth_result_img,add_document,other_file1,other_file2,other_file3" })
        }
    } catch (error) {
        console.log(error)
    }


}




//  send pancard document 
const sendPancardDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await PanCard.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await PanCard_Model.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}




//  send votercard document
const sendVotercardDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await VoterCard.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await VoterID_Model.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}



//  send labourcard document 
const sendLabourcardDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await LabourCard.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await LabourCard.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}


//  send udidcard document 
const sendUdidcardDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await UdidCard.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await UdidCard.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}




//  send ayushmancard document 
const sendAyushmancardDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await AyushmanCard_Model.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await AyushmanCard_Model.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}


//  send eshramcard document 
const sendEshramcardDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await EshramCard.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await EshramCard.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}

//  send income document 
const sendIncomeDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await incomeCertificateModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await incomeCertificateModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}

//  send domicile document 
const sendDomicileDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await domicileCertificateModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await domicileCertificateModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}

//  send cast document 
const sendCastDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await castCertificateModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await castCertificateModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}

//  send pfwithdrawal document 
const sendPfWithdrawalDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await pfWithdrawalModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await pfWithdrawalModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}

//  send pfkyc document 
const sendPfKycDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await pfKycModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await pfKycModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}


//  send pfnomination document 
const sendPfNominationDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await pfNominationModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await pfNominationModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}


//  send pfmidtransfer document 
const sendPfMidTransferDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await pfMidTransferModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await pfMidTransferModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}


//  send police verification document 
const sendPoliceVerificationDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await policeVerificationModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await policeVerificationModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}


//  send fir document 
const sendFirDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await firModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await firModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}


//  send lost report document 
const sendLostReportDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await lostReportModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await lostReportModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}


//  send aadhar address document 
const sendAadharAddressDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await aadharAddressModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await aadharAddressModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}


//  send ayushman address document 
const sendAyushmanAddressDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await ayushmanAddressModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await ayushmanAddressModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}


//  send up rationcard document 
const sendUpRationcardDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await upRationCardModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await upRationCardModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}


//  send pancard correction document 
const sendPancardCorrectionDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await pancardCorrectionModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await pancardCorrectionModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}


//  send other form document 
const sendOtherFormDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require" })
        }

        const getData = await otherFormModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await otherFormModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}

// get all msme data
const allMsme = async (req, res) => {
    try {
        const msmeData = await msmeModel.find()
        if (!msmeData || msmeData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "msme data get successfull", data: msmeData })
        }

    } catch (error) {
        console.log(error.message)
    }
}

// get all food license data
const allFoodLicense = async (req, res) => {
    try {
        const foodLicenseData = await foodLicenseModel.find()
        if (!foodLicenseData || foodLicenseData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "food license data get successfull", data: foodLicenseData })
        }

    } catch (error) {
        console.log(error.message)
    }
}

// get all fresh passport data
const allFreshPassport = async (req, res) => {
    try {
        const freshPassportData = await freshPassportModel.find()
        if (!freshPassportData || freshPassportData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "fresh passport data get successfull", data: freshPassportData })
        }

    } catch (error) {
        console.log(error.message)
    }
}

// get all tatkal passport data
const allTatkalPassport = async (req, res) => {
    try {
        const tatkalPassportData = await tatkalPassportModel.find()
        if (!tatkalPassportData || tatkalPassportData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "tatkal passport data get successfull", data: tatkalPassportData })
        }

    } catch (error) {
        console.log(error.message)
    }
}

// get all renewel passport data
const allRenewelPassport = async (req, res) => {
    try {
        const renewelPassportData = await renewelPassportModel.find()
        if (!renewelPassportData || renewelPassportData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "renewel passport data get successfull", data: renewelPassportData })
        }

    } catch (error) {
        console.log(error.message)
    }
}

// get all railway ticket  data
const allRailwayTcket = async (req, res) => {
    try {
        const railwayTicketData = await railwayTicketModel.find()
        if (!railwayTicketData || railwayTicketData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "railway ticket data get successfull", data: railwayTicketData })
        }

    } catch (error) {
        console.log(error.message)
    }
}

// get all insurance ticket  data
const allInsurance = async (req, res) => {
    try {
        const insuranceData = await insuranceModel.find()
        if (!insuranceData || insuranceData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "insurance data get successfull", data: insuranceData })
        }

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



// delete msme  data
const deleteMsme = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await msmeModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "msme data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}


// delete food license  data
const deleteFoodLicense = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await foodLicenseModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "food license data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete fresh passport data
const deleteFreshPassport = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await freshPassportModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "fresh passport data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete tatkal passport data
const deleteTatkalPassport = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await tatkalPassportModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "tatkal passport data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete renewel passport data
const deleteRenewelPassport = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await renewelPassportModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "renewel passport data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete railway ticket data
const deleteRailwayTicket = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await railwayTicketModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "railway ticket data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}

// delete insurance  data
const deleteInsurance = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        await insuranceModel.findByIdAndDelete({ _id: _id })
        res.status(200).json({ result: "true", msg: "insurance data delete successfull" })


    } catch (error) {
        console.log(error.message)
    }
}



//  send msme document 
const sendMsmeDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require " })
        }

        const getData = await msmeModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await msmeModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}




//  send food license document 
const sendFoodLicenseDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require " })
        }

        const getData = await foodLicenseModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await foodLicenseModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}



//  send fresh Passport document 
const sendFreshPassportDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require " })
        }

        const getData = await freshPassportModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await freshPassportModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}


//  send tatkal Passport document 
const sendTatkalPassportDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require " })
        }

        const getData = await tatkalPassportModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await tatkalPassportModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}


//  send renewel Passport document 
const sendRenewelPassportDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require " })
        }

        const getData = await renewelPassportModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await renewelPassportModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}

//  send railway ticket document 
const sendRailwayTicketDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require " })
        }

        const getData = await railwayTicketModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await railwayTicketModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}


//  send insurance  document 
const sendInsuranceDocument = async (req, res) => {
    try {
        const { user_id, _id, input1, input2 } = req.body
        if (!user_id || !_id) {
            return res.status(400).json({ result: "false", msg: "user_id and _id parameter require " })
        }

        const getData = await insuranceModel.findOne({ _id: _id, user_id: user_id })

        if (!getData || getData.length == 0) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (getData.approve_status != 0) {
            const updateFields = {};
            if (input1) {
                updateFields.input1 = input1
            }
            if (input2) {
                updateFields.input2 = input2
            }

            if (req.files) {
                for (let i = 0; i < req.files.length; i++) {
                    const file = req.files[i];

                    switch (file.fieldname) {
                        case 'document1':
                            updateFields.document1 = file.filename;
                            break;
                        case 'document2':
                            updateFields.document2 = file.filename;
                            break;

                        default:
                            break;
                    }
                }
            }

            const data = await insuranceModel.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
            res.status(200).json({ result: "true", msg: "document send successfull", data: data })
        } else {
            res.status(400).json({ result: "false", msg: "details is not approved" })
        }


    } catch (error) {
        console.log(error.message)
    }
}

// get all data  
const getAllData = async (req, res) => {
    try {

        let allData = []
        const pancard = await PanCard.find()
        allData = [...allData, ...pancard]

        const votercard = await VoterCard.find()
        allData = [...allData, ...votercard]

        const labourcard = await LabourCard.find()
        allData = [...allData, ...labourcard]

        const udidcard = await UdidCard.find()
        allData = [...allData, ...udidcard]

        const ayushmancard = await AyushmanCard.find()
        allData = [...allData, ...ayushmancard]

        const eshramcard = await EshramCard.find()
        allData = [...allData, ...eshramcard]

        const incomecertificate = await incomeCertificateModel.find()
        allData = [...allData, ...incomecertificate]

        const domicilecertificate = await domicileCertificateModel.find()
        allData = [...allData, ...domicilecertificate]

        const castcertificate = await castCertificateModel.find()
        allData = [...allData, ...castcertificate]

        const pfwithdraw = await pfWithdrawalModel.find()
        allData = [...allData, ...pfwithdraw]

        const pfkyc = await pfKycModel.find()
        allData = [...allData, ...pfkyc]

        const pfnomination = await pfNominationModel.find()
        allData = [...allData, ...pfnomination]

        const pfmidtransfer = await pfMidTransferModel.find()
        allData = [...allData, ...pfmidtransfer]

        const policeverification = await policeVerificationModel.find()
        allData = [...allData, ...policeverification]

        const fir = await firModel.find()
        allData = [...allData, ...fir]

        const lostreport = await lostReportModel.find()
        allData = [...allData, ...lostreport]

        const aadharaddress = await aadharAddressModel.find()
        allData = [...allData, ...aadharaddress]

        const ayushmanaddress = await ayushmanAddressModel.find()
        allData = [...allData, ...ayushmanaddress]

        const uprationcard = await upRationCardModel.find()
        allData = [...allData, ...uprationcard]

        const pancardcorrection = await pancardCorrectionModel.find()
        allData = [...allData, ...pancardcorrection]

        const otherform = await otherFormModel.find()
        allData = [...allData, ...otherform]

        const msme = await msmeModel.find()
        allData = [...allData, ...msme]

        const foodlicense = await foodLicenseModel.find()
        allData = [...allData, ...foodlicense]

        const freshpassport = await freshPassportModel.find()
        allData = [...allData, ...freshpassport]

        const tatkalpassport = await tatkalPassportModel.find()
        allData = [...allData, ...tatkalpassport]

        const renewelpassport = await renewelPassportModel.find()
        allData = [...allData, ...renewelpassport]

        const railwaytiket = await railwayTicketModel.find()
        allData = [...allData, ...railwaytiket]

        const insurance = await insuranceModel.find()
        allData = [...allData, ...insurance]

        console.log(allData.length)

        const approveData = allData.filter(items => items.approve_status == 1)


        const pendingData = allData.filter(items => items.approve_status == 0)


        res.status(200).json({ result: "true", msg: "data get success", allData: allData.length, approveData: approveData.length, pendingData: pendingData.length })


    } catch (error) {
        console.log(error.message)
    }
}

// get per day  data  
const getPerDayData = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let allData = []
        const pancard = await PanCard.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...pancard]

        const votercard = await VoterCard.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...votercard]

        const labourcard = await LabourCard.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...labourcard]

        const udidcard = await UdidCard.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...udidcard]

        const ayushmancard = await AyushmanCard.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...ayushmancard]

        const eshramcard = await EshramCard.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...eshramcard]

        const incomecertificate = await incomeCertificateModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...incomecertificate]

        const domicilecertificate = await domicileCertificateModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...domicilecertificate]

        const castcertificate = await castCertificateModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...castcertificate]

        const pfwithdraw = await pfWithdrawalModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...pfwithdraw]

        const pfkyc = await pfKycModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...pfkyc]

        const pfnomination = await pfNominationModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...pfnomination]

        const pfmidtransfer = await pfMidTransferModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...pfmidtransfer]

        const policeverification = await policeVerificationModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...policeverification]

        const fir = await firModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...fir]

        const lostreport = await lostReportModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...lostreport]

        const aadharaddress = await aadharAddressModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...aadharaddress]

        const ayushmanaddress = await ayushmanAddressModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...ayushmanaddress]

        const uprationcard = await upRationCardModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 *  60 *  60 * 1000)
            }
        })
        allData = [...allData, ...uprationcard]

        const pancardcorrection = await pancardCorrectionModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...pancardcorrection]

        const otherform = await otherFormModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...otherform]

        const msme = await msmeModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...msme]

        const foodlicense = await foodLicenseModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...foodlicense]

        const freshpassport = await freshPassportModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...freshpassport]

        const tatkalpassport = await tatkalPassportModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...tatkalpassport]

        const renewelpassport = await renewelPassportModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...renewelpassport]

        const railwaytiket = await railwayTicketModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...railwaytiket]

        const insurance = await insuranceModel.find({
            "createdAt": {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
            }
        })
        allData = [...allData, ...insurance]





        console.log(allData)
        res.status(200).json({ result: "true", msg: "per day data get success", allPerDayData: allData.length })


    } catch (error) {
        console.log(error.message)
    }
}


// get all query box data
const allQueryBox = async (req, res) => {
    try {
        const queryData = await queryBoxModel.find()
        if (!queryData || queryData.length == 0) {
            res.status(400).json({ result: "false", msg: "record not found" })
        } else {
            res.status(200).json({ result: "true", msg: "query box data get successfull", data: queryData })
        }

    } catch (error) {
        console.log(error.message)
    }
}

// single query box data
const singleQueryBox = async (req, res) => {
    try {
        const { _id } = req.body
        if (!_id) {
            return res.status(400).json({ result: "false", msg: "_id parameter require" })
        }
        const data = await queryBoxModel.findById(_id)
        res.status(200).json({ result: "true", msg: "query box data get success", data: data })
    } catch (error) {
        console.log(error)
        res.status(500).json({ result: "false", msg: "Internel server error" })
    }
}




module.exports ={
    Admin_Login, 
	User_Self_List,
    User_Operator_List,
    Approve_Status,
    GetPancardData,
    GetVoteridData,
    GetLabourCardData,
    GetUdidCardData,
    GetAyushmanCardData,
    GetEshramCardData,
    UpdatePancardData,
    UpdateVoteridData,
    UpdateLabourCardData,
    UpdateUdidCardData, 
    UpdateAyushmanCardData,
    UpdateEshramCardData,
    DeletePanCardData,
    DeleteVoterIdCardData,
    DeleteLabourCardData,
    DeleteUdidCardData,
    DeleteAyushmanCardData,
    DeleteEshramCardData,
    createSubAdmin,
    getSubAdmins,
    updateSubAdmin,
    deleteSubAdmin,
    givAccess,
    sendMessage,
    getMessage,
    addService,
    getQuestion,
    getContact,
    getSinglePancardData,
    getSingleAyushmanCardData,
    getSingleVoterCardData,
    getSingleLabourCardData,
    getSingleEshramCardData,
    getSingleUdidCardData,
    sendAnswer,
    getSingleUser,
    allIncomeCertificate,
    allDomicileCertificate,
    allCastCertificate,
    allPfWithdrawal,
    allPfKyc,
    allPfNomination,
    allPfMidTransfer,
    allPoliceVerification,
    allFir,
    allLostReport,
    allAadharAdress,
    allAyushmanAdress,
    allUpRationCard,
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
    allPancardCorrection,
    allOtherForm,
    singlePancardCorrection,
    singleOtherForm,
    deleteIncomeCertificate,
    deleteDomicileCertificate,
    deleteCastCertificate,
    deletePfWithdrawal,
    deletePfWithdrawal,
    deletePfKyc,
    deletePfNomination,
    deletePfMidTransfer,
    deletePoliceVerification,
    deleteFir,
    deleteLostReport,
    deleteAadharAddress,
    deleteAyushmanAddress,
    deleteUpRationCard,
    deletePancardCorrection,
    deleteOtherForm,
    updateIncomeCertificate,
    updateDomicileCertificate,
    updateCastCertificate,
    updatePfWithdrawal,
    updatePfKyc,
    updatePfNomination,
    updatePfMidTransfer,
    updatePoliceVerification,
    updateFir,
    updateLostReport,
    updateAadharAddress,
    updateAyushmanrAddress,
    updateUpRationCard,
    updatePancardCorrection,
    updateOtherForm,
    sendPancardDocument,
    sendVotercardDocument,
    sendLabourcardDocument,
    sendUdidcardDocument,
    sendAyushmancardDocument,
    sendEshramcardDocument,
    sendIncomeDocument,
    sendDomicileDocument,
    sendCastDocument,
    sendPfWithdrawalDocument,
    sendPfKycDocument,
    sendPfNominationDocument,
    sendPfMidTransferDocument,
    sendPoliceVerificationDocument,
    sendFirDocument,
    sendLostReportDocument,
    sendAadharAddressDocument,
    sendAyushmanAddressDocument,
    sendUpRationcardDocument,
    sendPancardCorrectionDocument,
    sendOtherFormDocument,
    allMsme,
    allFoodLicense,
    allFreshPassport,
    allTatkalPassport,
    allRenewelPassport,
    allRailwayTcket,
    allInsurance,
    singleMsme,
    singleFoodLicense,
    singleFreshPassport,
    singleTatkalPassport,
    singleRenewelPassport,
    singleRailwayTicket,
    singleInsurance,
    deleteMsme,
    deleteFoodLicense,
    deleteFreshPassport,
    deleteTatkalPassport,
    deleteRenewelPassport,
    deleteRailwayTicket,
    deleteInsurance,
    sendMsmeDocument,
    sendFoodLicenseDocument,
    sendFreshPassportDocument,
    sendTatkalPassportDocument,
    sendRenewelPassportDocument,
    sendRailwayTicketDocument,
    sendInsuranceDocument,
    getAllData,
    getPerDayData,
    allQueryBox,
    singleQueryBox
}