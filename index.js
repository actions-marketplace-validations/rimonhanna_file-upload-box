const core = require("@actions/core");
const spsave = require('spsave').spsave

try {
  // Get action inputs.
  const siteUrl = core.getInput("SITE_URL") || ''
  const clientId = core.getInput('CLIENT_ID') || ''
  const clientSecret = core.getInput('CLIENT_SECRET') || ''
  const realm = core.getInput('REALM') || ''
  const destinationPath = core.getInput('DESTINATION_PATH')
  const sourcePath = (core.getInput('SOURCE_PATH') || '').split(';')
  
  // Define SPSave Configuration
  const coreOptions = {
    siteUrl: siteUrl
  }

  const credentials = {
    clientId: clientId,
    clientSecret: clientSecret,
    realm: realm
  }

  const fileOptions = {
    folder: destinationPath,
    glob: sourcePath
  }

  // Upload to SPO
  spsave(coreOptions, credentials, fileOptions).catch((err) => {
    throw new Error(err)
  })
} catch (error) {
  console.error(error)
  core.setFailed(error)
}
