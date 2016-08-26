// 
// Async command queue. Enqueue a task & get a promise. Basically works by
// stacking promises on top of each other, beginning with an already resolved
// one.
// 

class SimpleCommandQueue {

  constructor( nextProcessor ) {
    this.nextProcessor = nextProcessor
    this.lastPromise = Promise.resolve( {} )
  }

  process( command ) {

    let commandExecutedPromise = new Promise( ( resolveFn, rejectFn ) => {

      let processAndResolve = () => {
        this.nextProcessor.process( command ).then(
          result => resolveFn( result ),
          error  => rejectFn( error )
        )
      }

      this.lastPromise.then(
        processAndResolve,
        processAndResolve
      )
    } )

    // NOTE: this relies on the fact that Promise's executor executes
    // immediately (which is guaranteed, I guess), otherwise lastPromise value
    // would already have changed.

    this.lastPromise = commandExecutedPromise
    return commandExecutedPromise
  }

}

module.exports = SimpleCommandQueue
