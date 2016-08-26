const initExpressApp               = require( "app/init/initExpressApp" )
const initGlobalCommandDispatcher  = require( "app/init/initGlobalCommandDispatcher" )
const initWorkingDirManager        = require( "app/init/initWorkingDirManager" )

//
// Manages global state and long living objects, falicitates (some) dependency
// injection
//

class AppContainer {

  // Poor man's dependency injection
  constructor( primaryInjectables ) {

    // NOTE: order matters
    this.config           = primaryInjectables.config
    this.ServiceProvider  = primaryInjectables.ServiceProvider

    // Disputable...
    let passedInjectables  = this 

    this.commandDispatcher = initGlobalCommandDispatcher( passedInjectables )
    this.workingDirManager = initWorkingDirManager( passedInjectables )
    this.expressApp        = initExpressApp( passedInjectables )
  }

}

module.exports = AppContainer
