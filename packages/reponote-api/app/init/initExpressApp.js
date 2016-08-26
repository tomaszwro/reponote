const express        = require( "express" )
const logger         = require( "morgan" )
const bodyParser     = require( "body-parser" )
const RepoController = require( "app/controllers/RepoController" )

// 
// sets up the express app
// 

function initExpressApp( injectables ) {

  const app = express()

  // app.use( logger( "dev" ) )
  app.use( bodyParser.json() )
  app.use( bodyParser.urlencoded( { extended: false } ) )

  //
  // Routes
  //

  // TODO: extract routes

  app.get( "/files", ( request, response ) => {
    // disputable...
    let augmentedInjectables = Object.assign( {}, injectables, { request, response } )
    new RepoController( augmentedInjectables ).getIndex()
  } )

  app.get( "/files/*", ( request, response ) => {
    // disputable...
    let augmentedInjectables = Object.assign( {}, injectables, { request, response } )
    new RepoController( augmentedInjectables ).getPath()
  } )

  app.post( "/files/*", ( request, response ) => {
    // disputable...
    let augmentedInjectables = Object.assign( {}, injectables, { request, response } )
    new RepoController( augmentedInjectables ).postPath()
  } )

  // catch 404 and forward to error handler
  app.use( ( req, res, next ) => {
    let err = new Error( "Not Found" )
    err.status = 404
    next( err )
  } )

  // development error handler
  // will print stacktrace
  if ( app.get( "env" ) === "development" ) {
    app.use( ( err, req, res, next ) => {
      res.status( err.status || 500 )
      res.render( "error", {
        message: err.message,
        error: err
      } )
    } )
  }

  // production error handler
  // no stacktraces leaked to user
  app.use( ( err, req, res, next ) => {
    res.status( err.status || 500 )
    res.render( "error", {
      message: err.message,
      error: {}
    } )
  } )
  
  return app
}

module.exports = initExpressApp