
const {ItemModel, CategoryModel} = require('./model')
const path = require('path')
const multer = require('multer')
//const {uploadFile } = require('./gdrive')
const { listFile , downloadFile2, deleteFile , uploadFile } = require('./gdrive')
require('dotenv').config()
const fs = require('fs')



const uploadImageAndCreateItem = async (req, res) => {
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
    category,
    previousImgName
  } = req.body
  
  const categoryList = await CategoryModel.find()
  const categoryArray = []
  categoryList.map(item =>{
    categoryArray.push(item.category)
  })
  
  if(!categoryArray.includes(category)){
    CategoryModel.create({category})
    .then((data)=>{
      console.log('category created', data)
    })
  }
  
  
  const nameForgdrive = name
  uploadFile(nameForgdrive,imgNameInBackend ).then(id => {
    const profileImgLink = id
    ItemModel.create({ profileImgLink, name, enjoyedYear, youtubeLinks, imgLinks, myComment, reasonToLike, myRating, category })
    .then((res)=>{ 
      console.log('created item in mongoDB as :')
      console.log(res)
      setTimeout(()=>{
        deleteImageInImageStation(imgNameInBackend)
      },5000)
      setTimeout(()=>{
        if(previousImgName){
          const name = `${previousImgName}.jpg`
          deleteImageInImageStation(name)
        }
      },3000)
    })
    
  })
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
    console.log('deleted item in db :' + _id )
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




const updateItem = async (req,res) =>{
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
  
  const categoryList = await CategoryModel.find()
  const categoryArray = []
  categoryList.map(item =>{
    categoryArray.push(item.category)
  })
  
  if(!categoryArray.includes(category)){
    CategoryModel.create({category})
    .then((data)=>{
      console.log('category created', data)
    })
  }

  ItemModel.findByIdAndUpdate(_id, { profileImgLink, name, category, enjoyedYear, youtubeLinks, imgLinks, myComment, reasonToLike, myRating, addedDate})
  .then((data)=>{
    console.log('updated')
  })

}


const deleteImageInImageStation = (name) => {
    fs.unlink(`imageStation/${name}` , (err)=>{
    console.log('deleted img in imageStation :', name)
    })
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

const createCategory = (req,res) =>{
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

const deleteCategory = (req,res) => {
  const {_id} = req.body
  CategoryModel.findByIdAndDelete(_id)
  .then((data)=>{
    console.log('deleted category ', data)
  })
}

const updateCategory = (req,res) => {
  const {_id,category} = req.body
  CategoryModel.findByIdAndUpdate(_id,{category})
  .then(data=>{
    console.log('updated category', data)
  })
}

/*
const getItemFromDBWithId = (req, res) => {
  const {_id} = req.body
  ItemModel.findOne({_id : _id})
  .then(data => {
    res.json(data)
  })
}
*/

const sendImageFromBackendOrGdrive = (req,res) =>{
  const {name, id} = req.body
  fs.readdir('imageStation', function (err, files) {
      if (err) {
          return console.log('Unable to scan directory: ' + err);
      }
      if(files.includes(`${name}.jpg`)){
        sendImageToClient(res,name)
      }else{
        fetchImageFromGdriveAndSendIt(name,id,res)
      }
      });
  
}




const sendImageToClient = (res,name) => {
  const options = { root : 'imageStation' };
  res.sendFile(`./${name}.jpg`, options)
}

const fetchImageFromGdriveAndSendIt = async (name, id,res) => {
  await downloadFile2(id,name,res)
}

module.exports = { uploadImageAndCreateItem , saveInBackend , deleteItem, getListFromDB , updateItem , loginTest, createCategory , getCategoryList, deleteCategory , updateCategory , sendImageFromBackendOrGdrive }