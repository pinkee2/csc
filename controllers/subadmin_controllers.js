var nodemailer = require('nodemailer');
const AyushmanCard_Model = require("../models/ayushmancard_models");
const EshramCard_Model = require("../models/esharamcard_models");
const jwt = require("jsonwebtoken");
const SubAdmin=require('../models/sub_admin_models');
const LabourCard_Model = require("../models/labourcard_models");
const PanCard_Model = require("../models/pancard_models");
const subAdminModel = require("../models/sub_admin_models");
const UdidCard_Model = require("../models/udidcard_models");
const VoterID_Model = require("../models/voterid_models");
const chatModel = require("../models/chat_models");
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
const pancardCorrectionModel = require('../models/pancard_correction_models');
const otherFormModel = require('../models/other_form_models');
const foodLicenseModel = require('../models/food_license_models');
const freshPassportModel = require('../models/fresh_passport_models');
const tatkalPassportModel = require('../models/tatkal_passport_models');
const renewelPassportModel = require('../models/renewel_passport_models');
const railwayTicketModel = require('../models/railway_ticket_models');
const insuranceModel = require('../models/insurance_models');
const msmeModel = require('../models/msme_models');
const queryBoxModel = require('../models/query_box_models');

const JWT_SECRET_KEY = 'gfg_jwt_secret_key';
const TOKEN_KEY = 'gfg_token_header_key';


//create sub admin login api
 const Sub_Admin_Login =async(req,res)=>{
    const {email,password} =req.body;

    try{ 
        if(email && password){ 
            const sub_admin = await SubAdmin.findOne({email:email,password:password});
           
            if(sub_admin){
                const _id = sub_admin._id
                const token = jwt.sign({_id: sub_admin._id, email },TOKEN_KEY,{expiresIn: "1h",});
                const sub_admin_data = await SubAdmin.findByIdAndUpdate({_id:_id},{$set:{token}},{new:true});
                res.status(200).json({
                    result:'true',
                    msg:'sub admin successfully login..',
                    //data:admin_data
                    data:{
                    _id:sub_admin_data._id,
                    email:sub_admin_data.email,
                    password:sub_admin_data.password,
                    token:sub_admin_data.token
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


const getAccessableData = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ result: "false", msg: "Email parameter required" });
        }

        const subAdmin = await subAdminModel.findOne({ email });

        if (!subAdmin) {
            return res.status(400).json({ result: "false", msg: "Record not found" });
        }

        const data = {};
        let allData = []
        const fetchAndAssignData = async (key, model) => {
            const modelData = await model.find();
            data[key] = modelData;
             allData = [...allData, ...modelData]
        };
         
        const access = subAdmin.access;

        const modelMap = {
            pancard: PanCard,
            votercard: VoterCard,
            udidcard: UdidCard,
            labourcard: LabourCard,
            ayushmancard: AyushmanCard,
            eshramcard: EshramCard,
            income: incomeCertificateModel,
            cast: castCertificateModel,
            domicile: domicileCertificateModel,
            pfwithdrawal: pfWithdrawalModel,
            pfkyc: pfKycModel,
            pfnomination: pfNominationModel,
            pfmidtransfer: pfMidTransferModel,
            policeverification: policeVerificationModel,
            fir: firModel,
            lostreport: lostReportModel,
            aadharaddress: aadharAddressModel,
            ayushmanaddress: ayushmanAddressModel,
            uprationcard: upRationCardModel,
            pancardcorrection: pancardCorrectionModel,
            otherform: otherFormModel,
            msme: msmeModel,
            foodlicense: foodLicenseModel,
            freshpassport: freshPassportModel,
            tatkalpassport: tatkalPassportModel,
            renewelpassport: renewelPassportModel,
            railwayticket: railwayTicketModel,
            insurance: insuranceModel
        };

        for (const key of access) {
            const model = modelMap[key];

            if (model) {
                await fetchAndAssignData(key, model);
            }
        }

        const approveData = allData.filter(items => items.approve_status == 1)
        const pendingData = allData.filter(items => items.approve_status == 0)
        res.status(200).json({ result: "true", msg: "Access data get successfully", data: data, allData: allData.length, approveData: approveData.length, pendingData: pendingData.length });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ result: "false", msg: "Internal server error" });
    }
};

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

