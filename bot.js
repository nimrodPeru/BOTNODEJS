var express = require('express')
var bodyParser = require ('body-parser')
var request = require('request')

const APP_TOKEN ="EAAEDWhcZCEOoBAOhvi37kFPho78knazw7sONP39sC2gAZAPcKCFcTKFjaUcIiqUc5iOcw515nbxsu9PQi5ZAVIZBkvsjIGVsYib2oTO2vEGrR5OF8lFGtD510ZBZA6dh3FkI8NPPgzn0XOFdNPbqqnVEt8UvfTip1kKMpYvjz91gZDZD"

// "EAAEDWhcZCEOoBAFj9Anu8w1yPI8XLXeyJsJnnZAQXw1zYFRwdjvNUTzblIrN0eQ2t826ovqUXhoyfEUNng7tIqzQUxeaER2GX238LhZBtlxD2fTjvPLgwK2BPOMAMCp5K9Rc5MdtHajJnGcAy6AzAb2DUhPb3wkqBdYPiL16wZDZD"  

var app = express()  
//app.use = (bodyParser.json())  
//app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

app.listen(3000,function(){
    console.log("el servidor puerto 3000")  
})  

app.get('/',function(req,res){
    res.send('welcome')  
})  

//TOKE-> token_bot
app.get('/webhook',function(req,res){
    const VERIFY_TOKEN = "token_bot";
    
    if(req.query['hub.verify_token']==='token_bot'){
        res.send(req.query['hub.challenge'])  
    }else{
        res.send('sin privilegios 3001')  
    }
    
})  

app.post('/webhook',function(req,res){
    
    var data = req.body  
    
    console.log("---------------")
    console.log(data)
    if(data.object == 'page'){
        data.entry.forEach(function(pageEntry){
            console.log("---------------")
            console.log(pageEntry)
            //pageEntry.changes.forEach(function(messagingEvent){
            pageEntry.messaging.forEach(function(messagingEvent){
                console.log("---------------")
                //solo los que son enviados de facebook
                //if(messagingEvent.messaging){
                if(messagingEvent.message){
                    console.log(messagingEvent)
                    console.log("Funcion de muestra------------------------")
                    let mensaje = messagingEvent.sender.id +" "+ messagingEvent.message.text
                    var senderId = messagingEvent.sender.id
                    var txt = messagingEvent.message.text
                    console.log(senderId+"---------------")
                    receiveMessage(messagingEvent)
                    //evaluateMessage(senderId,txt)
                    //sendMessageText(senderId,txt)
                    /*
                    var messageData={
                        recipient:{
                            id:senderId//messagingEvent.sender.id
                        },
                        message:{
                             text:txt//messagingEvent.message.text
                        }
                    }
                    */
                  //callSendAPI(messageData) 
                  /* --app face 
                    request({
                        uri: 'https://graph.facebook.com/v2.6/me/messages',
                        qs: {access_token: APP_TOKEN},
                        method: 'POST',
                        json: messageData
                    },function(error, response, data){
                        if(error)
                            console.log('No es posible enviar el mensaje')
                        else
                            console.log('Mensaje enviado'+APP_TOKEN)
                    })
                   */ 
                }   
            })
        })
        //esta funcion es necesaria para confirmar q la solicitud es exitosa
        //SINO enviara varias veces la solicitud, obs: se envia el primer comentario como un bucle
        res.sendStatus(200)
    }
    
})


function receiveMessage(event){
    console.log(event)
    var senderId = event.sender.id
    var messageText = event.message.text

    evaluateMessage(senderId,messageText)
}

