require("dotenv").config();

module.exports = function() {
    if(!process.env.MONGO_URI) {
        throw new Error('Fatal error: DB Connection not available')
    }
}