
const ItemModel = require('./model')
const path = require('path')
const {uploadFile } = require('./gdrive')



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
    imgNameInBackend
  } = req.body
  const nameForgdrive = name
  console.log(req.body)
  
  uploadFile(nameForgdrive,imgNameInBackend ).then(id => {
    const profileImgLink = id
    ItemModel.create({ profileImgLink, name, enjoyedYear, youtubeLinks, imgLinks, myComment, reasonToLike, myRating })
    .then((res)=> console.log(res))
  })
}



module.exports = { saveItem }

/*
const getItemlist = async (req, res) =>{
  const list = await ItemModel.find({},{"_id":1})
  res.json(list)
  console.log('getlist'+list)
}

const getItem = async (req, res ) =>{
  const {id} = req.params
  const item = await ItemModel.findOne({ "_id": id } )
  const options = { root : path.join(__dirname) }

  res.sendFile(`./fakeImages/${item.profileImgLink}`, options)
  console.log('sent img '+ id)
}
*/