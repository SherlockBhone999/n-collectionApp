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



async function downloadFile(realFileId){
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  

 // const {GoogleAuth} = require('google-auth-library');
  
  const {google} = require('googleapis');

  const auth = new google.auth.GoogleAuth({
    keyFile: './googlekey.json',
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const service = google.drive({version: 'v3', auth});

  fileId = realFileId;
  try {
    const file = await service.files.get({
      fileId: fileId,
      alt: 'media',
    });
    console.log(file.status);
    return file.status;
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}

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
    arr.forEach(function(file) {
      console.log('Found file', file);
    });
    return arr;

  } catch (err) {
    throw err;
  }
}


async function downloadFile2(realFileId,name){
  // Get credentials and build service
  // TODO (developer) - Use appropriate auth mechanism for your app
  

 // const {GoogleAuth} = require('google-auth-library');
  
  const {google} = require('googleapis');

  const auth = new google.auth.GoogleAuth({
    keyFile: './googlekey.json',
    scopes: 'https://www.googleapis.com/auth/drive',
  });
  const service = google.drive({version: 'v3', auth});

  fileId = realFileId;
  var dest = fs.createWriteStream(`./imageStation/${name}`)
  try {
        service.files.get({
                fileId: fileId,
                alt: "media"
            }, { responseType: "stream" },
            (err, res) => {
                res.data
                    .on("end", () => {
                        console.log("Downloaded in backend");
                    })
                    .on("error", err => {
                        console.log("Error", err);
                    })
               .pipe(dest); // i want to sent this file to client who request to "/download"
               
            }
        )
  
  } catch (err) {
    // TODO(developer) - Handle error
    throw err;
  }
}



// https://drive.google.com/file/d/1uh59uI-5L1Rls3XzcFhOZByyAhCg7mid/view?usp=share_link

module.exports = { uploadFile, downloadFile, listFile , downloadFile2 }


