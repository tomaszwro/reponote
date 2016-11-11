const { expect } = require( "chai" )
const request    = require( "supertest" )
const TEST_DATA  = require( "reponote-core/test/testData" )
const setup      = require( "test/setup" )

describe( "RepoController", () => {

  const context = setup( before, after )

  function prepareApiRequest( method, path ) {
    return request( context.appContainer.expressApp )[method]( path )
      // TODO: merge repoType to authData?
      .query( Object.assign( {}, TEST_DATA.remoteServer.hg.authData, { repoType: "hg" } ) )
      .set( "Accept", "application/json" )
      .set( "Content-Type", "application/json" ) // TODO: post only
      .expect( 200 )
      .expect( "Content-Type", /json/ )
  }

  // TODO: extract commons

  describe( "GET /files with service mocks", () => {
    it( "responds with file list", done => {
      prepareApiRequest( "get", "/files" )
        .expect( res => {
          expect( res.body.revision ).to.equal( TEST_DATA.repoTip )
          expect( res.body.files ).to.deep.equal( [TEST_DATA.sampleFilePath] )
        } )
        .end( done )
    } )

    it( "responds with an url validation error", done => {
      request( context.appContainer.expressApp ).get( "/files" )
        .query( Object.assign( {}, TEST_DATA.remoteServer.hg.authData, { url: null } ) )
        .set( "Accept", "application/json" )
        .expect( 422 )
        .expect( "Content-Type", /json/ )
        .expect( res => {
          // TODO: unhardcode
          expect( res.body.errors.url ).to.deep.equal( ["Url can't be blank"] )
        } )
        .end( done )
    } )
  } )

  describe( "GET /files/path with service mocks", () => {
    it( "responds with file content", done => {
      prepareApiRequest( "get", `/files/${ TEST_DATA.sampleFilePath }` )
        .expect( res => {
          expect( res.body.revision ).to.equal( TEST_DATA.repoTip )
          expect( res.body.fileContent ).to.equal( TEST_DATA.sampleFileContent )
        } )
        .end( done )
    } )

    it( "responds with a file path validation error", done => {
      request( context.appContainer.expressApp ).get( `/files/a/wrong//path` )
        .query( TEST_DATA.remoteServer.hg.authData )
        .set( "Accept", "application/json" )
        .expect( 422 )
        .expect( "Content-Type", /json/ )
        .expect( res => {
          // TODO: unhardcode
          expect( res.body.errors.filePath ).to.deep.equal( ["File path invalid"] )
        } )
        .end( done )
    } )
  } )

  describe( "POST /files/path with service mocks", () => {
    it( "responds with new file content", done => {
      prepareApiRequest( "post", `/files/${ TEST_DATA.sampleFilePath }` )
        // TODO: stringify probably not needed
        .send( JSON.stringify( { baseRevision: TEST_DATA.repoTip, newContent: TEST_DATA.newContentA } ) )
        .expect( res => {
          expect( res.body.revision ).to.equal( "some_revision_from_mock" ) // TODO: get from testData
          expect( res.body.fileContent ).to.equal( TEST_DATA.newContentA )
        } )
        .end( done )
    } )

    it( "responds with a revision validation error", done => {
      request( context.appContainer.expressApp ).post( `/files/${ TEST_DATA.sampleFilePath }` )
        .query( TEST_DATA.remoteServer.hg.authData )
        .send( JSON.stringify( { baseRevision: "InvalidRevision", newContent: TEST_DATA.newContentA } ) )
        .set( "Content-Type", "application/json" )
        .set( "Accept", "application/json" )
        .expect( 422 )
        .expect( "Content-Type", /json/ )
        .expect( res => {
          // TODO: unhardcode
          expect( res.body.errors.baseRevision ).to.deep.equal( ["Base revision invalid"] )
        } )
        .end( done )
    } )

    it.skip( "two concurrent saves do not interrupt each other" )

  } )
  
} )

