const { expect } = require( "chai" )
const TEST_DATA  = require( "test/testData" )

class SaveNoteServiceMock {

  constructor( injectables ) {
    this.injectables = injectables
  }

  call( command ) {
    // TODO: expectations inside mocks don't feel right
    expect( command.repoUrlWithAuth ).to.not.be.empty
    expect( command.repoWorkingDir ).to.be.a( "string" )
    expect( command.repoWorkingDir ).to.not.be.empty
    expect( command.filePath ).to.equal( TEST_DATA.sampleFilePath )
    expect( command.baseRevision ).to.equal( TEST_DATA.repoTip )
    expect( command.newContent ).to.equal( TEST_DATA.newContentA )
    expect( this.injectables.HgCommandAdapter ).to.respondTo( "run" )

    return Promise.resolve( {
      revision: "some_revision_from_mock",
      fileContent: TEST_DATA.newContentA
    } )
  }

}

module.exports = SaveNoteServiceMock