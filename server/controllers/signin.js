const {findUser} = require('../features')
const {createUser} = require('../features')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signin = async(req,res)=>{
    try {
        const {email,password} = req.body;
        console.log(req.body);
        if(!email || !password){
            res.status(400).json({error: "Invalid data"});
        }else{
            const user = await findUser(email);
            if(!user) res.status(404).send({error: 'Invalid user'});
            else{
                //get passs in db
                //console.log(user._source.password);
                const passhass = user._source.password;
                const check = bcrypt.compareSync(password, passhass);
                if(check){
                    const token = jwt.sign({   //create token
                        id: user._id,
                        name: user._source.name,
                        email: user._source.email,
                    },process.env.TOKEN_SECRET);

                    res.status(200).json({message : "login sucess.", token: token})
                }else {
                    res.status(404).json({message : "Invalid user."})
                }
            }
        }   
    } catch (error) {
        res.status(500).json({message : error})
    }
}

module.exports = signin