function evaluateMessage(id,mensaje){
    let mensajeFinal=''
    if(containMessage(mensaje,'ayuda')){
        mensajeFinal ="podrias darme mas opciones"     
    }
    
    else if(containMessage(mensaje,'gato')){
        sendMessageImage(id)
    }
    else if(containMessage(mensaje,'compra')){
        var messageData = {
            recipient : {
                id:id
            },
            message: {
                attachment: {
                  type: "template",
                  payload: {
                    template_type: "generic",
                    elements: [{
                      title: "rift",
                      subtitle: "Next-generation virtual reality",
                      item_url: "https://www.oculus.com/en-us/rift/",               
                      image_url: "https://tctechcrunch2011.files.wordpress.com/2014/09/crescent-bay-front-pers-on-light.jpg?w=738",
                      buttons: [{
                        type: "web_url",
                        url: "https://www.oculus.com/en-us/rift/",
                        title: "Open Web URL"
                      }, {
                        type: "postback",
                        title: "Call Postback",
                        payload: "Payload for first bubble",
                      }],
                    }, {
                      title: "touch",
                      subtitle: "Your Hands, Now in VR",
                      item_url: "https://www.oculus.com/en-us/touch/",               
                      image_url: "https://images-na.ssl-images-amazon.com/images/I/61vilOmXMCL._SX522_.jpg",
                      buttons: [{
                        type: "web_url",
                        url: "https://www.oculus.com/en-us/touch/",
                        title: "Open Web URL"
                      }, {
                        type: "postback",
                        title: "Call Postback",
                        payload: "Payload for second bubble",
                      }]
                    }]
                  }
                }
              }
        }
        callSendAPI(messageData)
    }
    /*
    else if(containMessage(mensaje,'compra')){
        var messageData = {
            recipientId: {
                id:id
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                      "template_type":"button",
                      "buttons":[
                        {
                          "type":"payment",
                          "title":"buy",
                          "payload":"DEVELOPER_DEFINED_PAYLOAD",
                          "payment_summary":{
                            "currency":"USD",
                            "payment_type":"FIXED_AMOUNT",
                            "is_test_payment" : true, 
                            "merchant_name":"Peter's Apparel",
                            "requested_user_info":[
                              "shipping_address",
                              "contact_name",
                              "contact_phone",
                              "contact_email"
                            ],
                            "price_list":[
                              {
                                "label":"Subtotal",
                                "amount":"29.99"
                              },
                              {
                                "label":"Taxes",
                                "amount":"2.47"
                              }
                            ]
                          }
                        }
                      ]
                    }
                  }
            }
        }
        callSendAPI(messageData)
    }
    */
    else if(containMessage(mensaje,'fono')){
        var messageData = {
            recipient : {
                id:id
            },
            message : {
                "attachment":{
                    "type":"template",
                    "payload":{
                      "template_type":"button",
                      "text":"Need further assistance? Talk to a representative",
                      "buttons":[
                        {
                          "type":"phone_number",
                          "title":"Call Representative",
                          "payload":"+51955754086"
                        }
                      ]
                    }
                  }
            }
        }
        callSendAPI(messageData)
    }
    else if(containMessage(mensaje,'info')){
       // sendMessageTemplate(id)
        console.log("----arminio----"+id)
       
       var messageData = {
        recipient : {
            id:id
        },
        message :{
                  "attachment": {
                    "type": "template",
                    "payload": {
                    "template_type": "generic",
                        "elements": [{
                            "title": "Is this the right picture?",
                            "subtitle": "Tap a button to answer.",
                            "image_url": "https://goo.gl/PKaX6T",
                            "buttons": [
                            {
                                "type": "postback",
                                "title": "Yes!",
                                "payload": "yes",
                            },
                            {
                                "type": "postback",
                                "title": "No!",
                                "payload": "no",
                            },
                            {
                                "title": "View More",
                                "type": "postback",
                                "payload": "payload"            
                            }
                            ],
                        }]
                    }
                }
            }
        }
        callSendAPI(messageData)
    } 
    
    else{
        mensajeFinal = mensaje
    }

    sendMessageText(id,mensajeFinal)
}


function sendMessageImage(recipientId){
    var messageData = {
        recipient : {
            id:recipientId
        },
        message : {
            attachment:{
                type : "image",
                payload : {
                    url:"https://goo.gl/PKaX6T"
                }
            } 
        }
    }
    callSendAPI(messageData)

}

function sendMessageTemplate(recipientId){
    var messageData = {
        recipient : {
            id:recipientId
        },
        message : {
            attachment:{
                type : "template",
                payload : {
                    template_type:"generic",
                    elements:[elementTemplate]
                }
            } 
        }
    }
    callSendAPI(messageData)
}

function elementTemplate(){
    return{ 
        title: "nimrod",
        subtitle:"deve",
        item_url:"https://www.facebook.com/profile.php?id=100013433650537",
        image_url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_QLfVbZ9MeaB6e5j-952DOayRKZodGAIuuCbh7_oW_4Ho082T_g",
        buttons: [buttonTemplate()],
    }
}   

function buttonTemplate(){
    return{
        type:"web_url",
        url :"https://www.facebook.com/profile.php?id=100013433650537",
        title:"ncm"
    }
}
/*
//-----------------------------------------------
function sendMessageTemplate(recipientId){
    var messageData = {
        recipient:{
            id:recipientId
        },
        message: {
            attachment:{
                type:"template",
                payload:{
                    template_type:"generic",
                    elements: [elementTemplate]
                }
            }
        }
    };
    callSendAPI(messageData)
}


function elementTemplate(){
    return{
        "title":"Welcome to Peter\'s Hats",
        "subtitle":"We\'ve got the right hat for everyone.",
        "item_url": "https://www.facebook.com/Icthus-500801093610199/",
        "image_url":"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtAQImRrFdUgYvwnvtsIB5g8Z5G34oqgm-ILaAGr84b3--4odCJg",
        buttons:[buttonTemplate()],
    }
}

function buttonTemplate(){
    return{
        "type":"web_url",
        "url":"https://www.facebook.com/Icthus-500801093610199/",
        "title":"View Website"
    }
}
*/
//------
function sendMessageText(recipientId,message){
    var messageData = {
        recipient : {
            id:recipientId
        },
        message : {
            text: message
        }
    }
    callSendAPI(messageData)
}

function callSendAPI(messageData){
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs : { access_token : APP_TOKEN},
        method: 'POST',
        json : messageData

    }, function (error, response,data){
        if(error){
            console.log("erro")
        }
        else{
            console.log("res")
        }
    })
}

function containMessage(sentencia, palabra){
    return sentencia.indexOf(palabra)>-1
}