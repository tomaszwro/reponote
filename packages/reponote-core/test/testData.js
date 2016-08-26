const path = require( "path" )

const TEST_TEMP_DIR = "temp-test"
const TEST_SERVER_PORT = "8001"

// TODO: dry up!

module.exports = {
  testTempDir: TEST_TEMP_DIR,
  repoWorkingDir: path.join( TEST_TEMP_DIR, "test-repo-working-dir" ),

  repoName: "test_repo",

  remoteServer: {
    git: {
      // TODO: dry up port
      port: TEST_SERVER_PORT,
      authData: {
        user: "nope",
        pwd: "nope",
        url: "git://localhost:8001/",
      },
      urlWithAuth: "git://localhost:8001/",
    },
    hg: {
      port: TEST_SERVER_PORT,
      authData: {
        user: "nope",
        pwd: "nope",
        url: "http://localhost:8001/",
      },
      urlWithAuth: "http://nope:nope@localhost:8001/",
    },
    hgMalformedUrl: {
      port: TEST_SERVER_PORT,
      authData: {
        user: "nope",
        pwd: "nope",
        url: "httplocalhost:8001/",
      },
      urlWithAuth: "httplocalhost:8001/",
    }
  },

  // NOTE: using numerical changeset identifier instead of a hash, "0" is the
  // first changeset.
  repoTip: "0",
  sampleFilePath:     path.join( "dir_1", "file_1" ),
  sampleFilePathB:    path.join( "file_2" ),
  sampleFileContent:  "File 1 in dir 1 content\n",
  sampleFileContentB: "File 2 content\n",
  // TODO: DRY UP with above
  remoteRepoFiles: {
    "dir_1/file_1": "File 1 in dir 1 content\n",
    "file_2":       "File 2 content\n",
  },
  newContentA: "new content aaa\n",
  newContentB: "new content bbb\n",
}