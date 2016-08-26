const BaseService = require( "app/services/BaseService" )

class SaveNoteService extends BaseService {

  async call( command ) {

    let repoHandler = this.createRepoHandler( command )

    let { filePath, baseRevision, newContent } = command

    await repoHandler.prepare()
    await repoHandler.checkoutRevision( baseRevision )
    await repoHandler.writeAndCommit( filePath, newContent )
    await repoHandler.converge( filePath )

    let revision    = await repoHandler.getCurrentRevision()
    let fileContent = await repoHandler.readFile( filePath )

    // TODO: it is not really needed here, can be done async, rethink.
    await repoHandler.pushToRemote()

    return { revision, fileContent }
  }

}

module.exports = SaveNoteService