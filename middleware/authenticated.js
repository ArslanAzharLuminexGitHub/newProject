const instence = require("../utility/instence");
const response = require("../utility/response").RESPONSE;
const key = process.env.key || "key"


const authenticated_user = async (req,res,next)=>{
    let header = req.headers["authorization"];
    let token = header && header.split(" ")[1];
    if (token) {
        
        let jwt = require("jsonwebtoken");
        
        jwt.verify(token,key,async (err,user)=>{
            
            
            if(err){
               // return res.status(500).json({ "ERROR AUTH TOKEN": err });
                await response(req,res,
                    responses = err,
                    message = "ERROR AUTH TOKEN",
                    statusCode = 500
                    );
            }
            else{
            
        

                let data = await instence.user.findOne({email:user.email});
                let tokenData = await instence.token.findOne({email:user.email});
                if(tokenData){
                    if (data.active === true && tokenData) {
                        console.log("auth: "+data.active);
                        process.env.userEmail = user.email;
                        next();
    
                    } else {
                       // return res.status(404).json({"ALERT From Token DataBase":"Un_Authorized User"});
                        await response(req,res,
                            responses = "Un_Authorized User",
                            message = "ALERT From Token DataBase",
                            statusCode = 404
                            );
                    }
                }
                else{
                    //return res.status(404).json({"ALERT":"User Is Already LOGED_OUT"});
                    await response(req,res,
                        responses = "ALERT",
                        message = "User Is Already LOGED_OUT",
                        statusCode = 404
                        );

                }
               
                
               
            }

        })
       
    } else {
        //return res.status(404).json({"ALERT From Authentication":"Un_Authorized User"});
        await response(req,res,
            responses = "Un_Authorized User",
            message = "ALERT From Authentication",
            statusCode = 404
            );
    }
   
}
module.exports = authenticated_user;