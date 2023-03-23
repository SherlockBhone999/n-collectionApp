const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
  profileImgLink : { type : String , required : true },
  name : { type : String , required : true },
  category : { type : String, required : true } ,
  enjoyedYear : { type : String , required : false },
  addedDate : { type: Date, default : Date.now },
  youtubeLinks : {type : Array , default : [] },
  imgLinks : {type : Array , default : [] },
  myComment : {type : String, required : false },
  reasonToLike : { type : String, required : false },
  myRating : { type : Number , required : false, default : 0 },
})


module.exports = mongoose.model('Item', itemSchema)

