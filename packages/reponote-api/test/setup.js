const config              = require( "config" )
const AppContainer        = require( "app/AppContainer" )
const ServiceProviderMock = require( "reponote-core/test/mocks/ServiceProviderMock" )

function setup( before, after ) {
  
  let context = {}

  before( () => {
    context.appContainer = setupAppContainer()
  } )

  return context
}

function setupAppContainer() {
  return new AppContainer( {
    ServiceProvider: ServiceProviderMock,
    config: config
  } )
}

module.exports = setup