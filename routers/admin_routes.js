// import dependancies in the  router files
const express=require('express');
const router=express();  
const multer = require('multer');
const adminControllers = require('../controllers/admin_controllers');
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
        files.mimetype == "image/jpeg"
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

//import admin controllers files here
router.post('/admin_login',adminControllers.Admin_Login);
router.post('/send_message', adminControllers.sendMessage);
router.post('/give_access', adminControllers.givAccess);
router.post('/create_subadmin', adminControllers.createSubAdmin);
router.post('/add_service', upload.single('image'), adminControllers.addService)
router.post('/get_single_pancard_data', adminControllers.getSinglePancardData)
router.post('/get_single_ayushmancard_data', adminControllers.getSingleAyushmanCardData)
router.post('/get_single_votercard_data', adminControllers.getSingleVoterCardData)
router.post('/get_single_labourcard_data', adminControllers.getSingleLabourCardData)
router.post('/get_single_eshramcard_data', adminControllers.getSingleEshramCardData)
router.post('/get_single_udidcard_data', adminControllers.getSingleUdidCardData)
router.post('/send_answer', adminControllers.sendAnswer)
router.post('/single_income_certificate_data', adminControllers.singleIncomeCertificate)
router.post('/single_domicile_certificate_data', adminControllers.singleDomicileCertificate)
router.post('/single_cast_certificate_data', adminControllers.singleCastCertificate)
router.post('/single_pf_withdrawal_data', adminControllers.singlePfWithdrawal)
router.post('/single_pf_kyc_data', adminControllers.singlePfKyc)
router.post('/single_pf_nomination_data', adminControllers.singlePfNomination)
router.post('/single_pf_midtransfer_data', adminControllers.singlePfMidTransfer)
router.post('/single_police_verification_data', adminControllers.singlePoliceVerification)
router.post('/single_fir_data', adminControllers.singleFir)
router.post('/single_lost_report_data', adminControllers.singleLostReport)
router.post('/single_aadhar_address_data', adminControllers.singleAadharAddress)
router.post('/single_ayushman_address_data', adminControllers.singleAyushmanAddress)
router.post('/single_up_rationcard_data', adminControllers.singleUpRationCard)
router.post('/single_pancard_correction_data', adminControllers.singlePancardCorrection)
router.post('/single_other_form_data', adminControllers.singleOtherForm)
router.post('/get_all_perday_data', adminControllers.getPerDayData)
router.post('/all_querybox', adminControllers.allQueryBox)
router.post('/single_querybox', adminControllers.singleQueryBox)

//import admin controllers files here
router.get('/user_self_list',adminControllers.User_Self_List);
router.get('/user_operator_list',adminControllers.User_Operator_List);
router.post('/approve_status',adminControllers.Approve_Status); 
router.get('/get_pancard_details', adminControllers.GetPancardData);
router.get('/get_voter_details', adminControllers.GetVoteridData);
router.get('/get_labourcard_details', adminControllers.GetLabourCardData);
router.get('/get_udidcard_details', adminControllers.GetUdidCardData);
router.get('/get_ayushmancard_details', adminControllers.GetAyushmanCardData);
router.get('/get_eshramcard_details', adminControllers.GetEshramCardData);
router.get('/get_message', adminControllers.getMessage);
router.get('/get_subadmins', adminControllers.getSubAdmins);
router.get('/get_question', adminControllers.getQuestion);
router.get('/get_contact_data', adminControllers.getContact);
router.post('/get_single_user', adminControllers.getSingleUser);
router.get('/get_all_form_data', adminControllers.getAllData)

router.get('/all_income_certificate_data', adminControllers.allIncomeCertificate)
router.get('/all_domicile_certificate_data', adminControllers.allDomicileCertificate)
router.get('/all_cast_certificate_data', adminControllers.allCastCertificate)
router.get('/all_pf_withdrawal_data', adminControllers.allPfWithdrawal)
router.get('/all_pf_kyc_data', adminControllers.allPfKyc)
router.get('/all_pf_nomination_data', adminControllers.allPfNomination)
router.get('/all_pf_midtransfer_data', adminControllers.allPfMidTransfer)
router.get('/all_police_verification_data', adminControllers.allPoliceVerification)
router.get('/all_fir_data', adminControllers.allFir)
router.get('/all_lost_report_data', adminControllers.allLostReport)
router.get('/all_aadhar_address_data', adminControllers.allAadharAdress)
router.get('/all_ayushman_address_data', adminControllers.allAyushmanAdress)
router.get('/all_up_rationcard_data', adminControllers.allUpRationCard)
router.get('/all_pancard_correction_data', adminControllers.allPancardCorrection)
router.get('/all_other_form_data', adminControllers.allOtherForm)

