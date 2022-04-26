const RESPONSE = async (req,res,responses,message,statusCode)=>{
    console.log("RESPONSE IS WORKING");
    console.log(res._keepAliveTimeout);
     return res.status(statusCode).json({
        "message":message,
        "statusCode":statusCode,
        "Response":responses
    });
}

module.exports = {
    RESPONSE
}