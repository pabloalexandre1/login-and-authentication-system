const mongoose = require("mongoose");
const userModel = require("../database/user");

const User = mongoose.model("User", userModel);


class Users {
    create(name, email, password){
        try{
            var user = new User({
                name,
                email,
                password,
                valid: 'no'
            });
    
            user.save();
            return true;
        }catch(err){
            console.log(err);
            return false;
        }
        
        
    }

    async findByEmail(email){
        
        
            var user = await User.find({email: email});
            
            return user
            
    }
    
    async confirmEmail(id){
        try{
            var user = await User.findById(id);
            if(user){
                await User.findOneAndUpdate({email: user.email}, {valid: 'yes'});
                return 'success';
            };
            
        }catch(err){
            return 'invalid';
        }
        
        
    }
}

module.exports = new Users();