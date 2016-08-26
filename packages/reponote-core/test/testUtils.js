const { execSync } = require( "child_process" )

function logExceptions( callback ) {
  try {
    callback()
  } catch ( exception ) {
    console.error( "------------------------------------------------" )
    console.error( "----------------- EXCEPTION --------------------" )
    console.error( "------------------------------------------------" )
    console.error( exception.toString() )
    console.error( exception.stack )
    console.error( "------------------------------------------------" )
    throw exception
  }
}

module.exports = {
  logExceptions,
}