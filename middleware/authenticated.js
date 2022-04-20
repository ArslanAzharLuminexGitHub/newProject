const authenticated_user = async (req,res,next)=>{
    let header = req.headers["authorization"];
    let token = header && header.split(" ")[1];
    if (token) {
        console.log("Token :"+ token);
        let jwt = require("jsonwebtoken");
        
        jwt.verify(token,process.env.key,async (err,user)=>{
            
            if(err){return res.status(500).json({ "ERROR AUTH TOKEN": err });}
            else{
                let userSchema = require("../models/userSchema");
                let tokenSchema = require("../models/tokenSchema");
                console.log(user);
                let data = await userSchema.findOne({email:user.email});
                let tokenData = await tokenSchema.findOne({email:user.email});
                if(tokenData){
                    if (data.active === true && tokenData) {
                        console.log("auth: "+data.active);
                        process.env.userEmail = user.email;
                        next();
    
                    } else {
                        return res.status(404).json({"ALERT From Token DataBase":"Un_Authorized User"});
                    }
                }
                else{
                    return res.status(404).json({"ALERT":"User Is Already LOGED_OUT"});

                }
               
                
               
            }

        })
       
    } else {
        return res.status(404).json({"ALERT From Authentication":"Un_Authorized User"});
    }
   
}
module.exports = authenticated_user;