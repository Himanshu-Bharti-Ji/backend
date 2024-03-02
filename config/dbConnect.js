const { default: mongoose } = require("mongoose");
const { DB_NAME } = require("../utils/constants.js");

const dbConnect = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        //  connectionInstance.Connection.host -> jis database se connect ho rahe hai uska url pata karne ke liye
        // console.log(connectionInstance.connection);
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection Failed ", error);
        // process.exit(1) -> current process se exit karne ke liye
        process.exit(1)
    }
}

module.exports = dbConnect;