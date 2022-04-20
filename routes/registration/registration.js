const Router = require("express").Router();
const registrationController = require("../../controllers/registrations/registrations")
const authenticated_user = require("../../middleware/authenticated");
const multer = require("../../middleware/multer");


/**************** Route For SIGN_UP **************************/
Router.route("/signup").post(multer.any(),registrationController.signUp);



/**************** Route For LOG_IN **************************/
Router.route("/login").post(multer.any(),registrationController.login);



/**************** Route For Forget_Password_Link **************************/
Router.route("/forgetpasslink").post(multer.any(),registrationController.forgot_Pass_link);



/**************** Route For TESTING_Route **************************/
Router.route("/fun").post(multer.any(),registrationController.fun);



/**************** Route For UPDATE **************************/
Router.route("/updateprofile").post(multer.any(),authenticated_user,registrationController.updateProfile);






/*******************************     AFTER MULTER ROUTE   *****************************************/







/**************** Route For VIEW_PROFILE **************************/
Router.route("/viewprofile").get(authenticated_user, registrationController.viewprofile);



/**************** Route For LOG_OUT **************************/
Router.route("/logout").post(authenticated_user, registrationController.logOut);



/**************** Route For FORGET_PASSWORD **************************/
Router.route("/forgetpass").post(registrationController.forgot_Pass);



/**************** Route For upload **************************/
Router.route("/upload").post(registrationController.upload);



/**************** Route For signUpAuthenicationEmail **************************/
Router.route("/signupauthenication").post(registrationController.signUpAuthenicationEmail);










module.exports = Router;

