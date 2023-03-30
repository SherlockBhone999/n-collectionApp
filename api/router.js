
const { Router } = require('express')
const router = Router()

const { uploadImageAndCreateItem , saveInBackend, deleteItem , getListFromDB , updateItem, loginTest, createCategory , getCategoryList , deleteCategory , updateCategory , sendImageFromBackendOrGdrive } = require('./modelController')



//frontend send image to backend and save it
router.post('/saveimg', saveInBackend.single('img') , (req,res)=>{
  console.log('img sent from frontend and saved as ' + req.file.filename)
  res.json(req.file.filename)
})


//upload the image that is just saved to google drive and also create mongodb model
router.post('/upload', uploadImageAndCreateItem )

router.post('/delete', deleteItem )
router.post('/fetchlistfromdb', getListFromDB )
router.post('/update', updateItem )

router.post('/login', loginTest )

router.post('/createcategory', createCategory )
router.get('/getcategorylist', getCategoryList )
router.post('/deletecategory', deleteCategory )
router.post('/updatecategory', updateCategory )

router.post('/fetchimgfrombackend', sendImageFromBackendOrGdrive )


module.exports = router

