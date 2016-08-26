const SimpleDispatcher = require( "simple-dispatcher" )
const SimpleCommandQueue = require( "simple-command-queue" )
const SimpleCommandBus = require( "simple-command-bus" )

//
// Creates global command dispatcher, that puts the command to the right
// command queue (per working dir) and later to the actual command bus.
//

function initGlobalCommandDispatcher( injectables ) {

  let { ServiceProvider } = injectables

  return new SimpleDispatcher( {

    dispatchBy: ( command ) => command.repoWorkingDir,

    handlerFactory: () => {
      let serviceProvider = new ServiceProvider()
      let commandBus      = new SimpleCommandBus( serviceProvider )
      let commandQueue    = new SimpleCommandQueue( commandBus )
      return commandQueue
    }
  } ) 

}

module.exports = initGlobalCommandDispatcher
