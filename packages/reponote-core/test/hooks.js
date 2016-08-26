const cp = require( "child_process" )
const mkdirp = require( "mkdirp" )
const TEST_DATA = require( "test/testData" )

const SERVER_FOR_TYPE = {
  hg:  require( "test-server-hg" ),
  git: require( "test-server-git" ),
}

function defineHooks( beforeEach, afterEach, { repoType } ) {

  let TestServer = SERVER_FOR_TYPE[repoType]
  let context = {}

  beforeEach( () => {
    mkdirp.sync( TEST_DATA.testTempDir )

    // TODO: Currently the server is recreated in each test b/c contents may
    // change. Consequently the suite runs significantly longer. There's
    // definitely some room for optimization.
    context.remoteTestServer = new TestServer( TEST_DATA )
    context.remoteTestServer.createSync()
  } )

  afterEach( () => {
    context.remoteTestServer.cleanupSync()
    // TODO: unsafe & crude, do sth
    cp.execFileSync( "rm", ["-r", TEST_DATA.testTempDir] )
  } )

  return context
}

module.exports = {
  defineHooks
}