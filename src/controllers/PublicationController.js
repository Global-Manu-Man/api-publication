const { v4: uuidv4 } = require('uuid');
const db = require('../database/db');
const { connect } = require('../routes/api');
const { json } = require('body-parser');

exports.Register=(request,response)=>{

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
    const start_date = request.body['start_date'];
    const end_date = request.body['end_date'];
    const language = request.body['language'];
    const security_elements = request.body['security_elements'];
    const status = request.body['status'];
    const social_networks = request.body['social_networks'];
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const startTime = startDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const endTime = endDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    const schedule = startTime+"-"+endTime;

    const sql = `INSERT INTO business (business_id, schedule, name, price, manager, description, event_classification, capacity_people, address_1, address_2, address_3, city, state, country, postal_code, email, cell_phone_number, event_type, business_classification, publication_likes, questions, policies_terms, start_date, end_date) VALUES ("${business_id}","${schedule}",'${name}','${price}','${manager}','${description}','${event_classification}','${capacity_people}','${address_1}','${address_2}','${address_3}','${city}','${state}','${country}','${postal_code}','${email}','${cell_phone_number}','${event_type}','${business_classification}','${publication_likes}',"${questions}",'${policies_terms}','${start_date}','${end_date}')`;

    db.query(sql,(err,data)=>{

        if(err){

            response.status(404).json({status:"Failed to insert",data:err});

        }else{
           
            status.forEach((status_data)=>{
              
                const status_key = Object.keys(status_data)[0];
                const status_val = status_data[status_key];
                const entire_status =status_key +":"+status_val
                  
                const status_sql = `INSERT INTO status(status_id,status) VALUES ("${business_id}","${entire_status}")`;

                db.query(status_sql,(err)=>{
                    if(err){
            
                        response.status(404).json({status:"Failed to insert",data:err});
            
                    }
                })
            })
            social_networks.forEach((network)=>{
              
                const network_name = Object.keys(network)[0];
                const network_url = network[network_name];
                const net_name_url =network_name +":"+network_url
                  
                const social_networks_sql = `INSERT INTO social_networks(social_networks_id,social_network) VALUES ("${business_id}","${net_name_url}")`;

                db.query(social_networks_sql,(err)=>{
                    if(err){
            
                        response.status(404).json({status:"Failed to insert",data:err});
            
                    }
                })
            })
            language.forEach((language_data)=>{
              
                const language_key = Object.keys(language_data)[0];
                const language_val = language_data[language_key];
    
                const language_sql = `INSERT INTO languages(languages_id,language) VALUES ("${business_id}","${language_val}")`;
                db.query(language_sql,(err)=>{
                    if(err){
                        response.status(404).json({status:"Failed to insert",data:err});
            
                    }
                })
            })

            const security_elements_sql = `INSERT INTO security_elements(security_elements_id, security_element) VALUES ("${business_id}","${security_elements}")`;

            db.query(security_elements_sql,(err)=>{
                if(err){
                    response.status(404).json({status:"Failed to insert",data:err});
                }
            })
            response.status(200).json({uid:business_id,code:200,error:"",description:description,created_at: new Date(),
            });
        }

    })




    

}