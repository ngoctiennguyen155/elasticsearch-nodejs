const { Client } = require('@elastic/elasticsearch');
const client = new Client({ node: 'http://localhost:9200' }) // connecet elastic clound
const bcrypt = require('bcryptjs');
// create user
async function createUser (name,email,password,age,date,address,cb) { 
    const userExist = await findUser(email);
    if(userExist) cb({status:"400",message:"User Exist"})
    else{
        const salt = bcrypt.genSaltSync(10);
        const passhash = bcrypt.hashSync(password,salt); //hash password bf store
        await client.index({
            index: 'users',
            body: {
                name,
                email,
                password:passhash,
                age,
                date,
                address
            }
        })
        cb({status:"201",message:"User Created"})
    }
    
    
}

// find user
async function findUser (email) {
    const { body } = await client.search({
        index: 'users',
        // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
         body: {
           query: {
             match: { email }
           }
         }
      })
      return body.hits.hits[0];
}
async function findUserById (id) {
    const { body } = await client.search({
        index: 'users',
        // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
         body: {
           query: {
             match: { _id:id }
           }
         }
      })
      return body.hits.hits[0];
}
// delete user
async function deleteUser (id,cb) {
    const userExist = await findUserById(id);
    if(userExist) {
        const { body } = await client.delete({
            index:'users',
            id:id
        })
        cb({status:"200",message:"User deleted."})
    }else {
        cb({status:"404",message:"User not found."})
    }
}
//get all users
async function getAllUsers (email) {
    const { body } = await client.search({
        index: 'users',
        // type: '_doc', // uncomment this line if you are using Elasticsearch ≤ 6
        //  body: {
        //    query: {
        //      match: { name: 'tien' }
        //    }
        //  }
      })
      return body.hits.hits;
}

async function updateUser (user, cb) {
    try {
        const oldUser = await findUserById(user._id);
        if(!oldUser) {
            console.log("Update failed.");
            cb({status:400,message:"Update failed."});
        }
        //console.log(oldUser);
        const newUser = Object.assign(oldUser._source,user);
        const {name,email,password,age,date,address} = newUser;
        console.log(newUser);
        const salt = bcrypt.genSaltSync(10);
        const passhash = bcrypt.hashSync(password,salt); //hash password bf store
        await client.update({
            index: 'users',
            id: newUser._id,
            body: {
                doc: {
                    name,
                    email,
                    password:passhash,
                    age,
                    date,
                    address
                }
            }
        })
        console.log("Update success");
        cb({status:200,message:"Update success."});
    } catch (error) {
        console.log(error);
        cb({status:500,message:error});
    }
    
}

module.exports = {createUser,findUser,deleteUser,getAllUsers,updateUser,findUserById}