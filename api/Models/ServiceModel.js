const mongoose = require("mongoose");
const servicerModel = require("../database/servicer");

const Servicer = mongoose.model("Servicer", servicerModel);


class Servicers {
    create(name, name_business, email, password, address){
        try{
            var servicer = new Servicer({
                name,
                name_business,
                email,
                password,
                address,
                valid: 'no',
                sessionid: ''
            });
    
            servicer.save();
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
        
        
    }

    async findByEmail(email){
        
        
            var user = await Servicer.find({email: email});
            
            return user
            
    }
    
    async confirmEmail(id){
        try{
            var user = await Servicer.findById(id);
            if(user){
                await Servicer.findOneAndUpdate({email: user.email}, {valid: 'yes'});
                return 'success';
            };
            
        }catch(err){
            return 'invalid';
        }
        
        
    }
}

module.exports = new Servicers();