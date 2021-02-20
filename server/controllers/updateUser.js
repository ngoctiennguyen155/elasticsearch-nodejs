const {updateUser}= require('../features')

const updateUserController = async(req,res)=>{
    try {
        const {_id } = req.body;
        if(!_id) {
            res.status(400).json({message:"_id not found."})
        }
        const result = await updateUser(req.body,(result)=>{
            res.status(result.status).json({message:result.message})
        }); 
    } catch (error) {
        res.status(500).json({message:error})
    }
    
}

module.exports = updateUserController;