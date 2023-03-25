
const { Router } = require('express')
const router = Router()

const { saveItem, sendImage, getGdriveList, saveInBackend, deleteItem , getItemFromDB , getListFromDB , updateItem } = require('./modelController')


router.get('/allgdrivelist', getGdriveList )


//frontend send image to backend and save it
router.post('/saveimg', saveInBackend.single('img') , (req,res)=>{
  console.log('img sent from frontend and saved as ' + req.file.filename)
  res.json(req.file.filename)
})


//upload the image that is just saved to google drive and also create mongodb model
router.post('/upload', saveItem )



//temp comment out to try delete
router.post('/fetchimgfromgdrive', sendImage )


router.post('/fetchitemfromdb', getItemFromDB )


router.post('/delete', deleteItem )
router.post('/fetchlistfromdb', getListFromDB )
router.post('/update', updateItem )

module.exports = router

