const BaseService = require( "app/services/BaseService" )

class FetchNoteService extends BaseService {

  async call( command ) {

    let repoHandler = this.createRepoHandler( command )
    
    await repoHandler.prepare()
    await repoHandler.checkoutNewest()
    let revision    = await repoHandler.getCurrentRevision()
    let fileContent = await repoHandler.readFile( command.filePath )

    return { revision, fileContent }
  }

}

module.exports = FetchNoteService