const crypto     = require( "crypto" )
const url        = require( "url" )
const validateJs = require( "validate.js" )

const { ValidationError }   = require( "app/errors" )
const { cachedProperty,
        assignWhitelisted } = require( "app/utils/classUtils" )

class RepoAuthData {

  static get attributes() { return {
    // TODO: url validation temporarily commented out b/c validate.js claims
    // localhost is not a valid url
    url:  { presence: true /*, url: true */ },
    user: { presence: true },
    pwd:  { presence: true },
  } }

  constructor( params ) {
    assignWhitelisted( this, params )
  }

  validate() {
    let errors = validateJs( this, this.constructor.attributes )
    if ( errors ) {
      throw new ValidationError( errors )
    }
  }

  get urlWithAuth() {
    return cachedProperty( this, "_urlWithAuth", () => {
      let urlObj
      urlObj = url.parse( this.url )
      urlObj.auth = `${ this.user }:${ this.pwd }`
      return urlObj.format()
    } )
  }

  get hash() {
    return cachedProperty( this, "_hash", () => {
      const hash = crypto.createHash( "sha256" )
      hash.update( this.urlWithAuth )
      return hash.digest( "hex" )
    } )
  }

}

module.exports = RepoAuthData