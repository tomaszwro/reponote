class SampleCommand {

  constructor( message, waitTime, callback ) {
    this.message = message
    this.waitTime = waitTime || 0
    this.callback = callback || Function.prototype
  }

}

class SampleService {

  // TODO: change to have command arg in call
  constructor( command ) {
    this.command = command
  }

  call() {
    return new Promise( ( resolve, reject ) => {
      setTimeout( () => {
        if ( this.command.message ) {
          this.command.callback( this.command.message )
          resolve( `SampleService resolved with: ${ this.command.message }` )
        } else {
          // null message is a way to simulate failure
          reject( new Error( "no message given" ) )
        }
      }, this.command.waitTime )
    } )
  }

}

const COMMAND_SERVICE_MAP = {
  SampleCommand: SampleService
}

module.exports = {
  SampleCommand,
  SampleService,
  COMMAND_SERVICE_MAP,
}