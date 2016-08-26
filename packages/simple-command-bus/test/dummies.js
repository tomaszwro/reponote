class SampleCommand {

  constructor( message ) {
    this.message = message
  }

}

class SampleService {

  call( command ) {
    return `Result from SampleService: ${ command.message }`
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