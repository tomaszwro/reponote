const RepoAuthData = require( "reponote-core/app/RepoAuthData" )
const { AppError } = require( "reponote-core/app/errors" )

class BaseController {

  extractRepoAuthData() {
    // TODO: initializing this here is disputable, change
    return new RepoAuthData( this.request.query )
  }

  extractFilePath() {
    return this.request.params[0]
  }

  extractPayload( key ) {
    return this.request.body[key]
  }

  async respond( block ) {
    try {
      let result = await block()
      this.respondWithResult( result )
    } catch ( error ) {
      if ( error instanceof AppError ) {
        // TODO: unhardcode
        // TODO: 422 only for validation errors
        this.respondWithError( 422, error )
      } else {
        this.respondWithError( 500, error )
      }
    }
  }

  respondWithResult( result ) {
    this.response.status( 200 ).json( result )
  }

  respondWithError( status, { name, message, errors } ) {
    this.response.status( status ).json( { name, message, errors } )
  }

}

module.exports = BaseController