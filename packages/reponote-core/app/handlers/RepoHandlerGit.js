const RepoHandlerBase = require( "app/handlers/RepoHandlerBase" )

// TODO: not sure if it should be a subclass or some "strategy" or "driver" class
// TODO: most elementary commands can be defined in a simple map

class RepoHandlerGit extends RepoHandlerBase {

  constructor( { repoUrlWithAuth, repoWorkingDir }, { GitCommandAdapter } ) {
    super()
    this.repoUrlWithAuth = repoUrlWithAuth
    this.repoWorkingDir = repoWorkingDir
    this.commandPort = new GitCommandAdapter()
  }

  checkoutNewest() {
    return this.command( "checkout", "master" )
  }

  checkoutRevision( revision ) {
    return this.command( "checkout", revision )
  }

  readCurrentRevision() {
    return this.command( "rev-parse", "HEAD" )
  }

  listFiles() {
    return this.command( "ls-files" )
  }

  pushToRemote() {
    return this.command( "push" )
  }

  addFile( filePath ) {
    // a little different from hg, but for this purpose it's ok
    return this.command( "add", filePath )
  }

  commit( filePath ) {
    return this.command( "commit", "-m", this.commitMessageFor( filePath ) )
  }

  mergeRevision( revision ) {
    return this.command( "merge", "--no-edit", revision )
  }

  resolve() {
    return this.command( "add", "-u" )
  }

  clone() {
    return this.command( "clone", this.repoUrlWithAuth, "." )
  }

  pull() {
    return this.command( "pull" )
  }

  normalizeConflicts( content ) {
    return content.replace( this.mergeRegex, (_, local, other) => {
      return this.normalizedChunk( other, local )
    } )
  }

  get mergeRegex() {
    return /<<<<<<< HEAD\n([\s\S]*)=======\n([\s\S]*)>>>>>>> [0-9a-f]+\n/g
  }

  async converge( filePath ) {
    let commitedRevision = await this.getCurrentRevision()
    await this.checkoutNewest()
    try {
      await this.mergeRevision( commitedRevision )
    } catch ( error ) {
      if ( error.code === 1 ) {
        await this.handleConflict( filePath )
      } else {
        throw error
      }
    }
  }

}

module.exports = RepoHandlerGit