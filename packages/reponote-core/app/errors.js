// TODO: can use classes for this? Won't break stacktraces?

const util = require( "util" )

function AppError( message ) {
  Error.captureStackTrace( this, this.constructor )
  this.name = this.constructor.name
  this.message = message
}

util.inherits( AppError, Error )


function ValidationError( errors ) {
  Error.captureStackTrace( this, this.constructor )
  this.name = this.constructor.name
  this.message = "validation errors present"
  this.errors = errors
}

util.inherits( ValidationError, AppError )


module.exports = {
  AppError,
  ValidationError,
}
