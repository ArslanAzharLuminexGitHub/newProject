

module.exports = (server)=>{
    server.use("/api/v1/registration",require("./registration/registration"));
    server.use("/api/v1/user",require("./registration/registration"));
};
