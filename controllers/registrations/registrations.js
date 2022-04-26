const Joi = require("joi");
const key = process.env.key || "key"

const encrypt = require("../../utility/bcrypt").encrypt;
const compare = require("../../utility/bcrypt").compare;

const instence = require("../../utility/instence");
const jwt = require("../../utility/jwt");

const mail = require("../../utility/mail").email;
const change_Password = require("../../utility/mail").forgot;
const response = require("../../utility/response").RESPONSE;



/**************** SIGN_UP **************************/
const signUp = async (req, res) => {
    try {

        const {
            fullName, password, email, DOB, gender, address, country,
            province, city, mobileNumber, phoneNumber
        } = req.body;
        console.log(req.body);

        var value = Joi.object({
            fullName: Joi.string().min(2).max(255).required(),
            password: Joi.string().min(6).max(25).required(),
            email: Joi.string().min(2).max(255).required(),
            DOB: Joi.string().min(2).max(255).required(),
            gender: Joi.string().min(2).max(255).required(),
            address: Joi.string().min(2).max(255).required(),
            country: Joi.string().min(2).max(255).required(),
            province: Joi.string().min(2).max(255).required(),
            city: Joi.string().min(2).max(255).required(),
            mobileNumber: Joi.string().min(2).max(255).required(),
            phoneNumber: Joi.string().min(10).max(11).required(),


        });
        let result = value.validate(req.body);
        if (result.error) {
            //return res.status(400).json({ "Bad Request:": `${result.error}` });
            await response(req, res, responses = result.error.details[0].message, message = "Success", statusCode = 200);
        } else {

            try {
                // await manageDoctor(req,res,instence.user()
                let uniqueEmail = await instence.user.findOne({ email });
                console.log(uniqueEmail);
                if (uniqueEmail) {
                    await response(req, res,
                        responses = "Plesae Try Different Email",
                        message = "Success",
                        statusCode = 201
                    );

                    //return res.status(200).json({ "ALERT": `Please Try Different Email` });
                } else {
                    console.log("after");
                    let hashPass = await encrypt(password)
                    process.env.SuccessSignUp = email;

                    let userCreated = await instence.user.create({
                        fullName,
                        password: hashPass,
                        email,
                        DOB,
                        gender,
                        address,
                        country,
                        province,
                        city,
                        mobileNumber,
                        phoneNumber,
                        avatar: req.files[0].path
                    });
                    if (userCreated) {
                        const HTML = process.env.HTML_FOR_SignUp;
                        mail(req, res, HTML, subject = "Activation", message = process.env.EMAIL_SENT_MESSAGE_ACTIVATION);
                    }
                }
            } catch (error) {
                await response(req, res,
                    responses = error,
                    message = "BAD GATEWAY",
                    statusCode = 502
                );
                // return res.status(500).json({ "ERROR from signUp": `${error.message}` });
            }


        }

    } catch (error) {
        await response(req, res,
            responses = error,
            message = "Server Error",
            statusCode = 500
        );
    }

}


/**************** Login **************************/
const login = async (req, res) => {


    const { email, password } = req.body;
    try {
        let userData = await instence.user.findOne({ email: email });
        if (userData) {
            let authenticated = await compare(password, userData.password);
            if (authenticated) {

                let tokenAlreadCreated = await instence.token.findOne({ email: userData.email })

                if (tokenAlreadCreated) {
                    //return res.status(208).json({ "ALERT": `The User is already LOGGED iNN` });
                    await response(req, res,
                        responses = `The User is already LOGGED iNN`,
                        message = "Success",
                        statusCode = 200
                    );
                }

                else if (userData.active === true) {

                    const token = await jwt.sign({ email: userData.email }, key , { expiresIn: "1y" });


                    let createToken = await instence.token.create({
                        email: userData.email,
                        token: token
                    });
                    if (createToken) {
                        //return res.status(201).json({ "ALERT": `Welcome To The Profile ${userData.fullName}` });
                        await response(req, res,
                            responses = userData,
                            message = "Success",
                            statusCode = 200
                        );
                    }
                    else {
                        //return res.status(500).json({ "ALERT": `Error in creating token` });
                        await response(req, res,
                            responses = `Error in creating token`,
                            message = "BAD GATEWAY",
                            statusCode = 502
                        );
                    }
                } else {
                    //return res.status(511).json({ "ALERT": `Please Activate your account first` });
                    await response(req, res,
                        responses = `Please Activate your account first`,
                        message = "Authorization Error",
                        statusCode = 401
                    );


                }

            }
            else {
                //return res.status(406).json({ "ALERT": `Invalid password` });
                await response(req, res,
                    responses = `Invalid password`,
                    message = "Authorization Error",
                    statusCode = 401
                );
            }
        }

    } catch (error) {
        //return res.status(500).json({ "ALERT From login": `${error.message}` });
        await response(req, res,
            responses = error.message,
            message = "Server Error",
            statusCode = 500
        );
    }

}






/**************** VIEW_PROFILE **************************/
const viewprofile = async (req, res) => {
    try {

        let user = await instence.user.findOne({ email: process.env.useremail });
        //return res.status(200).json({ "ALERT From View Profile": user });
        await response(req, res,
            responses = user,
            message = "Success",
            statusCode = 201
        );

    } catch (error) {
        //return res.status(500).json({ "Error From view Profile": `${error.message}` });
        await response(req, res,
            responses = error.message,
            message = "Server Error",
            statusCode = 500
        );
    }
}







