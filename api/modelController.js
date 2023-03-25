
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
  ItemModel.findByIdAndDelete(_id)
  .then(()=>{
    console.log('deleted')
  })
}

const getItemFromDB = (req,res) => {
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


module.exports = { saveItem , sendImage, getGdriveList, saveInBackend , deleteItem, getItemFromDB, getListFromDB , updateItem }

/*
_id: '641f28b47fef465881c9f27c',
  profileImgLink: '1fZk1hNoMXSUANR9hgn5Fp7e0IdE3_p_j',
  name: 'invincible_from_start',
  category: 'manhua',
  enjoyedYear: '',
  youtubeLinks: [ { videoLink: '' } ],
  imgLinks: [ { imgLink: '' } ],
  myComment: '',
  reasonToLike: '',
  myRating: 7,
  addedDate: '2023-03-25T17:00:36.999Z',
  __v: 0,
  parents: [ '1tfJZleWaOcBsRa12hVoAxjiCWIwU1Yse' ],
  id: '1fZk1hNoMXSUANR9hgn5Fp7e0IdE3_p_j',
  imgNameInBackend: ''
*/