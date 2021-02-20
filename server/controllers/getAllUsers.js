const {getAllUsers} = require('../features')

const getAllUserController = async(req,res)=>{
    try {
        const users =await getAllUsers();
        res.status(200).json({message:"success",data:users})
    } catch (error) {
        res.status(400).json({message:"error",data:[]})
    }
}

module.exports = getAllUserController