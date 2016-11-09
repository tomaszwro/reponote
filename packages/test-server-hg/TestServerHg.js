const path    = require( "path" )
const cp      = require( "child_process" )
const fs      = require( "fs" )
const mkdirp  = require( "mkdirp" )

const TEST_SERVER_DIR_NAME = "TestServerHg"
const PID_FILE_NAME = "TestServerHg.pid"
const BINARY = "hg"

// TODO: extract stuff common with TestServerGit

class TestServerHg {

  //
  // Public
  //

  // TODO: crudily passing entire TEST_DATA hash, be more specific
  constructor( TEST_DATA ) {
    this.TEST_DATA = TEST_DATA
    this.testServerDirPath = path.join( TEST_DATA.testTempDir, TEST_SERVER_DIR_NAME )
    this.repoPath    = path.join( this.testServerDirPath, TEST_DATA.repoName )
    this.pidFilePath = path.join( this.testServerDirPath, PID_FILE_NAME )
  }

  createSync() {
    this.populateRepoDirContent()
    this.initRepo()
    this.startServer()
  }

  cleanupSync() {
    this.stopServer()
    this.removeDirs()
  }

  // 
  // Private
  // 

  startServer() {
    cp.execFileSync( BINARY, [
      "serve",
      "--daemon",
      "--pid-file", this.pidFilePath,
      "--repository", this.repoPath,
      "--port", this.TEST_DATA.remoteServer.hg.port,
      "--config", "web.push_ssl=No",
      "--config", "web.allow_push=*",
    ] )
  }

  stopServer() {
    process.kill( this.readPidSync(), "SIGINT" )
  }

  populateRepoDirContent() {
    for ( let key in this.TEST_DATA.remoteRepoFiles ) {
      let filePathRel = key
      let filePathAbs = path.join( this.repoPath, filePathRel )
      let fileContent = this.TEST_DATA.remoteRepoFiles[key]
      let dirname = path.dirname( filePathAbs )
      mkdirp.sync( dirname )
      fs.writeFileSync( filePathAbs, fileContent, "utf8" )
    }
  }

  initRepo() {
    cp.execFileSync( BINARY, ["init"], { cwd: this.repoPath } )
    cp.execFileSync( BINARY, ["add"], { cwd: this.repoPath } )
    cp.execFileSync( BINARY, ["ci", "--message", "'initial commit'", "--user", "reponote"], { cwd: this.repoPath } )
    let currentRev = cp.execFileSync( BINARY, ["parent", "--template", "{node}"], { cwd: this.repoPath } ).toString( "utf8" )
    // TODO XXX: please forgive me, will clean up soon
    this.TEST_DATA.repoTip = currentRev
  }

  removeDirs() {
    // TODO: unsafe! how to improve? Delete all files one by one and eventually rmdir?
    cp.execFileSync( "rm", ["-r", this.testServerDirPath] )
  }

  readPidSync() {
    return fs.readFileSync( this.pidFilePath ).toString( "utf8" ).trim()
  }

}

module.exports = TestServerHg