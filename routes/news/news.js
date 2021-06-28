const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto-js");
const jwt = require("jsonwebtoken");
const utils = require("../../utils");
const db = require("../../db");
const config = require("../../config");
const multer = require("multer");
const upload = multer({ dest: 'uploads/' })
const e = require("express");
const fs = require('fs');
const AWS = require('aws-sdk');
const pkg = require('../../package.json')

const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

const { uploadFile } = require('../../s3')

const app = express()



const router = express.Router();

// parse application/json
router.use(bodyParser.json());


// ---------------------------------------
//                  GET
// ---------------------------------------

/**
 * @swagger
 *
 * /news/newssearch:
 *   get:
 *     description: To search news based on localities,city,headline
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: city
 *         description: city 
 *         in: formData
 *         type: string
 *       - name: localities
 *         description: localities for which request to made 
 *         in: formData
 *         type: string
 *       - name: state
 *         description: state 
 *         in: formData
 *         type: string
 *       - name: header
 *         description: header 
 *         in: formData
 *         type: string
 *     responses:
 *       200:
 *         description: successful message
 */
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



//get all news
/**
 * @swagger
 *
 * /news/newssearch:
 *   get:
 *     description: To get all news based
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */
//get news 
router.get('/', (request, response) => {
  const statement = `SELECT d.content,d.headline,h.category,h.image from news_header h join news_details d  on h.id=d.header_id  ;`
  db.query(statement, (error, data) => {
    if (error) {
      response.send(utils.createError(error))
      console.log(`error`)
    }
    else {
      response.send(utils.createSuccess(data))
      console.log(`data`)
    }
  })
})




//Towns/Cities/localities
/**
 * @swagger
 *
 * /news/newsbyaddress:
 *   get:
 *     description: To get news based on Towns/Cities/localities
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: successful message
 */
router.get('/newsbyaddress', (request, response) => {
  let id = request.userId
  console.log("request.userId", request.userId)
  console.log("request.userIdd")

  const aid_st = ` select address_id from user_details
  where id=${id};`
  var address_id
  db.query(aid_st, (error, data) => {
    if (error) {
      response.send(utils.createError(error))

    }
    else {


      address_id = data[0].address_id;
      console.log("data[0].address_id", data[0].address_id)
      const statement = `select ndet.headline,ndet.content,nhead.image,nhead.date,nhead.category
    from news_header nhead
    inner join address on nhead.address_id = address.id
    inner join news_details ndet on ndet.header_id = nhead.id 
    where address.id=${address_id}`

      db.query(statement, (error, data) => {
        if (error) {
          response.send(utils.createError(error))
        }
        else {
          response.send(utils.createSuccess(data))
        }
      })
    }
  })

})

// ---------------------------------------
//                  POST
// ---------------------------------------
/**
 * @swagger
 *
 * /news/addnews:
 *   post:
 *     description: To Add News  headline and content
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: content
 *         description: content for news 
 *         in: formData
 *         type: string
 *       - name: headline
 *         description: headline for news 
 *         in: formData
 *         type: string
 *       - name: articleImage
 *         description: Image for news 
 *         in: formData
 *         type: file
 *     responses:
 *       200:
 *         description: successful message
 */
router.post("/addnews", upload.single("image"), async (request, response) => {
  const { content, headline, category } = request.body;

  console.log("request", request)


  const fileName = process.env.AWS_HOST_URL + request.file.filename;
  console.log("fileName", fileName)

  const file = request.file
  console.log("request.file", request.file)



  const userid = request.userId;
  console.log("request.file.filename", request.file.originalname)





  const statement1 = `insert into news_header(reporter_id, address_id,image,category) VALUES('${userid}', (select address_id from user_details where id='${userid}'),'${fileName}','${category}');`;

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
          db.query(statement2, async (error, data) => {
            if (error) {
              response.send(utils.createError(error));
            } else {


              const file = request.file
              console.log(file)

              // apply filter
              // resize 

              const result = await uploadFile(file)
              await unlinkFile(file.path)
              console.log(result)


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
/**
 * @swagger
 *
 * /news/reportnews:
 *   put:
 *     description: To report particular news 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: newsId
 *         description: newsId of news 
 *         in: formData
 *         type: string
 *       - name: report_reason
 *         description: report_reason for news 
 *         in: formData
 *         type: string
 *     responses:
 *       200:
 *         description: successful message
 */
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
            flag = true;
          }
        });
      }

      var statement = '';
      if (flag) {
        statement = `UPDATE news_details
          SET
              report_ctr=report_ctr +1
          WHERE id ='${newsId}';`;

      } else {
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


/**
 * @swagger
 *
 * /news/blocknews:
 *   put:
 *     description: To block particular news 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: newsId
 *         description: newsId of news 
 *         in: formData
 *         type: string
 *       - name: report_reason
 *         description: report_reason for news 
 *         in: formData
 *         type: string
 *     responses:
 *       200:
 *         description: successful message
 */
router.put("/blocknews", (request, response) => {

  const { newsId } = request.body;
  const statement = `update news_details set isActive=0 where id=${newsId}`
  db.query(statement, (error, data) => {

    if (error) {
      response.send(utils.createError(error));
    } else {

      response.send(utils.createSuccess(data));

    }
  })

})



// ---------------------------------------
//                  delete
// ---------------------------------------
/**
 * @swagger
 *
 * /news/delete:
 *   delete:
 *     description: To delete particular news 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: newsId
 *         description: newsId of news 
 *         in: formData
 *         type: string
 *       - name: report_reason
 *         description: report_reason for news 
 *         in: formData
 *         type: string
 *     responses:
 *       200:
 *         description: successful message
 */
router.delete("/delete", (request, response) => {

  const { newsId } = request.body;

  const statement = `select header_id from news_details where id='${newsId}';`

  db.query(statement, (error, data) => {

    if (error) {
      response.send(utils.createError(error));
    } else {

      if (data.length == 0) {
        console.log(`no news `)
      }
      else {

        const header_id = data[0].header_id

        const statement = `delete  from news_details where id='${newsId}';`

        db.query(statement, (error, data) => {
          if (error) {
            response.send(utils.createError(error));
          } else {
            const statement = `delete  from news_header where id='${header_id}';`

            db.query(statement, (error, data) => {

              if (error) {
                response.send(utils.createError(error));
              } else {

                response.send(utils.createSuccess(data));

              }
            })

          }
        })
      }
    }
  });

})

module.exports = router;
