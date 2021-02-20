const {createUser} = require('../features')


const signup = (req,res)=>{
    try {
        const {email,name,age,date,password,address} = req.body;
        if(!email || !name || !date || !age || !password || !address){
            res.status(400).json({error: "Invalid data"});
        }else{
            createUser(name,email,password,age,date,address,(result)=>{
                res.status(result.status).send({message:result.message});
            })
            
        }
    } catch (error) {
        res.status(500).send({message:error});
    }
}

module.exports = signup