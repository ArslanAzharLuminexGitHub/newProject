const Joi = require("joi");
const instence = require("../utility/instence")
const encrypt = require("../utility/bcrypt").encrypt;




/************ MAILING_Function ****************/
const email = async (req,res,HTML,subject)=>{
    let nodemailer = require("nodemailer");
    let sender = process.env.app_email;
    let pass = process.env.app_pass;
   
    console.log(req.body.email);
    const { email } = req.body;
    let EMAIL = {};
    EMAIL.email = req.body.email
    console.log(typeof(EMAIL));

    let value = Joi.object({
        email: Joi.string().required(),
    });
    let result = value.validate(EMAIL);
    if (result.error) {
        return res.status(406).json({ "Error Validation":`${result.error}` });
    }
    else {
        const userFound = await instence.user.findOne({ email: email });
        if (userFound) {
            process.env.user_email = userFound.email;
            console.log("Email From Link: " + process.env.user_email);
            try {
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: sender,       //enter email from email will be send
                        pass: pass         //enter your email's password
                    }
                });
                
                
                
               /************ MAIL_Portion ****************/

                var mailOption = {
                    to: email,
                    subject: subject,
                    html:HTML,
                
                };

                transporter.sendMail(mailOption, (error, info) => {
                    if (error) {

                        console.log(error)
                    }
                    else {
                        console.log(`Email sent:${info.response}`);
                    }
                });

                console.log("EMAIL SENT")

            } catch (error) {
                return res.status(500).json({ "ERROR from email link": `${error}` });
            }

            //////////

        }
        else {
            return res.status(400).json({ "forgotpassLink": `user not found` });
        }



    }
}




/************ CHANGE_PASSWORD_Function ****************/
const forgot =  async (req, res) => {
    try {



        const { newPass } = req.body;
        console.log("Email From forgetPassword: " + process.env.user_email);
        var value = Joi.object({
            newPass: Joi.string().min(6).max(25).required(),
        });
        let validation = value.validate(req.body);
        if (validation.error) {
            return res.status(400).json({ "ERROR: Bad Request": `${validation.error}` });
        }
        else {
            const hashForgetPass = await encrypt(newPass)
            let result = await  instence.user.findOneAndUpdate({ email: process.env.user_email }, { password: hashForgetPass });
            if (result) {
                console.log("Pass Updated");
                return res.status(201).json({ "ALERT: ": `Password Updated Successfully For ${process.env.user_email}` });
            } else {
                return res.status(500).json({ "ERROR": `forgotpass not done` });
            }

        }

    } catch (error) {
        return res.status(500).json({ "forgotpass": `${error}` });
    }
};


module.exports = {
    email,
    forgot
}