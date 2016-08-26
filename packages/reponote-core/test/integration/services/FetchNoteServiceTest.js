const { expect }           = require( "chai" )
const { defineHooks }      = require( "test/hooks" )
const { expectContent,     
        expectRevision }   = require( "test/expectations" )
const serviceFactory       = require( "test/serviceFactory" )
const TEST_DATA            = require( "test/testData" )
const FetchNoteServiceMock = require( "test/mocks/FetchNoteServiceMock" )
const FetchNoteService     = require( "app/services/FetchNoteService" )

describe( "FetchNoteService", () => {

  describe( "with real hg repo", () => {
    defineHooks( beforeEach, afterEach, { repoType: "hg" } )

    it( "responds with file content", async () => { 
      await basicFetchNoteTest( FetchNoteService, defaultParamsFor( "hg" ) )
    } )
  } )

  describe( "with real git repo", () => {
    defineHooks( beforeEach, afterEach, { repoType: "git" } )

    it( "responds with file content", async () => { 
      await basicFetchNoteTest( FetchNoteService, defaultParamsFor( "git" ) )
    } )
  } )

  describe( "with mocked service", () => {
    it( "service mock matches the specification", async () => {
      await basicFetchNoteTest( FetchNoteServiceMock, defaultParamsFor( "hg" ) )
    } )
  } )
} )

async function basicFetchNoteTest( serviceClass, command ) {
  let service = serviceFactory( serviceClass )
  let result = await service.call( command )
  expectRevision( result )
  expectContent( result, TEST_DATA.sampleFileContent )
}

function defaultParamsFor( repoType ) {
  return {
    repoType:        repoType,
    repoUrlWithAuth: TEST_DATA.remoteServer[repoType].urlWithAuth,
    repoWorkingDir:  TEST_DATA.repoWorkingDir,
    filePath:        TEST_DATA.sampleFilePath,
  }
}

