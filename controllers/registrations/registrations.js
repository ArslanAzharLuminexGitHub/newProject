const Joi = require("joi");

const encrypt = require("../../utility/bcrypt").encrypt;
const compare = require("../../utility/bcrypt").compare;

const instence = require("../../utility/instence");

const mail = require("../../utility/mail").email;
const change_Password = require("../../utility/mail").forgot;




/**************** SIGN_UP **************************/
const signUp = async (req, res) => {
    try {
        
        const {
            fullName,password,email,DOB,gender,address,country,
            province,city,mobileNumber,phoneNumber
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
            return res.status(400).json({ "Bad Request:": `${result.error}` });
        } else {

            try {
                // await manageDoctor(req,res,instence.user()
                let uniqueEmail = await instence.user.findOne({ email });
                if (uniqueEmail) {
                    return res.status(201).json({ "ALERT": `Please Try Different Email` });
                } else {
                    let hashPass = await encrypt(password)
                    let dob = DOB.toString();
                    
                    let userCreated = await instence.user.create({
                        fullName,
                        password: hashPass,
                        email,
                        DOB:dob,
                        gender,
                        address,
                        country,
                        province,
                        city,
                        mobileNumber,
                        phoneNumber,
                        avatar:req.files[0].path,
                        active:false
                    });
                    if (userCreated) {
                        const HTML = process.env.HTML_FOR_SignUp;
                        mail(req,res,HTML,subject="Activation");
                        process.env.SuccessSignUp = email;
                        let uniqueEmail = await instence.user.findOne({ email })
                        return res.status(200).json({ "User Created": uniqueEmail });
                    }
                }
            } catch (error) {
                return res.status(500).json({ "ALERT from signUp": `${error.message}` });
            }


        }

    } catch (error) {
        return res.status(500).json({ "ALERT": `${error.message}` });
    }

}



/**************** Login **************************/
const login = async (req, res) => {

    // await userSchema.deleteMany();

    console.log(req);
    const { email, password } = req.body;
    try {
        let userData = await instence.user.findOne({email:email});
        if (userData) {
            let authenticated = await compare(password, userData.password);
            if (authenticated) {

                let tokenAlreadCreated = await instence.token.findOne({ email: userData.email })

                if (tokenAlreadCreated) {
                    return res.status(500).json({ "ALERT": `The User is already LOGGED iNN` });
                }
                
                else if (userData.active === true) {
                    let jwt = require("jsonwebtoken");
                    const token = await jwt.sign({ email: userData.email }, process.env.key, { expiresIn: "1y" });
    
    
                    let createToken = await instence.token.create({
                        email: userData.email,
                        token: token
                    });
                    if (createToken) {
                        return res.status(200).json({ "ALERT": `Welcome To The Profile ${userData.fullName}` });
                    }
                    else {
                        return res.status(500).json({ "ALERT": `Error in creating token` });
                    }
                } else {
                    return res.status(200).json({ "ALERT": `Please Activate your account first` });
                }
               
            }
            else {
                return res.status(200).json({ "ALERT": `Invalid password` });
            }
        }

    } catch (error) {
        return res.status(200).json({ "ALERT From login": `${error.message}` });
    }

}






/**************** VIEW_PROFILE **************************/
const viewprofile = async (req, res) => {
    try {

        let user = await instence.user.findOne({email:process.env.useremail});
        return res.status(200).json({ "ALERT From View Profile": user });

    } catch (error) {
        return res.status(500).json({ "Error From view Profile": `${error.message}` });
    }
}







/**************** LOGOUT **************************/
const logOut = async (req, res) => {
    try {
        let tokenSchema = require("../../models/tokenSchema");

        let deleted = await tokenSchema.findOneAndDelete({ email: process.env.userEmail });

       if (deleted) {return res.status(200).json({ "ALERT From logOut": `LOG_OUT Success` })}
    
    
    
    } catch (error) {
        return res.status(500).json({ "Error From LogOut": `${error.message}` });
    }
}



const fun = async (req,res) => {
    try {

       
        // await instence.user.deleteMany();
        console.log(req);
       
    } catch (error) {
        return res.status(500).json({ "Error From fun": `${error.message}` });
    }
}






/**************** FORGOT_PASS_LINK **************************/
const forgot_Pass_link = async (req,res) => {
    try {
        
        console.log(req.body.email);
        const HTML = process.env.HTML_FOR_ResetPass;
        mail(req,res,HTML,subject="RESET PASSWORD");
       
    } catch (error) {
        return res.status(500).json({ "forgotpassLink": `${error}` });
    }
};





/**************** FORGOT_PASSWORD **************************/
const forgot_Pass = async (req, res) => {
    try {

        change_Password(req,res);
       
    } catch (error) {
        return res.status(500).json({ "forgotpassLink": `${error}` });
    }
};

const upload = async (req,res)=>{
    try {
        const {fullName,uploads} = req.body;
        console.log("Fullname:"+fullName+" "+"uploads: "+uploads);
    } catch (error) {
        return res.status(500).json({ "alert from upload": `${error}` });
    }
}


const signUpAuthenicationEmail = async (req,res)=>{
    try {
        let userData = await instence.user.findOneAndUpdate({email:process.env.SuccessSignUp},{active:true});
        return res.status(200).json({ "signUpAuthenicationEmail": `${userData.email} is Activated Successfully...` });

    } catch (error) {
        return res.status(500).json({ "alert from upload": `${error}` });
    }
}



const updateProfile = async (req,res)=>{
    try {
        console.log(req);
        if(req.body.password){
            console.log("containing pass");
            let hashpass = await encrypt(req.body.password)
            console.log("Hash: "+hashpass+" type: "+typeof(hashpass));
            req.body.password = hashpass
            let userUpdate = await instence.user.findOneAndUpdate({email:process.env.userEmail},req.body,{
                new : true
            });
            return res.status(200).json({ "UPDATE PROFILE": `${userUpdate}` });
        }
        let userUpdate = await instence.user.findOneAndUpdate({email:process.env.userEmail},req.body,{new:true});
        return res.status(200).json({ "UPDATE PROFILE": `${userUpdate}` });

    } catch (error) {
        return res.status(500).json({ "alert from upload": `${error.message}` });
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
    upload,
    signUpAuthenicationEmail,
    updateProfile
}

