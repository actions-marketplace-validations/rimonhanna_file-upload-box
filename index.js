const core = require("@actions/core");
const BoxSDK = require("box-node-sdk");
const fs = require("fs");

try {

  // Get action inputs.
  let clientId = ''
  let clientSecret = ''
  let enterpriseId = ''
  let destinationFolderId = ''
  let sourcePaths = ''

  if (process.env.NODE_ENV === "offline") {
    require("dotenv").config();
    // Get action inputs.
    clientId = process.env.CLIENT_ID
    clientSecret = process.env.CLIENT_SECRET
    enterpriseId = process.env.ENTERPRISE_ID
    destinationFolderId = process.env.DESTINATION_FOLDER_ID || '0'
    sourcePaths = (process.env.SOURCE_PATH || '').split(';')
  } else {
    // Get action inputs.
    clientId = core.getInput('CLIENT_ID') || ''
    clientSecret = core.getInput('CLIENT_SECRET') || ''
    enterpriseId = core.getInput('ENTERPRISE_ID') || ''
    destinationFolderId = core.getInput('DESTINATION_FOLDER_ID') || '0'
    sourcePaths = (core.getInput('SOURCE_PATH') || '').split(';')
  }

  const credentials = {
    boxAppSettings: {
      clientID: clientId,
      clientSecret: clientSecret,
    },
    enterpriseID: enterpriseId
  }

  let output = [];
  sourcePaths.forEach(sourcePath => {
    let filename = sourcePath.split('/').slice(-1).pop()
  
    const file = {
      name: filename,
      destination: destinationFolderId,
      source: sourcePath
    }
  
    let boxSdkInstance = BoxSDK.getPreconfiguredInstance(credentials);
  
    // Get the service account client, used to create and manage app user accounts
    let boxClient = boxSdkInstance.getAnonymousClient();
  
    let stream = fs.createReadStream(file.source);

    let downloadFile = async function(id) {
      let downloadUrl = await boxClient.files.getDownloadURL(id);
      output.push(downloadUrl);
      core.setOutput('DOWNLOAD_URLs', output.join(';'));
    }
  
    // Verify that uploading a 200MB file named "Preso.ppt" to folder 12345 would succeed
    boxClient.files.preflightUploadFile(file.destination, { name: file.name, })
    .then(_ => {
      boxClient.files.uploadFile(file.destination, file.name, stream)
      .then(async items => {
        await downloadFile(items.entries[0].id);
      })
      .catch(error => { 
        if (error) {
          console.log(`Error uploading file: ${error}`);
          core.setFailed(`Error uploading file: ${error}`);
        }
      });
      
    })
    .catch(error => { 
      boxClient.files.uploadNewFileVersion(error.response.body.context_info.conflicts.id, stream).then(async items => {
        await downloadFile(items.entries[0].id);
      }).catch(fileVersionError => { 
          if (fileVersionError) {
            console.log(`Error uploading file version: ${error}`);
            core.setFailed(`Error uploading file version: ${fileVersionError}`);
          }
      });
    });
    
  });

} catch(error) {
  console.log(error);
  core.setFailed(`Error uploading file: ${error}`);
}
