const path   = require( "path" )
const mkdirp = require( "mkdirp" )

// 
// Provides a simple method to assign working dir paths
//

function initWorkingDirManager( injectables ) {

  let { config } = injectables

  // NOTE: sync is ok here as it is done only on startup
  // TODO: do mkdirp in repo prepare and get rid of it
  mkdirp.sync( config.localReposPath )

  return {
    pathFor: ( repoHash ) => {
      return path.join( config.localReposPath, repoHash )
    }
  }

}

module.exports = initWorkingDirManager