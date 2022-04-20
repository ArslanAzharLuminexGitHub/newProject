const bcrypt = require("bcrypt");
const encrypt = async (key)=>{
    const hash = bcrypt.hash(key,salt=10);
    return hash;
}
const compare = async (requestedPass,encryptedPass)=>{
    return await bcrypt.compare(requestedPass,encryptedPass);
}


module.exports = {
    encrypt,
    compare
}