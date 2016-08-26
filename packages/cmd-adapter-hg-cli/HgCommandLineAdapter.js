const path = require( "path" )
const fs   = require( "mz/fs" )
const cp   = require( "mz/child_process" )

const BINARY = "hg"
const ENCODING = "utf8"

const COMMAND_WHITELIST = [
  "add", "clone", "commit", "merge",
  "parent", "pull", "push", "resolve",
  "status", "update"
]

class HgCommandLineAdapter {

  async run( workingDir, ...args ) {
    this.validate( args )
    let [stdout, stderr] = await cp.execFile( BINARY, args, { cwd: workingDir } )
    return stdout
  }

  // TODO: shared with cmd-adapter-git-cli, reuse?

  read( workingDir, filePath ) {
    return fs.readFile( path.join( workingDir, filePath ), ENCODING )
  }

  write( workingDir, filePath, newContent ) {
    return fs.writeFile( path.join( workingDir, filePath ), newContent, ENCODING )
  }

  mkdir( workingDir ) {
    return fs.mkdir( workingDir )
  }

  // 
  // Private
  // 

  validate( args ) {
    if ( ! COMMAND_WHITELIST.includes( args[0] ) ) {
      throw new Error( `${ this.constructor.name }: invalid command` )
    }
  }

}

module.exports = HgCommandLineAdapter