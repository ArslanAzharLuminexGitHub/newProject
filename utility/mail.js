const Joi = require("joi");
const instence = require("../utility/instence")
const encrypt = require("../utility/bcrypt").encrypt;
const response = require("../utility/response").RESPONSE;




/************ MAILING_Function ****************/
const email = async (req,res,HTML,subject,message)=>{
    let nodemailer = require("nodemailer");
    let sender = process.env.app_email;
    let pass = process.env.app_pass;
   
    const { email } = req.body;
    

   
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

                transporter.sendMail(mailOption, async (error, info) => {
                    if (error) {

                        console.log(error)
                    }
                    else {
                        console.log(info);
                        //return res.status(200).json({"Message":message});
                        await response(req,res,
                            responses = message,
                            message = "Success",
                            statusCode = 200
                            );
                    }
                });

                console.log("EMAIL SENT")

            } catch (error) {
                //return res.status(500).json({ "ERROR from email link": `${error}` });
                await response(req,res,
                    responses = error,
                    message = "Failed",
                    statusCode = 500
                    );
            }

            //////////

        }
        else {
            //return res.status(400).json({ "forgotpassLink": `user not found` });
            await response(req,res,
                responses = "User Not Found",
                message = "Failed",
                statusCode = 404
                );
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
            //return res.status(400).json({ "ERROR: Bad Request": `${validation.error}` });
            await response(req,res,
                responses = validation.error,
                message = "Success",
                statusCode = 200
                );
        }
        else {
            const hashForgetPass = await encrypt(newPass)
            let result = await  instence.user.findOneAndUpdate({ email: process.env.user_email }, { password: hashForgetPass });
            if (result) {
                console.log("Pass Updated");
                //return res.status(201).json({ "ALERT: ": `Password RESET Successfully For ${process.env.user_email}` });
                await response(req,res,
                    responses = `Password RESET Successfully For ${process.env.user_email}`,
                    message = "Success",
                    statusCode = 200
                    );
                
            } else {
               // return res.status(500).json({ "ERROR": `forgotpass not done` });
                await response(req,res,
                    responses = "try again Password Not Updated...",
                    message = "Failed",
                    statusCode = 500
                    );
                
            }

        }

    } catch (error) {
        //return res.status(500).json({ "forgotpass": `${error}` });
        await response(req,res,
            responses = error,
            message = "Failed",
            statusCode = 500
            );
    }
};


module.exports = {
    email,
    forgot
}