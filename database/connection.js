module.exports = () => {
    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    
    const userScheme = new Schema({
        name: String,
        age: Number
    });
    
    mongoose.connect("mongodb://localhost:27017/usersdb", { useUnifiedTopology: true, useNewUrlParser: true });
    
    const User = mongoose.model("User", userScheme);
    const user = new User({
        name: "Bill",
        age: 41
    });
    
    user.save(function(err){
        mongoose.disconnect();  // отключение от базы данных
          
        if(err) return console.log(err);
        console.log("Сохранен объект", user);
    });
}

// const uri = 'mongodb://hostname:27017';

// const client = new MongoClient(uri);

// async function run() {
//     try {
//       // Connect the client to the server
//       await client.connect();
//       // Establish and verify connection
//       await client.db("admin").command({ ping: 1 });
//       console.log("Connected successfully to server");
//     } finally {
//       // Ensures that the client will close when you finish/error
//       await client.close();
//     }
//   }
//   run().catch(console.dir);