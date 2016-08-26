const validateJs            = require( "validate.js" )
const { ValidationError }   = require( "app/errors" )
const { assignWhitelisted } = require( "app/utils/classUtils" )

class BaseCommand {

  constructor( params ) {
    assignWhitelisted( this, params )
  }

  get repoUrlWithAuth() { return this.repoAuthData.urlWithAuth }
  
  validate() {
    let attrs = this.constructor.attributes
    let errors = validateJs( this, attrs )
    if ( errors ) {
      throw new ValidationError( errors )
    }
  }

  assignWorkingDir( workingDir ) {
    this.repoWorkingDir = workingDir
  }

}

module.exports = BaseCommand