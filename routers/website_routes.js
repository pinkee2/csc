// import dependancies in the  router files
const express=require('express'); 
const router=express();
const multer = require('multer');
const websiteControllers = require('../controllers/website_controllers');
const auth = require('../middleware/auth');

// create storage
const storage=multer.diskStorage({  
    destination:"uploads",  
    filename:(req,file,cb)=>{
        cb(null,file.originalname); 
    }, 
}); 
 
const upload = multer({
    storage: storage,
    fileFilter: function(req,files,callback){
        if(
        files.mimetype == "image/png" ||
        files.mimetype == "image/jpg" ||
        files.mimetype == "image/jpeg"||
        files.mimetype == "application/pdf"
    ){
        callback(null,true)
    }else{
        console.log('only  png , jpg & jpeg file supported')
        callback(null,false)
    } 

   },
   limits:{

    filesize:100000000000 //1000000 bytes=1MB
   }
});

//import user controllers files here
router.post('/user_registration',upload.any('aadhar_image','pan_card_image','home_image','education_image'),websiteControllers.User_Signup);
router.post('/self_login',websiteControllers.Self_Login);
router.post('/verify_otp',websiteControllers.Verify_Otp);
router.post('/operator_login',websiteControllers.Operator_Login);
router.post('/add_pancard_details',auth, upload.any('aadhar_img', 'user_img', 'signature_img', 'other_file1', 'other_file2'), websiteControllers.Pancard_Details);
router.post('/add_voterid_details', upload.any('user_img', 'aadhar_img', "family_voterid_img", "signature_img", 'other_file1', 'other_file2'), websiteControllers.VoterId_Details);
router.post('/add_labourcard_details', upload.any('user_img', 'aadhar_img', "bank_passbook_or_cheque_img", "nominee_aadhar_img", "signature_img", 'other_file1', 'other_file2', 'other_file3'), websiteControllers.LabourCard_Details);
router.post('/add_udidcard_details', upload.any('user_img', 'aadhar_img', "father_or_mother_aadhar_img", "signature_img", 'disability_certificate', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.UdidCard_Details);
//router.route('/update_pancard_details').put(websiteControllers.UpdatePancardData);
router.post('/add_ayushmancard_details', upload.any('aadhar_img,user_img,other_file1,other_file2,other_file3'), websiteControllers.AyushmanCard_Details)
router.post('/add_eshramcard_details', upload.any('aadhar_img,bank_passbook_or_cheque_img,nominee_aadhar_img,other_file1,other_file2,other_file3'), websiteControllers.EshramCard_Details);
router.post('/add_document', upload.single('file'), websiteControllers.addDocument)
router.get('/get_document', websiteControllers.getDocument);
router.post('/get_user_status', websiteControllers.userStatus);
router.get('/get_service', websiteControllers.getService);
router.post('/send_question', websiteControllers.sendQuestion);
router.post('/change_password', websiteControllers.changePassword);
router.post('/upload_profile', upload.single('profile'), websiteControllers.uploadProfile);
router.post('/update_profiledata', upload.any('aadhar_image', 'pan_card_image', 'home_image', 'education_image'), websiteControllers.updateProfileData);
router.post('/add_contact_data', websiteControllers.contactData);
router.post('/get_profile', websiteControllers.getProfile);
router.post('/update_selflogin_data', upload.any("aadhar_image", "pan_card_image", "home_image", "education_image"), websiteControllers.updateSelfLoginData)
router.post('/get_answer', websiteControllers.getAnswer);
router.post('/get_user_submitted_data', websiteControllers.userSubmittedData);
router.post('/single_pancard_data', websiteControllers.singlePanCard);
router.post('/single_ayushmancard_data', websiteControllers.singleAyushmanCard)
router.post('/single_labourcard_data', websiteControllers.singleLabourCard)
router.post('/single_udidcard_data', websiteControllers.singleUdidCard)
router.post('/single_eshramcard_data', websiteControllers.singleEshramCard)
router.post('/single_votercard_data', websiteControllers.singleVoterCard)
router.post('/send_otp', websiteControllers.sendOtp);
router.post('/forgot_password', websiteControllers.forgotPassword);
router.post('/add_income_certificate_details', upload.any('user_img', 'aadhar_img', 'sabhasad_or_parshad_letterhead_img', 'svapramanit_ghoshnapatra_or_signature_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.incomeCertificate);
router.post('/add_domicile_certificate_details', upload.any('user_img', 'aadhar_img', 'sabhasad_or_parshad_letterhead_img', 'svapramanit_ghoshnapatra_or_signature_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.domicileCertificate);
router.post('/add_cast_certificate_details', upload.any('user_img', 'aadhar_img', 'sabhasad_or_parshad_letterhead_img', 'svapramanit_ghoshnapatra_or_signature_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.castCertificate);
router.post('/add_pf_withdrawal_details', upload.any('aadhar_img', 'bank_passbook_or_cheque_img', 'pancard_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.pfWithdrawal);
router.post('/add_pf_kyc_details', upload.any('aadhar_img', 'bank_passbook_or_cheque_img', 'pancard_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.pfKyc);
router.post('/add_pf_nomination_details', upload.any('aadhar_img', 'bank_passbook_or_cheque_img', 'pancard_img', 'nominee_aadhar_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.pfNomination);
router.post('/add_pf_midtransfer_details', upload.any('aadhar_img', 'bank_passbook_or_cheque_img', 'pancard_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.pfMidTransfer);
router.post('/add_police_verification_details', upload.any('user_img', 'aadhar_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.policeVerification);
router.post('/add_fir_details', upload.any('user_img', 'aadhar_img', 'fir_content_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.fir);
router.post('/add_lost_report_details', upload.any('user_img', 'aadhar_img', 'fir_content_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.lostReport);
router.post('/add_aadhar_address_change_details', upload.any('address_proof_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.aadharAddressChange);
router.post('/add_ayushman_address_change_details', upload.any('user_img', 'aadhar_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.ayushmanAddressChange);
router.post('/add_up_rationcard_details', upload.any('user_img', 'aadhar_img', 'bank_passbook_img', 'family_aadhar_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.upRationCard);
router.post('/add_pancard_correction_details', upload.any('user_img', 'aadhar_img', 'signature_img', 'correction_proof_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.pancardCorrection);
router.post('/add_other_form_details', upload.any('user_img', 'aadhar_img', 'signature_img', 'tenth_result_img', 'add_document', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.otherForm);
router.post('/single_income_certificate_data', websiteControllers.singleIncomeCertificate)
router.post('/single_domicile_certificate_data', websiteControllers.singleDomicileCertificate)
router.post('/single_cast_certificate_data', websiteControllers.singleCastCertificate)
router.post('/single_pf_withdrawal_data', websiteControllers.singlePfWithdrawal)
router.post('/single_pf_kyc_data', websiteControllers.singlePfKyc)
router.post('/single_pf_nomination_data', websiteControllers.singlePfNomination)
router.post('/single_pf_midtransfer_data', websiteControllers.singlePfMidTransfer)
router.post('/single_police_verification_data', websiteControllers.singlePoliceVerification)
router.post('/single_fir_data', websiteControllers.singleFir)
router.post('/single_lost_report_data', websiteControllers.singleLostReport)
router.post('/single_aadhar_address_data', websiteControllers.singleAadharAddress)
router.post('/single_ayushman_address_data', websiteControllers.singleAyushmanAddress)
router.post('/single_up_rationcard_data', websiteControllers.singleUpRationCard)
router.post('/single_pancard_correction_data', websiteControllers.singlePancardCorrection)
router.post('/single_other_form_data', websiteControllers.singleOtherForm)
router.post('/add_msme_details', upload.any('user_img', 'aadhar_img', 'office_address_proof_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.msme)
router.post('/add_food_license_details', upload.any('user_img', 'aadhar_img', 'office_address_proof_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.foodLicense)
router.post('/add_fresh_passport_details', upload.any('aadhar_img', 'pancard_img', 'tenth_marksheet_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.freshPassport)
router.post('/add_tatkal_passport_details', upload.any('aadhar_img', 'pancard_img', 'tenth_marksheet_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.tatkalPassport)
router.post('/add_renewel_passport_details', upload.any('aadhar_img', 'pancard_img', 'tenth_marksheet_img', "old_passport_or_fir_img", 'other_file1', 'other_file2', 'other_file3'), websiteControllers.renewelPassport)
router.post('/add_railway_ticket_details', upload.any('irctc_train_status_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.railwayTicket)
router.post('/add_insurance_details', upload.any('rc_img', 'owner_id_img', 'old_insurance_img', 'other_file1', 'other_file2', 'other_file3'), websiteControllers.insurance)
router.post('/single_msme_data', websiteControllers.singleMsme)
router.post('/single_food_license_data', websiteControllers.singleFoodLicense)
router.post('/single_fresh_passport_data', websiteControllers.singleFreshPassport)
router.post('/single_tatkal_passport_data', websiteControllers.singleTatkalPassport)
router.post('/single_renewel_passport_data', websiteControllers.singleRenewelPassport)
router.post('/single_railway_ticket_data', websiteControllers.singleRailwayTicket)
router.post('/single_insurance_data', websiteControllers.singleInsurance)
router.post('/add_querybox_data', websiteControllers.queryBox);

module.exports=router; 

