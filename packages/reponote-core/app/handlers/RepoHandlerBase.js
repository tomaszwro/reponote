class RepoHandlerBase {

  async writeAndCommit( filePath, newContent ) {
    await this.writeFile( filePath, newContent )
    await this.addFile( filePath )
    await this.commit( filePath )
  }

  async handleConflict( filePath ) {
    let content = await this.readFile( filePath )
    let normalizedContent = this.normalizeConflicts( content )
    await this.resolve()
    await this.writeAndCommit( filePath, normalizedContent )
  } 
  
  async readFileList() {
    let statusOutput = await this.listFiles()
    let fileList = this.parseFileList( statusOutput )
    return fileList
  }

  async getCurrentRevision() {
    return ( await this.readCurrentRevision() ).trim()
  }

  async prepare() {
    try {
      await this.mkdir()
      await this.clone()
    } catch ( error ) {
      if ( error.code === "EEXIST" ) {
        // TODO: can be done in background
        await this.pull()
      } else {
        throw error
      }
    }
  }

  commitMessageFor( filePath ) {
    return `"reponote commit ${ filePath }"`
  }

  normalizedChunk( variantA, variantB ) {
    return (
      `----- conflicting changes ------\n` +
      variantA                             +
      `----- versus -----\n`               +
      variantB                             +
      `----- end of conflicting changes -----\n`
    )
  }

  parseFileList( fileList ) {
    return fileList.split( "\n" ).slice( 0, -1 )
  }

  // 
  // Talking to the command adapter
  // 

  command( ...args ) {
    return this.commandPort.run( this.repoWorkingDir, ...args )
  }

  writeFile( filePath, newContent ) {
    return this.commandPort.write( this.repoWorkingDir, filePath, newContent )
  }

  readFile( filePath ) {
    return this.commandPort.read( this.repoWorkingDir, filePath )
  }

  mkdir() {
    return this.commandPort.mkdir( this.repoWorkingDir )
  }


}

module.exports = RepoHandlerBase