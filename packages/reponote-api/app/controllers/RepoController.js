const BaseController       = require( "app/controllers/BaseController" )
const FetchNoteCommand     = require( "reponote-core/app/commands/FetchNoteCommand" )
const FetchNoteListCommand = require( "reponote-core/app/commands/FetchNoteListCommand" )
const SaveNoteCommand      = require( "reponote-core/app/commands/SaveNoteCommand" )

class RepoController extends BaseController {

  constructor( injectables ) {
    super() // Don't forget this guy 
    this.commandDispatcher = injectables.commandDispatcher
    this.workingDirManager = injectables.workingDirManager
    this.request           = injectables.request
    this.response          = injectables.response
  }

  // 
  // Actions
  // 

  // TODO: handle non-validation app errors (auth, etc)

  getIndex() {
    this.respond( () => {
      
      let command = new FetchNoteListCommand( {
        repoAuthData: this.extractRepoAuthData(),
      } )

      return this.processCommand( command )
    } )
  }


  getPath() {
    this.respond( () => {

      let command = new FetchNoteCommand( {
        repoAuthData: this.extractRepoAuthData(),
        filePath:     this.extractFilePath(),
      } )

      return this.processCommand( command )
    } )
  }


  postPath() {
    this.respond( () => {

      let command = new SaveNoteCommand( {
        repoAuthData: this.extractRepoAuthData(),
        filePath:     this.extractFilePath(),
        baseRevision: this.extractPayload( "baseRevision" ),
        newContent:   this.extractPayload( "newContent" ),
      } )

      return this.processCommand( command )
    } )
  }

  // 
  // Private
  // 

  processCommand( command ) {
    command.validate()
    // TODO: weird...
    command.assignWorkingDir( this.workingDirManager.pathFor( command.repoAuthData.hash ) )
    return this.commandDispatcher.process( command )
  }

}

module.exports = RepoController