// get single pancard data
const getSinglePancardData = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const panCardData = await PanCard_Model.findById({ _id: _id })
            if (!panCardData || panCardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                res.status(200).json({ result: "true", msg: "pancard data get success", data: panCardData })
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

// approve pancard status
const approvePancardStatus = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const pancardData = await PanCard_Model.findById({ _id: _id })
         
            if (!pancardData || pancardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (pancardData.approve_status == 1) {
                    const aproveData = await PanCard_Model.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "pancard data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await PanCard_Model.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "pancard data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}
// approve ayushman card status
const approveAyushmanCardStatus = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const ayushmancardData = await AyushmanCard_Model.findById({ _id })
            if (!ayushmancardData || ayushmancardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (ayushmancardData.approve_status == 1) {
                    const aproveData = await AyushmanCard_Model.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "ayushman card data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await AyushmanCard_Model.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "ayushman card data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}
// approve labour card status
const approveLabourCardStatus = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const labourcardData = await LabourCard_Model.findById({ _id })
            if (!labourcardData || labourcardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (labourcardData.approve_status == 1) {
                    const aproveData = await LabourCard_Model.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "labour card data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await LabourCard_Model.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "labour card data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}
// approve udid card status
const approveUdidCardStatus = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const udidcardData = await UdidCard_Model.findById({ _id })
            if (!udidcardData || udidcardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (udidcardData.approve_status == 1) {
                    const aproveData = await UdidCard_Model.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "udid card data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await UdidCard_Model.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "udid card data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}
// approve eshram card status
const approveEshramCardStatus = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const eshramcardData = await EshramCard_Model.findById({ _id })
            if (!eshramcardData || eshramcardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (eshramcardData.approve_status == 1) {
                    const aproveData = await EshramCard_Model.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "eshram card data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await EshramCard_Model.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "eshram card data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}
// approve eshram card status
const approveVoterCardStatus = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const votercardData = await VoterID_Model.findById({ _id })
            if (!votercardData || votercardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (votercardData.approve_status == 1) {
                    const aproveData = await VoterID_Model.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "voter card data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await VoterID_Model.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "voter card data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}

// send otp for forget password
const sendOtp = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(400).json({ result: "false", msg: "email parameter require" })
        }
        const subAdminData = await subAdminModel.findOne({ email: email })
        if (!subAdminData) {
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
                await subAdminModel.findOneAndUpdate({ email: email }, { otp: otp })
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

        const data = await subAdminModel.findOne({ email: email })
        if (!data) {
            return res.status(400).json({ result: "false", msg: "record not found" })
        }

        if (data.otp != otp) {
            return res.status(400).json({ result: "false", msg: "worng otp" })
        }

        const subAdminData = await subAdminModel.findOneAndUpdate({ email: email }, { password: password }, { new: true })


        res.status(200).json({ result: "true", msg: "password forget successfull", data: subAdminData })

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


// approve income certificate status
const approveIncomeCertificate = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const incomeCertificateData = await incomeCertificateModel.findById({ _id })
            if (!incomeCertificateData || incomeCertificateData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (incomeCertificateData.approve_status == 1) {
                    const aproveData = await incomeCertificateModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "income certificate data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await incomeCertificateModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "income certificate data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve domicile certificate status
const approveDomicileCertificate = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const domicileCertificateData = await domicileCertificateModel.findById({ _id })
            if (!domicileCertificateData || domicileCertificateData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (domicileCertificateData.approve_status == 1) {
                    const aproveData = await domicileCertificateModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "domicile certificate data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await domicileCertificateModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "domicile certificate data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve cast certificate status
const approveCastCertificate = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const castCertificateData = await castCertificateModel.findById({ _id })
            if (!castCertificateData || castCertificateData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (castCertificateData.approve_status == 1) {
                    const aproveData = await castCertificateModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "cast certificate data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await castCertificateModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "cast certificate data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve pf withdrawal status
const approvePfWithdrawal = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const pfWithdrawalData = await pfWithdrawalModel.findById({ _id })
            if (!pfWithdrawalData || pfWithdrawalData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (pfWithdrawalData.approve_status == 1) {
                    const aproveData = await pfWithdrawalModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "pf withdrawal data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await pfWithdrawalModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "pf withdrawal data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve pf kyc status
const approvePfKyc = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const pfKycData = await pfKycModel.findById({ _id })
            if (!pfKycData || pfKycData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (pfKycData.approve_status == 1) {
                    const aproveData = await pfKycModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "pf kyc data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await pfKycModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "pf kyc data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve pf nomination status
const approvePfNomination = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const pfNominationData = await pfNominationModel.findById({ _id })
            if (!pfNominationData || pfNominationData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (pfNominationData.approve_status == 1) {
                    const aproveData = await pfNominationModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "pf nomination data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await pfNominationModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "pf nomination data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve pf midtransfer status
const approvePfMidTransfer = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const pfMidTransferData = await pfMidTransferModel.findById({ _id })
            if (!pfMidTransferData || pfMidTransferData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (pfMidTransferData.approve_status == 1) {
                    const aproveData = await pfMidTransferModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "pf mid transfer data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await pfMidTransferModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "pf mid transfer data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve police verification status
const approvePoliceVerification = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const policeVerificationData = await policeVerificationModel.findById({ _id })
            if (!policeVerificationData || policeVerificationData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (policeVerificationData.approve_status == 1) {
                    const aproveData = await policeVerificationModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "police verification data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await policeVerificationModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "police verification data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve fir status
const approveFir = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const firData = await firModel.findById({ _id })
            if (!firData || firData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (firData.approve_status == 1) {
                    const aproveData = await firModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "fir data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await firModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "fir data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve lost report status
const approveLostReport = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const lostReportData = await lostReportModel.findById({ _id })
            if (!lostReportData || lostReportData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (lostReportData.approve_status == 1) {
                    const aproveData = await lostReportModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "lost report data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await lostReportModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "lost report data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve aadhar address status
const approveAadharAddress = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const aadharAddressData = await aadharAddressModel.findById({ _id })
            if (!aadharAddressData || aadharAddressData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (aadharAddressData.approve_status == 1) {
                    const aproveData = await aadharAddressModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "aadhar address data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await aadharAddressModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "aadhar address data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve ayushman address status
const approveAyushmanAddress = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const ayushmanAddressData = await ayushmanAddressModel.findById({ _id })
            if (!aadharAddressData || aadharAddressData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (aadharAddressData.approve_status == 1) {
                    const aproveData = await ayushmanAddressModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "ayushman address data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await ayushmanAddressModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "ayushman address data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve up rationcard status
const approveUpRationCard = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const upRationCardData = await upRationCardModel.findById({ _id })
            if (!upRationCardData || upRationCardData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (upRationCardData.approve_status == 1) {
                    const aproveData = await upRationCardModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "up rationcard  data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await upRationCardModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "up rationcard data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve pancard correction status
const approvePancardCorrection = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const pancardCorrectionData = await pancardCorrectionModel.findById({ _id })
            if (!pancardCorrectionData || pancardCorrectionData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (pancardCorrectionData.approve_status == 1) {
                    const aproveData = await pancardCorrectionModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "pancard correction data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await pancardCorrectionModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "pancard correction data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve other form  status
const approveOtherForm = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const otherFormData = await otherFormModel.findById({ _id })
            if (!otherFormData || otherFormData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (otherFormData.approve_status == 1) {
                    const aproveData = await otherFormModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "other form data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await otherFormModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "other form data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
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



// approve other form  status
const approveMsme = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const msmeData = await msmeModel.findById({ _id })
            if (!msmeData || msmeData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (msmeData.approve_status == 1) {
                    const aproveData = await msmeModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "msme data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await msmeModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "msme  data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve food license  status
const approveFoodLicense = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const foodLicenseData = await foodLicenseModel.findById({ _id })
            if (!foodLicenseData || foodLicenseData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (foodLicenseData.approve_status == 1) {
                    const aproveData = await foodLicenseModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "food license data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await foodLicenseModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "food license  data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve fresh passport  status
const approveFreshPassport = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const freshPassportData = await freshPassportModel.findById({ _id })
            if (!freshPassportData || freshPassportData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (freshPassportData.approve_status == 1) {
                    const aproveData = await freshPassportModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "fresh passport data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await freshPassportModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "fresh passport  data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}



// approve tatkal passport  status
const approveTatkalPassport = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const tatkalPassportData = await tatkalPassportModel.findById({ _id })
            if (!tatkalPassportData || tatkalPassportData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (tatkalPassportData.approve_status == 1) {
                    const aproveData = await tatkalPassportModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "tatkal passport data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await tatkalPassportModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "tatkal passport  data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}



// approve renewel passport  status
const approveRenewelPassport = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const renewelPassportData = await renewelPassportModel.findById({ _id })
            if (!renewelPassportData || renewelPassportData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (renewelPassportData.approve_status == 1) {
                    const aproveData = await renewelPassportModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "renewel passport data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await renewelPassportModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "renewel passport  data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve railway ticket  status
const approveRailwayTicket = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const railwayTicketData = await railwayTicketModel.findById({ _id })
            if (!railwayTicketData || railwayTicketData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (railwayTicketData.approve_status == 1) {
                    const aproveData = await railwayTicketModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "railway ticket data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await railwayTicketModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "railway ticket  data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
        }
    } catch (error) {
        console.log(error)
    }
}


// approve insurance   status
const approveInsurance = async (req, res) => {
    try {
        const { _id } = req.body
        if (_id) {
            const insuranceData = await insuranceModel.findById({ _id })
            if (!insuranceData || insuranceData.length == 0) {
                res.status(400).json({ result: "false", msg: "record not found" })
            } else {
                if (insuranceData.approve_status == 1) {
                    const aproveData = await insuranceModel.findByIdAndUpdate({ _id: _id }, { approve_status: 0 }, { new: true })
                    res.status(200).json({ result: "true", msg: "insurance data un approved successfully", data: aproveData })
                } else {
                    const aproveData = await insuranceModel.findByIdAndUpdate({ _id: _id }, { approve_status: 1 }, { new: true })
                    res.status(200).json({ result: "true", msg: "insurance data approved successfully", data: aproveData })
                }
            }
        } else {
            res.status(400).json({ result: "false", msg: "parameter require _id" })
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

            const data = await PanCard.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
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

            const data = await VoterCard.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
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

        const getData = await AyushmanCard.findOne({ _id: _id, user_id: user_id })

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

            const data = await AyushmanCard.findOneAndUpdate({ _id: _id, user_id: user_id }, { $set: updateFields }, { new: true })
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

// get perday pending data 
const perdayPending = async (req, res) => {
    try {

        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ result: "false", msg: "email parameter required" });
        }

        const subAdmin = await subAdminModel.findOne({ email });

        if (!subAdmin) {
            return res.status(400).json({ result: "false", msg: "Record not found" });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let allData = []
        const fetchAndAssignData = async (key, model) => {
            const modelData = await model.find({
                "createdAt": {
                    $gte: today,
                    $lt: new Date(today.getTime() + 24 * 60 *  60 * 1000)
                }, approve_status: 0
            });
            allData = [...allData, ...modelData]

        };
        const access = subAdmin.access;
        const modelMap = {
            pancard: PanCard,
            votercard: VoterCard,
            udidcard: UdidCard,
            labourcard: LabourCard,
            ayushmancard: AyushmanCard,
            eshramcard: EshramCard,
            income: incomeCertificateModel,
            cast: castCertificateModel,
            domicile: domicileCertificateModel,
            pfwithdrawal: pfWithdrawalModel,
            pfkyc: pfKycModel,
            pfnomination: pfNominationModel,
            pfmidtransfer: pfMidTransferModel,
            policeverification: policeVerificationModel,
            fir: firModel,
            lostreport: lostReportModel,
            aadharaddress: aadharAddressModel,
            ayushmanaddress: ayushmanAddressModel,
            uprationcard: upRationCardModel,
            pancardcorrection: pancardCorrectionModel,
            otherform: otherFormModel,
            msme: msmeModel,
            foodlicense: foodLicenseModel,
            freshpassport: freshPassportModel,
            tatkalpassport: tatkalPassportModel,
            renewelpassport: renewelPassportModel,
            railwayticket: railwayTicketModel,
            insurance: insuranceModel
        };

        for (const key of access) {
            const model = modelMap[key];

            if (model) {
                await fetchAndAssignData(key, model);
            }
        }


        res.status(200).json({ result: "true", msg: "per day data get success", perdayPendingData: allData.length })

    } catch (error) {
        console.log(error)
        res.status(500).json({ result: "false", msg: "Internel Server Error" })
    }
}



module.exports = { 
    Sub_Admin_Login,
    getAccessableData,
    sendMessage,  
    getMessage,
    getSinglePancardData,
    getSingleAyushmanCardData,
    getSingleVoterCardData,
    getSingleLabourCardData,
    getSingleEshramCardData,
    getSingleUdidCardData,
    approvePancardStatus,
    approveAyushmanCardStatus,
    approveLabourCardStatus,
    approveUdidCardStatus,
    approveEshramCardStatus,
    approveVoterCardStatus,
    sendOtp,
    forgotPassword,
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
    approveIncomeCertificate,
    approveDomicileCertificate,
    approveCastCertificate,
    approvePfWithdrawal,
    approvePfKyc,
    approvePfNomination,
    approvePfMidTransfer,
    approvePoliceVerification,
    approveFir,
    approveLostReport,
    approveAadharAddress,
    approveAyushmanAddress,
    approveUpRationCard,
    approvePancardCorrection,
    approveOtherForm,
    singleMsme,
    singleFoodLicense,
    singleFreshPassport,
    singleTatkalPassport,
    singleRenewelPassport,
    singleRailwayTicket,
    singleInsurance,
    approveMsme,
    approveFoodLicense,
    approveFreshPassport,
    approveTatkalPassport,
    approveRenewelPassport,
    approveRailwayTicket,
    approveInsurance,
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
    sendMsmeDocument,
    sendFoodLicenseDocument,
    sendFreshPassportDocument,
    sendTatkalPassportDocument,
    sendRenewelPassportDocument,
    sendRailwayTicketDocument,
    sendInsuranceDocument,
    perdayPending
}