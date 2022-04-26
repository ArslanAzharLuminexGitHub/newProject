const RESPONSE = async (req,res,responses,message,statusCode)=>{
    
     return res.status(statusCode).json({
        "message":message,
        "statusCode":statusCode,
        "Response":responses
    });
}

module.exports = {
    RESPONSE
}