//update admin data
router.put('/update_pancard_details', upload.any('aadhar_img', 'user_img', 'other_file1', 'other_file2'), adminControllers.UpdatePancardData)
router.put('/update_voterid_details', upload.any('user_img', 'aadhar_img', "family_voterid_img", "signature_img", 'other_file1', 'other_file2'),adminControllers.UpdateVoteridData)
router.put('/update_labourcard_details', upload.any('user_img', 'aadhar_img', "bank_passbook_or_cheque_img", "nominee_aadhar_img", "signature_img", 'other_file1', 'other_file2', 'other_file3'), adminControllers.UpdateLabourCardData)
router.put('/update_udidcard_details', upload.any('user_img', 'aadhar_img', "father_or_mother_aadhar_img", "signature_img", 'disability_certificate', 'other_file1', 'other_file2', 'other_file3'), adminControllers.UpdateUdidCardData)
router.put('/update_ayushmancard_details', upload.any('aadhar_img', 'user_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.UpdateAyushmanCardData);
router.put('/update_eshramcard_details', upload.any('aadhar_img', 'bank_passbook_or_cheque_img', 'nominee_aadhar_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.UpdateEshramCardData)
router.put('/update_subadmin', adminControllers.updateSubAdmin)

// delete single admin data
router.post('/delete_pancard_details', adminControllers.DeletePanCardData)
router.post('/delete_voterid_details', adminControllers.DeleteVoterIdCardData)
router.post('/delete_labourcard_details', adminControllers.DeleteLabourCardData)
router.post('/delete_udidcard_details', adminControllers.DeleteUdidCardData)
router.post('/delete_ayushmancard_details', adminControllers.DeleteAyushmanCardData);
router.post('/delete_eshramcard_details', adminControllers.DeleteEshramCardData);
router.post('/delete_subadmin', adminControllers.deleteSubAdmin);
router.post('/delete_income_certificate', adminControllers.deleteIncomeCertificate)
router.post('/delete_domicile_certificate', adminControllers.deleteDomicileCertificate)
router.post('/delete_cast_certificate', adminControllers.deleteCastCertificate)
router.post('/delete_pfwithdrawal', adminControllers.deletePfWithdrawal)
router.post('/delete_pfkyc', adminControllers.deletePfKyc)
router.post('/delete_pfnomination', adminControllers.deletePfNomination)
router.post('/delete_pfmidtransfer', adminControllers.deletePfMidTransfer)
router.post('/delete_police_verification', adminControllers.deletePoliceVerification)
router.post('/delete_fir', adminControllers.deleteFir)
router.post('/delete_lost_report', adminControllers.deleteLostReport)
router.post('/delete_aadhar_address', adminControllers.deleteAadharAddress)
router.post('/delete_ayushman_address', adminControllers.deleteAyushmanAddress)
router.post('/delete_up_rationcard', adminControllers.deleteUpRationCard)
router.post('/delete_pancard_correction', adminControllers.deletePancardCorrection)
router.post('/delete_other_form', adminControllers.deleteOtherForm)
router.post('/update_income_certificate', upload.any('user_img', 'aadhar_img', 'sabhasad_or_parshad_letterhead_img', 'svapramanit_ghoshnapatra_or_signature_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.updateIncomeCertificate)
router.post('/update_domicile_certificate', upload.any('user_img', 'aadhar_img', 'sabhasad_or_parshad_letterhead_img', 'svapramanit_ghoshnapatra_or_signature_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.updateDomicileCertificate)
router.post('/update_cast_certificate', upload.any('user_img', 'aadhar_img', 'sabhasad_or_parshad_letterhead_img', 'svapramanit_ghoshnapatra_or_signature_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.updateCastCertificate)
router.post('/update_pf_withdrawal', upload.any('aadhar_img', 'bank_passbook_or_cheque_img', 'pancard_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.updatePfWithdrawal)
router.post('/update_pf_kyc', upload.any('aadhar_img', 'bank_passbook_or_cheque_img', 'pancard_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.updatePfKyc)
router.post('/update_pf_nomination', upload.any('aadhar_img', 'bank_passbook_or_cheque_img', 'pancard_img', 'nominee_aadhar_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.updatePfNomination)
router.post('/update_pf_midtransfer', upload.any('aadhar_img', 'bank_passbook_or_cheque_img', 'pancard_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.updatePfMidTransfer)
router.post('/update_police_verification', upload.any('user_img', 'aadhar_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.updatePoliceVerification)
router.post('/update_fir', upload.any('user_img', 'aadhar_img', 'fir_content_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.updateFir)
router.post('/update_lost_report', upload.any('user_img', 'aadhar_img', 'fir_content_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.updateLostReport)
router.post('/update_aadhar_address', upload.any('address_proof_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.updateAadharAddress)
router.post('/update_ayushman_address', upload.any('user_img', 'aadhar_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.updateAyushmanrAddress)
router.post('/update_up_rationcard', upload.any('user_img', 'aadhar_img', 'bank_passbook_img', 'family_aadhar_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.updateUpRationCard)
router.post('/update_pancard_correction', upload.any('user_img', 'aadhar_img', 'signature_img', 'correction_proof_img', 'other_file1', 'other_file2', 'other_file3'), adminControllers.updatePancardCorrection)
router.post('/update_other_form', upload.any('user_img', 'aadhar_img', 'signature_img', 'tenth_result_img', 'add_document', 'other_file1', 'other_file2', 'other_file3'), adminControllers.updateOtherForm)
router.post('/pancard_document', upload.any('document1', 'document2'), adminControllers.sendPancardDocument)
router.post('/votercard_document', upload.any('document1', 'document2'), adminControllers.sendVotercardDocument)
router.post('/labourcard_document', upload.any('document1', 'document2'), adminControllers.sendLabourcardDocument)
router.post('/udidcard_document', upload.any('document1', 'document2'), adminControllers.sendUdidcardDocument)
router.post('/ayushmancard_document', upload.any('document1', 'document2'), adminControllers.sendAyushmancardDocument)
router.post('/eshramcard_document', upload.any('document1', 'document2'), adminControllers.sendEshramcardDocument)
router.post('/income_document', upload.any('document1', 'document2'), adminControllers.sendIncomeDocument)
router.post('/domicile_document', upload.any('document1', 'document2'), adminControllers.sendDomicileDocument)
router.post('/cast_document', upload.any('document1', 'document2'), adminControllers.sendCastDocument)
router.post('/pfwithdrawal_document', upload.any('document1', 'document2'), adminControllers.sendPfWithdrawalDocument)
router.post('/pfkyc_document', upload.any('document1', 'document2'), adminControllers.sendPfKycDocument)
router.post('/pfnomination_document', upload.any('document1', 'document2'), adminControllers.sendPfNominationDocument)
router.post('/pfmidtransfer_document', upload.any('document1', 'document2'), adminControllers.sendPfMidTransferDocument)
router.post('/police_verification_document', upload.any('document1', 'document2'), adminControllers.sendPoliceVerificationDocument)
router.post('/fir_document', upload.any('document1', 'document2'), adminControllers.sendFirDocument)
router.post('/lostreport_document', upload.any('document1', 'document2'), adminControllers.sendLostReportDocument)
router.post('/aadhar_address_document', upload.any('document1', 'document2'), adminControllers.sendAadharAddressDocument)
router.post('/ayushman_address_document', upload.any('document1', 'document2'), adminControllers.sendAyushmanAddressDocument)
router.post('/up_rationcard_document', upload.any('document1', 'document2'), adminControllers.sendUpRationcardDocument)
router.post('/pancard_correction_document', upload.any('document1', 'document2'), adminControllers.sendPancardCorrectionDocument)
router.post('/other_form_document', upload.any('document1', 'document2'), adminControllers.sendOtherFormDocument)
router.get('/all_msme', adminControllers.allMsme)
router.get('/all_food_license', adminControllers.allFoodLicense)
router.get('/all_fresh_passport', adminControllers.allFreshPassport)
router.get('/all_tatkal_passport', adminControllers.allTatkalPassport)
router.get('/all_renewel_passport', adminControllers.allRenewelPassport)
router.get('/all_railway_ticket', adminControllers.allRailwayTcket)
router.get('/all_insurance', adminControllers.allInsurance)
router.post('/single_msme_data', adminControllers.singleMsme)
router.post('/single_food_license_data', adminControllers.singleFoodLicense)
router.post('/single_fresh_passport_data', adminControllers.singleFreshPassport)
router.post('/single_tatkal_passport_data', adminControllers.singleTatkalPassport)
router.post('/single_renewel_passport_data', adminControllers.singleRenewelPassport)
router.post('/single_railway_ticket_data', adminControllers.singleRailwayTicket)
router.post('/single_insurance_data', adminControllers.singleInsurance)
router.post('/delete_msme', adminControllers.deleteMsme)
router.post('/delete_food_license', adminControllers.deleteFoodLicense)
router.post('/delete_fresh_passport', adminControllers.deleteFreshPassport)
router.post('/delete_tatkal_passport', adminControllers.deleteTatkalPassport)
router.post('/delete_renewel_passport', adminControllers.deleteRenewelPassport)
router.post('/delete_railway_ticket', adminControllers.deleteRailwayTicket)
router.post('/delete_insurance', adminControllers.deleteInsurance)
router.post('/msme_document', upload.any('document1', 'document2'), adminControllers.sendMsmeDocument)
router.post('/food_license_document', upload.any('document1', 'document2'), adminControllers.sendFoodLicenseDocument)
router.post('/fresh_passport_document', upload.any('document1', 'document2'), adminControllers.sendFreshPassportDocument)
router.post('/tatkal_passport_document', upload.any('document1', 'document2'), adminControllers.sendTatkalPassportDocument)
router.post('/renewel_passport_document', upload.any('document1', 'document2'), adminControllers.sendRenewelPassportDocument)
router.post('/railway_ticket_document', upload.any('document1', 'document2'), adminControllers.sendRailwayTicketDocument)
router.post('/insurance_document', upload.any('document1', 'document2'), adminControllers.sendInsuranceDocument)
module.exports=router;

