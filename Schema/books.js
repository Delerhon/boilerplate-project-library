const mongoose = require('mongoose')
const colors = require('colors')
require('dotenv').config()

mongoose.Promise = global.Promise;

// Connect MongoDB at default port 27017.
mongoose.connect(process.env.MONGO_URI + process.env.MONGO_DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(  ()      => { console.log('MongoDB Connection Succeeded.'.bgGreen.white) })
.catch( (err)   => { console.log(`Error in DB connection: ' + ${err}`.bgRed.black) })


// Declare the Schema of the Mongo model
const book = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    comments: [{
        type:String
    }]
},
{
    virtuals: {
        commentcount: {
            get() {
                return this.comments.length
            }
        }
    }
});

//Export the model
module.exports = mongoose.model('Book', book);
