const { expect } = require( "chai" )
const TEST_DATA  = require( "test/testData" )

class FetchNoteServiceMock {

  constructor( injectables ) {
    this.injectables = injectables
  }

  call( command ) {
    // TODO: expectations inside mocks don't feel right
    expect( command.repoUrlWithAuth ).to.not.be.empty
    expect( command.repoWorkingDir ).to.be.a( "string" )
    expect( command.repoWorkingDir ).to.not.be.empty
    expect( command.filePath ).to.equal( TEST_DATA.sampleFilePath )
    expect( this.injectables.HgCommandAdapter ).to.respondTo( "run" )

    return Promise.resolve( {
      revision:    TEST_DATA.repoTip,
      fileContent: TEST_DATA.sampleFileContent
    } )
  }

}

module.exports = FetchNoteServiceMock