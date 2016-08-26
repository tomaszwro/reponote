const { expect }             = require( "chai" )
const { defineHooks }        = require( "test/hooks" )
const { expectContent,       
        expectContentMerged, 
        expectRevision }     = require( "test/expectations" )
const serviceFactory         = require( "test/serviceFactory" )
const TEST_DATA              = require( "test/testData" )
const SaveNoteServiceMock    = require( "test/mocks/SaveNoteServiceMock" )
const SaveNoteService        = require( "app/services/SaveNoteService" )

describe( "SaveNoteService", () => {

  describe( "with real hg repo", () => {
    defineHooks( beforeEach, afterEach, { repoType: "hg" } )

    it( "saves file content", async () => {
      await testBasic( SaveNoteService, defaultParamsFor( "hg" ) )
    } )

    it( "merges conflicting text", async function() {
      this.timeout( 5000 )
      await testMergeWithConflicts( SaveNoteService, defaultParamsFor( "hg" ) )
    } )
    
    it.skip( "merges not conflicting text" )
  } )

  describe( "with real git repo", () => {
    defineHooks( beforeEach, afterEach, { repoType: "git" } )

    it( "saves file content", async () => { 
      await testBasic( SaveNoteService, defaultParamsFor( "git" ) )
    } )

    it( "merges conflicting text", async function() {
      this.timeout( 5000 )
      await testMergeWithConflicts( SaveNoteService, defaultParamsFor( "git" ) )
    } )

    it.skip( "merges not conflicting text" )
  } )

  describe( "with mocked service", () => {
    it( "service mock matches the specification", async () => {
      await testBasic( SaveNoteServiceMock, defaultParamsFor( "hg" ) )
    } )
  } )
} )


async function testBasic( serviceClass, command ) {
  let service = serviceFactory( serviceClass )
  let saveResult = await service.call( command )
  expectRevision( saveResult )
  expectContent( saveResult, TEST_DATA.newContentA )
}

async function testMergeWithConflicts( serviceClass, command ) {
  let commonBaseRevision = TEST_DATA.repoTip

  // TODO: to functions to avoid this a b naming
  let serviceA = serviceFactory( serviceClass ) 
  let commandA = Object.assign( {}, command, {
    baseRevision: commonBaseRevision,
    newContent:   TEST_DATA.newContentA,
  } )
  let resultA = await serviceA.call( commandA )
  expectContent( resultA, TEST_DATA.newContentA )

  let serviceB = serviceFactory( serviceClass )
  let commandB = Object.assign( {}, command, {
    baseRevision: commonBaseRevision,
    newContent:   TEST_DATA.newContentB,
  } )
  let resultB = await serviceB.call( commandB )

  expectContentMerged( resultB.fileContent, {
    expectedLocal: TEST_DATA.newContentB,
    expectedOther: TEST_DATA.newContentA,
  } )
}

function defaultParamsFor( repoType ) {
  // TODO: This should be a command!
  return {
    repoType:        repoType,
    repoUrlWithAuth: TEST_DATA.remoteServer[repoType].urlWithAuth,
    repoWorkingDir:  TEST_DATA.repoWorkingDir,
    baseRevision:    TEST_DATA.repoTip,
    filePath:        TEST_DATA.sampleFilePath,
    newContent:      TEST_DATA.newContentA,
  }
}