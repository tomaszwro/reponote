const COMMAND_SERVICE_MAP = {
  FetchNoteListCommand: require( "test/mocks/FetchNoteListServiceMock" ),
  FetchNoteCommand:     require( "test/mocks/FetchNoteServiceMock" ),
  SaveNoteCommand:      require( "test/mocks/SaveNoteServiceMock" ),
}

class HgCommandAdapterMock {
  run() {}
}

const INJECTABLES = {
  HgCommandAdapter: HgCommandAdapterMock
}

class ServiceProviderMock {
  
  constructor() {
    this.injectables = INJECTABLES 
  }

  get( command ) {
    let commandClassName = command.constructor.name
    let serviceClass = COMMAND_SERVICE_MAP[commandClassName]
    let serviceObj = new serviceClass( this.injectables )
    return serviceObj
  }

}

module.exports = ServiceProviderMock