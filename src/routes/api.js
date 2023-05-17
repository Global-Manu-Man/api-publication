const express = require('express');
const router = express.Router();
const env =  require('dotenv').config()
const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const multer = require('multer');
const AWS = require('aws-sdk');

const awsConfig = {
    
    accessKeyId:process.env.ACCESSKEYID, 
    secretAccessKey:process.env.SECRETACCESSKEY,
    region: process.env.REGION
}


const s3 = new AWS.S3(awsConfig)


const uploadImage = multer({

    limits: {
        fileSize: 1024 * 1024 * 10 // 2mb file size
    },
    fileFilter: (req, file, callback) => {

        if(file.mimetype === 'image/jpeg'||file.mimetype === 'image/png'||file.mimetype === 'image/jpg'){
            callback(null,true);
        }else{
            callback("File type not Supported",false);
        }
    },

}).array("image",8);

const uploadToS3 = (fileData)=>{
    return new Promise((resolve,reject)=>{

        const params = {
            Bucket:"locallity",
            Key:`${Date.now().toString()}.jpg`,
            Body: fileData
        }

        s3.upload(params,(err,data)=>{

            if(err){

                console.log(err);
                reject(err)
            }
            return resolve(data)

        })

    })
}

router.post("/publications",uploadImage,(request,response)=>{

 

    const business_id = uuidv4().slice(0,10);
    const name = request.body['name'];
    const price = request.body['price'];
    const manager = request.body['manager'];
    const description = request.body['description'];
    const event_classification = request.body['event_classification'];
    const capacity_people = request.body['capacity_people'];
    const address_1 = request.body['address_1'];
    const address_2 = request.body['address_2'];
    const address_3 = request.body['address_3'];
    const city = request.body['city'];
    const state = request.body['state'];
    const country = request.body['country'];
    const postal_code = request.body['postal_code'];
    const email = request.body['email'];
    const cell_phone_number = request.body['cell_phone_number'];
    const event_type = request.body['event_type'];
    const business_classification = request.body['business_classification'];
    const publication_likes = request.body['publication_likes'];
    const questions = request.body['questions'];
    const policies_terms = request.body['policies_terms'];
    const delivery = request.body['delivery'];
    const latitude = request.body['latitude'];
    const longitude = request.body['longitude'];
    const accepts_credit_cards = request.body['accepts_credit_cards'];
    const is_owner_verified = request.body['is_owner_verified'];
    const parking = request.body['parking'];
    const start_date = request.body['start_date'];
    const end_date = request.body['end_date'];
    const language = request.body['language'];
    const security_elements = request.body['security_elements'];
    const status = request.body['status'];
    const social_networks = request.body['social_networks'];
    const services_offered = request.body['services_offered'];
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const startTime = startDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const endTime = endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const schedule = startTime+"-"+endTime;
    const sql = `INSERT INTO business (business_id, schedule, name, price, manager, description, event_classification, capacity_people, address_1, address_2, address_3, city, state, country, postal_code, email, cell_phone_number, event_type, business_classification, publication_likes, questions, policies_terms, delivery, latitude, longitude, accepts_credit_cards, is_owner_verified,start_date, end_date) VALUES ("${business_id}","${schedule}",'${name}','${price}','${manager}','${description}','${event_classification}','${capacity_people}','${address_1}','${address_2}','${address_3}','${city}','${state}','${country}','${postal_code}','${email}','${cell_phone_number}','${event_type}','${business_classification}','${publication_likes}',"${questions}",'${policies_terms}','${delivery}','${latitude}','${longitude}',"${accepts_credit_cards}","${is_owner_verified}",'${start_date}','${end_date}')`;
    db.query(sql,(err,data)=>{

        if(err){

            response.send({status:"Failed to insert",data:err});

        }else{
                const status_sql = `INSERT INTO status(status_id,status) VALUES ("${business_id}","${status}")`;
                db.query(status_sql,(err)=>{
                    if(err){
                        response.send({status:"Failed to insert",data:err});
                    }
                })
  
                const social_networks_sql = `INSERT INTO social_networks(social_networks_id,social_network) VALUES ("${business_id}","${social_networks}")`;

                db.query(social_networks_sql,(err)=>{
                    if(err){
            
                        response.send({status:"Failed to insert",data:err});
            
                    }
                })
                      
                const language_sql = `INSERT INTO languages(languages_id,language) VALUES ("${business_id}","${language}")`;
                db.query(language_sql,(err)=>{
                    if(err){
                        response.send({status:"Failed to insert",data:err});
                    }
                })
            const security_elements_sql = `INSERT INTO security_elements(security_elements_id, security_element) VALUES ("${business_id}","${security_elements}")`;
            db.query(security_elements_sql,(err)=>{

                if(err){
                    response.send({status:"Failed to insert",data:err});
                }
                
            })
            //services_offered

            const services_offered_sql = `INSERT INTO services_offered(services_offered_id, services_offered) VALUES ("${business_id}","${services_offered}")`
            db.query(services_offered_sql,(err)=>{
                if(err){

                    response.send({status:"Failed to insert",data:err});

                }
            })

            const parking_sql = `INSERT INTO parking(parking_id,parking) VALUES ("${business_id}","${parking}")`;
            db.query(parking_sql,(err)=>{

             
                
            })

        // Image
            if(request.files && request.files.length>0 ){

                for(let i=0;i<request.files.length;i++){

                    console.log(request);

                    uploadToS3(request.files[i].buffer).then((result)=>{

                        const imgLocation = result.Location;
                      
                        const ImageSql = `INSERT INTO images(images_id, image_url) VALUES ("${business_id}","${imgLocation}")`;
                        db.query(ImageSql)
    
                  })
                }
              
            }

            response.status(200).json({uid:business_id,code:200,error:"",description:description,created_at: new Date(),
            });


        }

    })

})
module.exports = router;
