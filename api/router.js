const fs = require('fs')
const multer = require('multer')
const { Router } = require('express')
const path = require('path')
const router = Router()

const { saveItem } = require('./modelController')
const { downloadFile, listFile , downloadFile2 } = require('./gdrive')


const storage = multer.diskStorage({
  destination : (req,file,cb)=>{
    cb(null, 'imageStation')
  },
  filename: (req,file,cb) => {
    cb(null, file.originalname)
  }  
})

const saveInBackend = multer({storage:storage})

//frontend send image to backend and save it
router.post('/sendimg', saveInBackend.single('img') , (req,res)=>{
  console.log('img sent from frontend and saved as ' + req.file.filename)
  res.json(req.file.filename)
})

//upload the image that is just saved to google drive and also create mongodb model
router.post('/upload', saveItem )

//send image file from back to front
router.get('/', (req,res)=>{
  //const options = { root : path.join(__dirname) };
  const options = { root : 'imageStation' };
  res.sendFile('./dice.jpg', options)
  console.log('send')
})

router.get('/allgdrivelist', (req,res)=>{
  listFile().then(filelist => {
    res.json(filelist)
  })
})

router.post('/fetchitem', async (req,res) => {
  const {name, id} = req.body
  console.log(req.body)
  await downloadFile2(id,name).then(()=>{
    const options = { root : 'imageStation' };
    res.sendFile(`./2_3.jpg`, options)
    console.log('sent img ',name)
  })
})

module.exports = router

/*
router.get('/', (req,res)=>{
  const options = { root : path.join(__dirname) };
  res.sendFile('./fakeImages/11.jpg',options)
  console.log('send')
})
*/
/*
// 1QTy-WPP_nmA8wq8XQdqmdtL3zhubkufH
// 1uh59uI-5L1Rls3XzcFhOZByyAhCg7mid
router.get('/download',async (req,res)=>{
  await downloadFile2("1uh59uI-5L1Rls3XzcFhOZByyAhCg7mid")
  console.log('send img from gdrive to frontend')
} )
  
router.get('/listFile', (req,res)=>{
  listFile()
  console.log('listfile called')
})

router.get('/list/:id', getItem )

router.get('/list', getItemlist  ) 

router.get('/:category', (req,res)=>{
  res.json(req.params)
})
*/