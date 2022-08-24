const Servicers = require("../Models/ServiceModel");
const bcrypt = require("bcrypt");
const nodeMailer = require("nodeMailer");
const SMTPPool = require("nodemailer/lib/smtp-pool");
const jwt = require('jsonwebtoken');
const stripe = require('stripe')('');

class ServicerController {
    register = async (req, res) => {

        var {name, name_business, email, password} = req.body;
        var validate = true;
        var nameV = name.trim();
        var emailV = email.trim();
        var passwordV = password.trim();

        if(nameV != ''){
            if(emailV != ''){
                
                if(passwordV != '' && passwordV.length >= 6){
                    validate = true;
                }else{
                    validate = false;
                    res.json({
                        
                        msg: "error",
                        error: "senha invalida, ela deve ter ao menos 6 caracteres"
                    });
                }
            }else{
                validate = false
                res.json({
                    
                    msg: "error",
                    error: "email invalido, preencha corretamente"
                });
            }
        }else{
            validate = false;
            res.json({
                msg: "error",
                error: "nome vazio, preencha-o para continuar"
            });
        }

        //after ll validation of the informations, validate if email is not already registered
        if(validate == true){
            
            var user = await Servicers.findByEmail(emailV);
            
            if(user.length > 0) {
                res.json({
                    msg: "error",
                    error: "email ja cadastrado"
                });
                //below if all validations had success
            }else{
                bcrypt.hash(password, 10, (err, hash) => {
                    var passwordHash = hash;
                    var result = Servicers.create(name, name_business, email, passwordHash, req.body.address);
                    console.log(`PASSWORD HASH: ${passwordHash}`);
                    if(result == true){

                        //sending the confirmation e-mail to the user
                        var transporter = nodeMailer.createTransport({
                            host: 'smtp.umbler.com',
                            port: 587,
                            secure: false,
                            auth: {
                                user: "yagenda@yagenda.net",
                                pass: "umburana.2011"
                            }
                        });

                        transporter.sendMail({
                            from: "Pablo Barros <yagenda@yagenda.net>",
                            to: email,
                            subject: "YAGENDA - confirmação de email",
                            text: "obrigado por realizar a inscrição na nossa plataforma, falta apenas um passo para começar a usufrir da mesma, clique no link a seguir e confirme que este email é seu!:",
                            html: "<h1> obrigado por se inscrever, clique no botão a seguir para confirmar seu e-mail: </h1> <br> <a href='#'> CONFIRMAR </a>"
                        }).then(message => {
                            console.log(message);
                        }).catch(err => {
                            console.log(err);
                        })

                        res.status(200);
                        res.json({    
                            msg: "success"
                        });
                    }else{
                        res.json({
                            msg: "error"
                        });
                    }
                });
            }
            
        }

    }

    emailConfirmation = async(req, res) => {
        var id = req.params.id;
        var user = await Servicers.confirmEmail(id);
        if(user == 'invalid'){
            res.json({
                msg: "error",
                error: "usuario invalido"
            })
        }
        if(user == 'success'){
            res.json({
                msg: "success"
            });
        }
        
        
    }

    login = async(req, res) => {
        var {email, password} = req.body;
        var user = await Servicers.findByEmail(email);

        if(user.length > 0){
            var result = await bcrypt.compare(password, user[0].password);
            if(result == true){
                if(user[0].valid == 'yes'){
                    var token = jwt.sign({name: user[0].name, email: user[0].email, role: 'servicer'}, '');
                    
                    res.json({
                        msg: "success",
                        user: {
                            token: token,
                            name: user[0].name,
                            name_business: user[0].name_business,
                            email: user[0].email
                        }
                    });
                }else{
                    res.json({
                        msg: "error",
                        error: "você ainda não confirmou seu e-mail"
                    })
                }
                
            }else{
                res.json({
                    msg: "error",
                    error: "senha incorreta"
                });
            }
            
        }else{
            
            res.json({
                msg: "error",
                error: "email de usuário não encontrado no banco de dados"
            })
        }
        

        
    }

    createCheckout = async (req, res) => {
        const session = await stripe.checkout.sessions.create({
            line_items: [
              {
                // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                price: '',
                quantity: 1,
              },
            ],
            mode: 'subscription',
            success_url: `http://localhost:8080/successpay`,
            cancel_url: `http://localhost:8080/cancelpay`,
        });
        console.log("------------  SESSION CRIADA -------------------------");
        console.log(session);
        res.json({
            msg: "success",
            url: session.url
        });
    }

    sucessPayment = async (req, res) => {
        const endpointSecret = "";

        

        const sig = req.headers['stripe-signature'];

        let event;

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            console.log("=================ESTÁ INDO OK ===================");
            console.log(event.type);
        } catch (err) {
            console.log("=================== ACONTECEU UM ERRO ====================");
            console.log(err);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }
        
        // Handle the event
        switch (event.type) {
            case 'checkout.session.completed':
            const session = event.data.object;
            // Then define and call a function to handle the event checkout.session.async_payment_succeeded
            console.log("----------- SESSION DO EVENTO -----------");
            console.log(session);
            
            
            break;
            // ... handle other event types
            default:
            console.log(`Unhandled event type ${event.type}`);
        }

        res.send("{'msg': 'ok'}");
    }
}

module.exports = new ServicerController();
