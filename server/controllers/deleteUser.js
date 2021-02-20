const {deleteUser} =require ('../features')

const deleteController = (req,res)=>{
    try {
        const {id} = req.params;
        deleteUser(id,(result)=>{
            res.status(result.status).json({message:result.message})
        })
    } catch (error) {
        res.status(500).json({message:error})
    }
}

module.exports = deleteController