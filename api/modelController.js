
const ItemModel = require('./model')
const path = require('path')
const multer = require('multer')
const {uploadFile } = require('./gdrive')
const { downloadFile, listFile , downloadFile2 } = require('./gdrive')



const saveItem = (req, res) => {
  const {
    profileImg,
    name,
    enjoyedYear,
    youtubeLinks,
    imgLinks,
    myComment,
    reasonToLike,
    myRating,
    imgNameInBackend,
    category
  } = req.body
  const nameForgdrive = name
  console.log(req.body)
  
  uploadFile(nameForgdrive,imgNameInBackend ).then(id => {
    const profileImgLink = id
    ItemModel.create({ profileImgLink, name, enjoyedYear, youtubeLinks, imgLinks, myComment, reasonToLike, myRating, category })
    .then((res)=>{ 
      console.log('created item in mongoDB as :')
      console.log(res)
    })
  })
}


const getGdriveList = (req,res)=>{
  listFile().then(filelist => {
    res.json(filelist)
  })
}


const sendImage = async (req, res) => {
  const {name, id} = req.body
  await downloadFile2(id,name,res)
}


const storage = multer.diskStorage({
  destination : (req,file,cb)=>{
    cb(null, 'imageStation')
  },
  filename: (req,file,cb) => {
    cb(null, file.originalname)
  }  
})
const saveInBackend = multer({storage:storage})


//findByIdAndUpdate(_id, {})
//findByIdAndDelete(_id)

const deleteItem = (req,res) => {
  console.log(req.body)
}

const getItemFromDB = (req,res) => {
  console.log('gonna fetch item from db :', req.body )
  const {gdriveId} = req.body
  ItemModel.find({profileImgLink : gdriveId})
  .then((data) => {
    res.json(data)
  })
}


module.exports = { saveItem , sendImage, getGdriveList, saveInBackend , deleteItem, getItemFromDB }

/*
{"_id":{"$oid":"641d5b5fd9d60f99318019d9"},"profileImgLink":"1qCCmVAhe2BJ51463gUolrgzSh8Z1swEB","name":"perfect_half","category":"hentai","enjoyedYear":"2020","youtubeLinks":[],"imgLinks":[],"myComment":"the goat","reasonToLike":"most beautiful art style i have ever seen till now","myRating":{"$numberInt":"10"},"addedDate":{"$date":{"$numberLong":"1679645535379"}},"__v":{"$numberInt":"0"}}
*/