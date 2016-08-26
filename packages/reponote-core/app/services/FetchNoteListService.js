const BaseService = require( "app/services/BaseService" )

class FetchNoteListService extends BaseService {

  async call( command ) {

    let repoHandler = this.createRepoHandler( command )

    await repoHandler.prepare()
    await repoHandler.checkoutNewest()
    let revision = await repoHandler.getCurrentRevision()
    let files    = await repoHandler.readFileList()

    return { revision, files }
  }

}

module.exports = FetchNoteListService