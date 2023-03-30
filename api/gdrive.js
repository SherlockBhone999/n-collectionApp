const fs = require('fs')
const { google } = require('googleapis')


const GOOGLE_API_FOLDER_ID = '1tfJZleWaOcBsRa12hVoAxjiCWIwU1Yse'

const auth = new google.auth.GoogleAuth({
            keyFile: './googlekey.json',
            scopes: ['https://www.googleapis.com/auth/drive']
        })

const driveService = google.drive({ version: 'v3', auth })

async function uploadFile(nameForgdrive, imgNameInBackend){
    try{
      
        const fileMetaData = {
            'name': `${nameForgdrive}.jpg`,
            'parents': [GOOGLE_API_FOLDER_ID]
        }

        const media = {
            mimeType: 'image/jpeg',
            body: fs.createReadStream(`./imageStation/${imgNameInBackend}`)
        }

        const response = await driveService.files.create({
            resource: fileMetaData,
            media: media,
            field: 'id'
        })
        return response.data.id

    }catch(err){
        console.log('Upload file error', err)
    }
}


/*

uploadFile().then(data => {
    console.log(data)
    //https://drive.google.com/uc?export=view&id=
})

*/




async function listFile(){
  try {
    const res = await driveService.files.list({
      q: 'mimeType=\'image/jpeg\'',
      fields: 'nextPageToken, files(id, name, parents)',
      spaces: 'drive',
    });
    const array = res.data.files
    //only get files inside the desinated folder
    const arr = array.filter(item => item.parents.includes(GOOGLE_API_FOLDER_ID))
    console.log('Found '+ arr.length +' files in gdrive')
    /*
    arr.forEach(function(file,index) {
      console.log('Found file ',index+1 ,file);
    });
    */
    return arr;

  } catch (err) {
    throw err;
  }
}

const sendImageToClient = (res,name) => {
  const options = { root : 'imageStation' };
  res.sendFile(`./${name}.jpg`, options)
}



async function downloadFile2(realFileId,name,res1){

  fileId = realFileId;
  var dest = fs.createWriteStream(`./imageStation/${name}.jpg`)
  try {
        driveService.files.get({
                fileId: fileId,
                alt: "media"
            }, { responseType: "stream" },
            (err, res) => {
                res.data
                    .on("end", () => {
                        console.log("Downloaded in backend");
                        setTimeout(()=>{
                          sendImageToClient(res1,name)
                        }, 500 )
                    })
                    .on("error", err => {
                        console.log("Error", err);
                    })
               .pipe(dest);
            }
        )
  
  } catch (err) {
    throw err;
  }
}

async function deleteFile (realFileId){
  const fileId = realFileId
  const file = await driveService.files.delete({
    fileId : fileId
  })
  return file.status
}


// https://drive.google.com/file/d/1uh59uI-5L1Rls3XzcFhOZByyAhCg7mid/view?usp=share_link

module.exports = { uploadFile , listFile , downloadFile2, deleteFile }


