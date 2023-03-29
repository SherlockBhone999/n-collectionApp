
const {ItemModel, CategoryModel} = require('./model')
const path = require('path')
const multer = require('multer')
const {uploadFile } = require('./gdrive')
const { listFile , downloadFile2, deleteFile  } = require('./gdrive')
require('dotenv').config()
const fs = require('fs')



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
      
      setTimeout(()=>{
        clearImageStation()
      },5000)
      
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


const deleteItem = (req,res) => {
  const {profileImgLink, _id} = req.body
  deleteFile(profileImgLink)
  ItemModel.findByIdAndDelete(_id)
  .then(()=>{
    console.log('deleted')
  })
}

const getItemFromDBWithGdriveId = (req,res) => {
  const {gdriveId} = req.body
  ItemModel.findOne({profileImgLink : gdriveId})
  .then((data) => {
    res.json(data)
  })
}

const getListFromDB = (req, res) => {
  const { category } = req.body
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




const updateItem = (req,res) =>{
  const {
    _id,
    profileImgLink,
    name,
    category,
    enjoyedYear,
    youtubeLinks,
    imgLinks,
    myComment,
    reasonToLike,
    myRating,
    addedDate
  } = req.body
  
  ItemModel.findByIdAndUpdate(_id, { profileImgLink, name, category, enjoyedYear, youtubeLinks, imgLinks, myComment, reasonToLike, myRating, addedDate})
  .then((data)=>{
    console.log('updated')
  })

}


const clearImageStation = () => {
  fs.readdir('imageStation', function (err, files) {
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      } 
      //listing all files using forEach
      files.forEach(function (file) {
        fs.unlink(`imageStation/${file}` , (err)=>{
        console.log('deleted', file)
        })
      });
  });
}

const loginTest = (req, res) => {
  const {password} = req.body
  console.log(req.body)
  
  if(password===process.env.PASSWORD){
    res.json('yes')
  }else{
    res.json('no')
  }
}

const createCategoryModel = (req,res) =>{
  const {category} = req.body
  CategoryModel.create({category})
  .then(res =>{
    console.log('category created')
    console.log(res)
  })
}

const getCategoryList = (req, res) => {
  CategoryModel.find()
  .then(data => {
    res.json(data)
  })
}

const deleteCategoryModel = (req,res) => {
  const {_id} = req.body
  CategoryModel.findByIdAndDelete(_id)
  .then((data)=>{
    console.log('deleted', data)
  })
}

const updateCategoryModel = (req,res) => {
  const {_id,category} = req.body
  CategoryModel.findByIdAndUpdate(_id,{category})
  .then(data=>{
    console.log('updated', data)
  })
}


const getItemFromDBWithId = (req, res) => {
  const {_id} = req.body
  ItemModel.findOne({_id : _id})
  .then(data => {
    res.json(data)
  })
}

module.exports = { saveItem , sendImage, getGdriveList, saveInBackend , deleteItem, getItemFromDBWithGdriveId, getListFromDB , updateItem , loginTest, createCategoryModel , getCategoryList, deleteCategoryModel, updateCategoryModel , getItemFromDBWithId}


//getItemFromDBWithId