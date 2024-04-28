var nodemailer = require('nodemailer');

class MailSenderClass{

    //isSentSuccesfully=false;
    
    constructor(s_name, sender_mail, sender_mail_pass) {
        this.mailOptions = {};
        this.receiver_mail = "";
        this.subject = "";
        //this.isSentSuccesfully = false;
        this.service_name = s_name;//google,yahoo....
        this.sender_mail = sender_mail;
        this.sender_mail_pass = sender_mail_pass;
        this.transporter = nodemailer.createTransport({
            service: s_name,
            auth: {
                user: sender_mail,
                pass: sender_mail_pass
            }
        });
    }
    setReceiver(receiver_email){
        this.receiver_mail = receiver_email;
    }
    setSubject(sub){
        this.subject = sub;
    }
    setHTML(html_code){
        this.mailOptions = {
            from: this.sender_mail,
            to: this.receiver_mail,
            subject: this.subject,
            html: html_code //'<h1>Welcome</h1><p>That was easy!</p>'
        }
    }
    setText(text_message){
        this.mailOptions = {
            from: this.sender_mail,
            to: this.receiver_mail,
            subject: this.subject,
            text: text_message//standart text message!
        }
    }

    send(){
        this.transporter.sendMail(this.mailOptions, function(error, info){
            if(error){
                //this.isSentSuccesfully = false;
                return error;
            }else{
                //this.isSentSuccesfully = true;
                var res = "Email send: "+info.response;
                return res;
            }
        });
    }
}



res_msender_ob_class = {};
res_msender_ob_class.msender_ob_class = MailSenderClass;
res_msender_ob_class.msender_ob_obj_class = new MailSenderClass();
module.exports = res_msender_ob_class;


// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'youremail@gmail.com',
//       pass: 'yourpassword'
//     }
//   });
  
//   var mailOptions = {
//     from: 'youremail@gmail.com',
//     to: 'myfriend@yahoo.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
//   };
  
//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });

//   var mailOptions = {
//     from: 'youremail@gmail.com',
//     to: 'myfriend@yahoo.com',
//     subject: 'Sending Email using Node.js',
//     html: '<h1>Welcome</h1><p>That was easy!</p>'
//   }