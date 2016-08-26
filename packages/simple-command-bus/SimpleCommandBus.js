class SimpleCommandBus {

  constructor( serviceProvider ) {
    this.serviceProvider = serviceProvider
  }

  process( command ) {
    // NOTE: command passed both to serviceProvider.get (to pick the right
    // service) and to call (to do the actual processing)
    let service = this.serviceProvider.get( command )
    return service.call( command )
  }

}

module.exports = SimpleCommandBus