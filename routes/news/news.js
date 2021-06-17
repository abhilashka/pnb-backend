const express = require("express");
const bodyParser = require("body-parser");

const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const utils = require("../../utils");
const db = require("../../db");
const config = require("../../config");
const multer = require("multer");
const e = require("express");
const upload = multer({ dest: "images/" });

const router = express.Router();

// parse application/json
router.use(bodyParser.json());


// ---------------------------------------
//                  GET
// ---------------------------------------

router.get("/newssearch", (request, response) => {
  const { city, localities, state, header } = request.body;

  const statement = `SELECT n.category,det.headline,det.content
    FROM news_header n
    INNER JOIN address ON n.address_id = address.id 
    INNER JOIN news_details det ON n.id=det.header_id where det.headline ='${header}' or address.city ='${city}' or address.localities = '${localities}' or address.state='${state}' ;`;
  db.query(statement, (error, data) => {
    if (error) {
      response.send(utils.createError(error));
      console.log(`error`);
    } else {
      response.send(utils.createSuccess(data));
      console.log(`data`);
    }
  });
});

// ---------------------------------------
//                  POST
// ---------------------------------------

router.post("/addnews", upload.single("articleImage"), (request, response) => {
  const { content, headline } = request.body;

  const userid = request.userId;
  const fileName = request.file.filename;

  const statement1 = `insert into news_header(reporter_id, address_id,image) VALUES('${userid}', (select address_id from user_details where id='${userid}'),'${fileName}');`;

  db.query(statement1, (error, data) => {
    if (error) {
      response.send(utils.createError(error));
    } else {
      const stm = `SELECT MAX(id) AS MaxId FROM news_header`;
      var maxId = 0;
      db.query(stm, (error, data) => {
        if (error) {
          response.send(utils.createError(error));
        } else {
          maxId = data[0].MaxId;
          const statement2 = `insert into news_details(header_id,content,headline) VALUES('${maxId}','${content}','${headline}' );`;
          db.query(statement2, (error, data) => {
            if (error) {
              response.send(utils.createError(error));
            } else {
              response.send(utils.createSuccess(data));
            }
          });
        }
      });
    }
  });
});

// ---------------------------------------
//                  PUT
// ---------------------------------------

router.put("/reportnews", (request, response) => {
  const { newsId, report_reason } = request.body;

  var allReports,
    flag = false;
  const stm = `select report_reason from news_details where id='${newsId}';`;

  db.query(stm, (error, news_details) => {

    if (error) {
      console.log(error);
    } else {
      var report_reasons = news_details[0].report_reason;
      console.log(report_reasons);
      if (report_reasons != null) {
        allReports = report_reasons.split("#");

        allReports.forEach((e) => {
          if (e === report_reason) {
            flag=true;
          }
        });
      }
     
      var statement='';
      if (flag) {
         statement = `UPDATE news_details
          SET
              report_ctr=report_ctr +1
          WHERE id ='${newsId}';`;
            
      }else{
         statement = `UPDATE news_details   
          
          SET
             report_reason=CONCAT(report_reason,'#','${report_reason}'), 
             report_ctr=report_ctr +1
          WHERE id = '${newsId}';`;
          
        }
        
        db.query(statement, (error, data) => {
            if (error) {
              response.send(utils.createError(error));
            } else {
              response.send(utils.createSuccess(data));
            }
          });

    
    }
  });
});


module.exports = router;
