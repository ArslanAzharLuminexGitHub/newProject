/******************** Requires ************************/
const express = require("express");
const server = express();
const mongoodb = require("mongoose");
require("dotenv").config();





/******************** Enviroment Veriables ************************/
const PORT = process.env.PORT || 3000
const HOST = process.env.HOST || "localHost"
const URL = process.env.URL


//******************** DATABASE SETUP  ***********************//
mongoodb.connect(URL, { useNewUrlParser: true }).then(() => {
    console.log("MongoDB is Connected")
});

module.exports = mongoodb;




//******************** JSON ENABLING *************************//
server.use(express.urlencoded({extended:true}));
server.use(express.json()); //For JSON Enable...

require("./routes/routersRouter")(server);


/*************** Code For Parser *********************/
// const { fileParser } = require('express-multipart-file-parser');
// server.use(
//     fileParser({
//       rawBodyOptions: {
//         limit: '30mb', //file size limit
//       },
//       busboyOptions: {
//         limits: {
//           fields: 50, //Number text fields allowed
//         },
//       },
//     })
//   );
/****************************************************************/




//******************** Listening Server *************************//
server.listen(PORT,`${HOST}`,()=>{
    console.log(`PORT ${PORT} Is Connected To The ${HOST}...`);
});