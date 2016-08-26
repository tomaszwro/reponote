const RepoHandlerBase = require( "app/handlers/RepoHandlerBase" )

// TODO: not sure if it should be a subclass or some "strategy" or "driver" class
// TODO: most elementary commands can be defined in a simple map

class RepoHandlerHg extends RepoHandlerBase {

  constructor( { repoUrlWithAuth, repoWorkingDir }, { HgCommandAdapter } ) {
    super()
    this.repoUrlWithAuth = repoUrlWithAuth
    this.repoWorkingDir = repoWorkingDir
    this.commandPort = new HgCommandAdapter()
  }

  checkoutNewest() {
    return this.command( "update", "--clean", "default" )
  }

  checkoutRevision( revision ) {
    return this.command( "update", "--clean", revision )
  }

  readCurrentRevision() {
    return this.command( "parent", "--template", "{node}" )
  }

  listFiles() {
    return this.command( "status", "--clean", "--no-status" )
  }

  pushToRemote() {
    return this.command( "push" )
  }

  addFile( filePath ) {
    // NOTE: not always needed, but won't harm
    return this.command( "add", filePath )
  }

  commit( filePath ) {
    return this.command( "commit", "--message", this.commitMessageFor( filePath ) )
  }

  mergeHeads() {
    return this.command( "merge", "--tool", "hgmerge" )
  }

  resolve() {
    return this.command( "resolve", "--mark", "--all" )
  }

  clone() {
    return this.command( "clone", this.repoUrlWithAuth, "." )
  }

  pull() {
    return this.command( "pull" )
  }

  normalizeConflicts( content ) {
    return content.replace( this.mergeRegex, (_, local, __, other) => {
      return this.normalizedChunk( local, other )
    } )
  }

  get mergeRegex() {
    return /<<<<<<< local\n([\s\S]*)\|\|\|\|\|\|\| base\n([\s\S]*)=======\n([\s\S]*)>>>>>>> other\n/g
  }

  async converge( filePath ) {
    try {
      await this.mergeHeads()
      // TODO: wrong, this can go awry if commit throws
      await this.commit( filePath )
    } catch ( error ) {
      if ( error.code === 1 ) {
        await this.handleConflict( filePath )
      } else if ( error.code === 255 ) {
        // It means there's nothing to merge
      } else {
        throw error
      }
    }
  }
}

module.exports = RepoHandlerHg