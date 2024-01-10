const express = require('express')
const subadminControllers = require('../controllers/subadmin_controllers')
const router = express();
const auth = require('../middleware/auth');
const multer = require('multer');




const storage = multer.diskStorage({
    destination: "uploads",
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({
    storage: storage,
    fileFilter: function (req, files, callback) {
        if (
            files.mimetype == "image/png" ||
            files.mimetype == "image/jpg" ||
            files.mimetype == "image/jpeg"
        ) {
            callback(null, true)
        } else {
            console.log('only  png , jpg & jpeg file supported')
            callback(null, false)
        }

    },
    limits: {

        filesize: 100000000000 //1000000 bytes=1MB
    }
});
 

//import sub admin controllers files here
router.post('/sub_admin_login',subadminControllers.Sub_Admin_Login);
router.get('/get_accassabledata', subadminControllers.getAccessableData)
router.post('/send_message', subadminControllers.sendMessage);
router.get('/get_message', subadminControllers.getMessage);
router.post('/get_single_pancard_data', subadminControllers.getSinglePancardData)
router.post('/get_single_ayushmancard_data', subadminControllers.getSingleAyushmanCardData)
router.post('/get_single_votercard_data', subadminControllers.getSingleVoterCardData)
router.post('/get_single_labourcard_data', subadminControllers.getSingleLabourCardData)
router.post('/get_single_eshramcard_data', subadminControllers.getSingleEshramCardData)
router.post('/get_single_udidcard_data', subadminControllers.getSingleUdidCardData)
router.post('/aprove_pancard', subadminControllers.approvePancardStatus)
router.post('/aprove_ayushmancard', subadminControllers.approveAyushmanCardStatus)
router.post('/aprove_labourcard', subadminControllers.approveLabourCardStatus)
router.post('/aprove_udidcard', subadminControllers.approveUdidCardStatus)
router.post('/aprove_votercard', subadminControllers.approveVoterCardStatus)
router.post('/aprove_eshramcard', subadminControllers.approveEshramCardStatus)
router.post('/send_otp', subadminControllers.sendOtp)
router.post('/forgot_password', subadminControllers.forgotPassword);
router.post('/single_income_certificate_data', subadminControllers.singleIncomeCertificate);
router.post('/single_domicile_certificate_data', subadminControllers.singleDomicileCertificate);
router.post('/single_cast_certificate_data', subadminControllers.singleCastCertificate);
router.post('/single_pf_withdrawal_data', subadminControllers.singlePfWithdrawal);
router.post('/single_pf_kyc_data', subadminControllers.singlePfKyc);
router.post('/single_pf_nomination_data', subadminControllers.singlePfNomination);
router.post('/single_pf_midtransfer_data', subadminControllers.singlePfMidTransfer);
router.post('/single_police_verification_data', subadminControllers.singlePoliceVerification);
router.post('/single_fir_data', subadminControllers.singleFir);
router.post('/single_lost_report_data', subadminControllers.singleLostReport);
router.post('/single_aadhar_address_data', subadminControllers.singleAadharAddress);
router.post('/single_ayushman_address_data', subadminControllers.singleAyushmanAddress);
router.post('/single_up_rationcard_data', subadminControllers.singleUpRationCard);
 
router.post('/single_pancard_correction_data', subadminControllers.singlePancardCorrection);
router.post('/single_other_form_data', subadminControllers.singleOtherForm);
router.post('/approve_income_certificate', subadminControllers.approveIncomeCertificate);
router.post('/approve_domicile_certificate', subadminControllers.approveDomicileCertificate);
router.post('/approve_cast_certificate', subadminControllers.approveCastCertificate);
router.post('/approve_pfwithdrawal', subadminControllers.approvePfWithdrawal);
router.post('/approve_pfkyc', subadminControllers.approvePfKyc);
router.post('/approve_pfnomination', subadminControllers.approvePfNomination);
router.post('/approve_pfmidtransfer', subadminControllers.approvePfMidTransfer);
router.post('/approve_police_verification', subadminControllers.approvePoliceVerification);
router.post('/approve_fir', subadminControllers.approveFir);
router.post('/approve_lostreport', subadminControllers.approveLostReport);
router.post('/approve_aadhar_address', subadminControllers.approveAadharAddress);
router.post('/approve_ayushman_address', subadminControllers.approveAyushmanAddress);
router.post('/approve_up_rationcard', subadminControllers.approveUpRationCard);
router.post('/approve_pancard_correction', subadminControllers.approvePancardCorrection);
router.post('/approve_other_form', subadminControllers.approveOtherForm);
router.post('/single_msme_data', subadminControllers.singleMsme)
router.post('/single_food_license_data', subadminControllers.singleFoodLicense)
router.post('/single_fresh_passport_data', subadminControllers.singleFreshPassport)
router.post('/single_tatkal_passport_data', subadminControllers.singleTatkalPassport)
router.post('/single_renewel_passport_data', subadminControllers.singleRenewelPassport)
router.post('/single_railway_ticket_data', subadminControllers.singleRailwayTicket)
router.post('/single_insurance_data', subadminControllers.singleInsurance)
router.post('/approve_msme', subadminControllers.approveMsme)
router.post('/approve_food_license', subadminControllers.approveFoodLicense)
router.post('/approve_fresh_passport', subadminControllers.approveFreshPassport)
router.post('/approve_tatkal_passport', subadminControllers.approveTatkalPassport)
router.post('/approve_renewel_passport', subadminControllers.approveRenewelPassport)
router.post('/approve_railway_ticket', subadminControllers.approveRailwayTicket)
router.post('/approve_insurance', subadminControllers.approveInsurance)
router.post('/pancard_document', upload.any('document1', 'document2'), subadminControllers.sendPancardDocument)
router.post('/votercard_document', upload.any('document1', 'document2'), subadminControllers.sendVotercardDocument)
router.post('/labourcard_document', upload.any('document1', 'document2'), subadminControllers.sendLabourcardDocument)
router.post('/udidcard_document', upload.any('document1', 'document2'), subadminControllers.sendUdidcardDocument)
router.post('/ayushmancard_document', upload.any('document1', 'document2'), subadminControllers.sendAyushmancardDocument)
router.post('/eshramcard_document', upload.any('document1', 'document2'), subadminControllers.sendEshramcardDocument)
router.post('/income_document', upload.any('document1', 'document2'), subadminControllers.sendIncomeDocument)
router.post('/domicile_document', upload.any('document1', 'document2'), subadminControllers.sendDomicileDocument)
router.post('/cast_document', upload.any('document1', 'document2'), subadminControllers.sendCastDocument)
router.post('/pfwithdrawal_document', upload.any('document1', 'document2'), subadminControllers.sendPfWithdrawalDocument)
router.post('/pfkyc_document', upload.any('document1', 'document2'), subadminControllers.sendPfKycDocument)
router.post('/pfnomination_document', upload.any('document1', 'document2'), subadminControllers.sendPfNominationDocument)
router.post('/pfmidtransfer_document', upload.any('document1', 'document2'), subadminControllers.sendPfMidTransferDocument)
router.post('/police_verification_document', upload.any('document1', 'document2'), subadminControllers.sendPoliceVerificationDocument)
router.post('/fir_document', upload.any('document1', 'document2'), subadminControllers.sendFirDocument)
router.post('/lostreport_document', upload.any('document1', 'document2'), subadminControllers.sendLostReportDocument)
router.post('/aadhar_address_document', upload.any('document1', 'document2'), subadminControllers.sendAadharAddressDocument)
router.post('/ayushman_address_document', upload.any('document1', 'document2'), subadminControllers.sendAyushmanAddressDocument)
router.post('/up_rationcard_document', upload.any('document1', 'document2'), subadminControllers.sendUpRationcardDocument)
router.post('/pancard_correction_document', upload.any('document1', 'document2'), subadminControllers.sendPancardCorrectionDocument)
router.post('/other_form_document', upload.any('document1', 'document2'), subadminControllers.sendOtherFormDocument)
router.post('/msme_document', upload.any('document1', 'document2'), subadminControllers.sendMsmeDocument)
router.post('/food_license_document', upload.any('document1', 'document2'), subadminControllers.sendFoodLicenseDocument)
router.post('/fresh_passport_document', upload.any('document1', 'document2'), subadminControllers.sendFreshPassportDocument)
router.post('/tatkal_passport_document', upload.any('document1', 'document2'), subadminControllers.sendTatkalPassportDocument)
router.post('/renewel_passport_document', upload.any('document1', 'document2'), subadminControllers.sendRenewelPassportDocument)
router.post('/railway_ticket_document', upload.any('document1', 'document2'), subadminControllers.sendRailwayTicketDocument)
router.post('/insurance_document', upload.any('document1', 'document2'), subadminControllers.sendInsuranceDocument)
router.post('/per_day_pending_data', subadminControllers.perdayPending);


module.exports = router
