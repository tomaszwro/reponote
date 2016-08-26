const { expect }               = require( "chai" )
const { defineHooks }          = require( "test/hooks" )
const { expectRevision }       = require( "test/expectations" )
const serviceFactory           = require( "test/serviceFactory" )
const TEST_DATA                = require( "test/testData" )
const FetchNoteListServiceMock = require( "test/mocks/FetchNoteListServiceMock" )
const FetchNoteListService     = require( "app/services/FetchNoteListService" )

// TODO: services should be tested with commands, not plain params!

describe( "FetchNoteListService", () => {

  describe( "with real hg repo", () => {
    defineHooks( beforeEach, afterEach, { repoType: "hg" } )

    it( "responds with file list", async () => { 
      await basicFetchNoteListTest( FetchNoteListService, getNoteListParams( "hg" ) )
    } )
  } )

  describe( "with real git repo", () => {
    defineHooks( beforeEach, afterEach, { repoType: "git" } )

    it( "responds with file list", async () => { 
      await basicFetchNoteListTest( FetchNoteListService, getNoteListParams( "git" ) )
    } )
  } )

  describe( "with mocked service", () => {
    it( "service mock matches the specification", async () => {
      await basicFetchNoteListTest( FetchNoteListServiceMock, getNoteListParams( "hg" ) )
    } )
  } )

} )

async function basicFetchNoteListTest( serviceClass, command ) {
  let service = serviceFactory( serviceClass )
  let result = await service.call( command )
  expectRevision( result )
  expect( result.files ).to.include( TEST_DATA.sampleFilePath )
}

function getNoteListParams( repoType ) {
  return {
    repoType:        repoType,
    repoUrlWithAuth: TEST_DATA.remoteServer[repoType].urlWithAuth,
    repoWorkingDir:  TEST_DATA.repoWorkingDir,
  }
}