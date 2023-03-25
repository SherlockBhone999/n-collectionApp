
const ItemModel = require('./model')
const path = require('path')
const multer = require('multer')
const {uploadFile } = require('./gdrive')
const { listFile , downloadFile2, deleteFile  } = require('./gdrive')



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
  console.log('gonna fetch img using : ', req.body)
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
  const {profileImgLink, _id} = req.body
  deleteFile(profileImgLink)
}

const getItemFromDB = (req,res) => {
  const {gdriveId} = req.body
  console.log(gdriveId)
  ItemModel.findOne({profileImgLink : gdriveId})
  .then((data) => {
    res.json(data)
  })
}

const getListFromDB = (req, res) => {
  const { category } = req.body
  console.log(req.body)
  if(category === ''){
    ItemModel.find()
    .then(data =>{
      res.json(data)
    })
  }else{
    ItemModel.find({category : category})
    .then( (data) => {
      res.json(data)
    })
  }
}


module.exports = { saveItem , sendImage, getGdriveList, saveInBackend , deleteItem, getItemFromDB, getListFromDB }

