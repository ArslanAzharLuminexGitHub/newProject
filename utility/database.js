const userSchema = require("../models/userSchema");

const save = async model => {
    return await model.save();
  };


const findone = async (model,query) => {
    return await userSchema.findOne(query);
  };


module.exports = {save,findone}
