COMMAND_SERVICE_MAP = {
  SaveNoteCommand:      require( "app/services/SaveNoteService" ),
  FetchNoteCommand:     require( "app/services/FetchNoteService" ),
  FetchNoteListCommand: require( "app/services/FetchNoteListService" ),
}

class ServiceProvider {

  constructor( injectables ) {
    this.injectables = injectables
  }

  get( command ) {
    let commandClassName = command.constructor.name
    let serviceClass = COMMAND_SERVICE_MAP[commandClassName]
    let serviceObj = new serviceClass( this.injectables )
    return serviceObj
  }
}

module.exports = ServiceProvider