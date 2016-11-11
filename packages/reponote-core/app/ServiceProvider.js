const COMMAND_SERVICE_MAP = {
  SaveNoteCommand:      require( "app/services/SaveNoteService" ),
  FetchNoteCommand:     require( "app/services/FetchNoteService" ),
  FetchNoteListCommand: require( "app/services/FetchNoteListService" ),
}

const INJECTABLES = {
  HgCommandAdapter:  require( "cmd-adapter-hg-cli" ),
  GitCommandAdapter: require( "cmd-adapter-git-cli" ),
  RepoHandlerGit:    require( "app/handlers/RepoHandlerGit" ),
  RepoHandlerHg:     require( "app/handlers/RepoHandlerHg" ),
}

class ServiceProvider {

  constructor( injectables ) {
    this.injectables = injectables
  }

  get( command ) {
    let commandClassName = command.constructor.name
    let serviceClass = COMMAND_SERVICE_MAP[commandClassName]
    let serviceObj = new serviceClass( INJECTABLES )
    return serviceObj
  }
}

module.exports = ServiceProvider