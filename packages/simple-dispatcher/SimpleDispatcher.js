class SimpleDispatcher {

  constructor( { handlerFactory, dispatchBy } ) {
    this.handlerFactory = handlerFactory
    this.dispatchBy = dispatchBy
    this.handlers = {}
  }

  process( payload ) {
    let hash = this.dispatchBy( payload )
    let handler = this.findOrCreateHandler( hash )
    return handler.process( payload )
  }

  findOrCreateHandler( hash ) {
    if ( ! ( hash in this.handlers ) ) {
      this.handlers[hash] = this.handlerFactory()
    }
    return this.handlers[hash]
  }

}

module.exports = SimpleDispatcher