/**************** LOGOUT **************************/
const logOut = async (req, res) => {
    try {

        let deleted = await instence.token.findOneAndDelete({ email: process.env.userEmail });
        if (deleted) {
            //return res.status(200).json({ "ALERT From logOut": `LOG_OUT Success` });
            await response(req, res,
                responses = `LOG_OUT Success`,
                message = "Success",
                statusCode = 200
            );
        }
        else {
            //return res.status(500).json({ "Logout DataBase Error": `Token Not Deleted` });
            await response(req, res,
                responses = `Token Not Deleted`,
                message = "BAD GATEWAY",
                statusCode = 502
            );

        }

    } catch (error) {
        // return res.status(500).json({ "Error From LogOut": `${error.message}` });
        await response(req, res,
            responses = error,
            message = "Server Error",
            statusCode = 500
        );
    }
}



const fun = async (req, res) => {
    try {

        //await instence.user.deleteMany();
        var path = require('path');
        var filename = path.relative('/Users/Refsnes/demo_path.js','/Users/Refsnes/demo_path.js');
        console.log(filename);
        await response(req, res, responses = filename, message = "fun Iworking", statusCode = 200);

        //return res.header("x-token","theHeaderToken").status(200).json({"Response":"DONE"});

    } catch (error) {
        response(req, res, responses = error.message, message = "fun Iworking", statusCode = 500);
        //return res.status(500).json({ "Error From fun": `${error.message}` });
    }
}






/**************** FORGOT_PASS_LINK **************************/
const forgot_Pass_link = async (req, res) => {
    try {

        let { email } = req.body;
        console.log(email);
        let foundTheUser = await instence.user.findOne({ email: email });
        console.log(foundTheUser)
        if (foundTheUser) {
            const HTML = process.env.HTML_FOR_ResetPass;
            mail(req, res, HTML, subject = "RESET PASSWORD", message = process.env.EMAIL_SENT_MESSAGE_RESET);
        }


        else if (foundTheUser === null) {
            //return res.status(404).json({ "User is Not Registered": `Please Register you Account First` });
            await response(req, res,
                responses = `Please Register you Account First`,
                message = "FAILED",
                statusCode = 404
            );
        }


    } catch (error) {
        // return res.status(500).json({ "error from forgotpassLink": error });
        await response(req, res,
            responses = error,
            message = "Server Error",
            statusCode = 500
        );
    }
};





/**************** FORGOT_PASSWORD **************************/
const forgot_Pass = async (req, res) => {
    try {

        change_Password(req, res);

    } catch (error) {
        //return res.status(500).json({ "forgotpassLink": `${error}` });
        await response(req, res,
            responses = error,
            message = "Server Error",
            statusCode = 500
        );
    }
};






/**************** SignUp_Authenication_Email **************************/
const signUpAuthenicationEmail = async (req, res) => {
    try {
        let userData = await instence.user.findOneAndUpdate({ email: process.env.SuccessSignUp }, { active: true });
        // return res.status(200).json({ "signUpAuthenicationEmail": `${userData.email} is Activated Successfully...` });
        await response(req, res,
            responses = `${userData.email} is Activated Successfully...`,
            message = "Success",
            statusCode = 201
        );

    } catch (error) {
        // return res.status(500).json({ "ALERT From SignUp_Authenication_Email": error });
        await response(req, res,
            responses = error,
            message = "Failed",
            statusCode = 500
        );

    }
}






/**************** User_UpDate_Profile **************************/
const updateProfile = async (req, res) => {
    try {
        if (req.body.password) {
            console.log("containing pass");
            let hashpass = await encrypt(req.body.password)
            console.log("Hash: " + hashpass + " type: " + typeof (hashpass));
            req.body.password = hashpass
            let userUpdate = await instence.user.findOneAndUpdate({ email: process.env.userEmail }, req.body, {
                new: true
            });
            //return res.status(200).json({ "UPDATE PROFILE": `${userUpdate}` });
            await response(req, res,
                responses = userUpdate,
                message = "Success",
                statusCode = 200
            );
        }
        else if (req.body) {
            let userUpdate = await instence.user.findOneAndUpdate({ email: process.env.userEmail }, req.body, { new: true });
            //return res.status(200).json({ "UPDATE PROFILE": userUpdate });
            await response(req, res,
                responses = userUpdate,
                message = "Success",
                statusCode = 200
            );
        }

    } catch (error) {
        //return res.status(500).json({ "alert from upload": `${error.message}` });
        await response(req, res,
            responses = error,
            message = "Server Error",
            statusCode = 500
        );
    }
}



module.exports = {
    signUp,
    login,
    viewprofile,
    logOut,
    fun,
    forgot_Pass_link,
    forgot_Pass,
    signUpAuthenicationEmail,
    updateProfile
}


































// const upload = async (req, res) => {
//     try {
//         const { fullName, uploads } = req.body;
//         console.log("Fullname:" + fullName + " " + "uploads: " + uploads);
//     } catch (error) {
//         return res.status(500).json({ "alert from upload": `${error}` });
//     }
// }