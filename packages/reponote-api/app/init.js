const config          = require( "config" )
const AppContainer    = require( "app/AppContainer" )
const ServiceProvider = require( "reponote-core/app/ServiceProvider" )

const app = new AppContainer( { ServiceProvider, config } )

module.exports = app