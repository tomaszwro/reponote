const { expect } = require( "chai" )
const TEST_DATA  = require( "test/testData" )

class FetchNoteListServiceMock {

  constructor( injectables ) {
    this.injectables = injectables
  }

  call( command ) {
    // TODO: expectations inside mocks don't feel right
    expect( command.repoUrlWithAuth ).to.not.be.empty
    expect( command.repoWorkingDir ).to.be.a( "string" )
    expect( command.repoWorkingDir ).to.not.be.empty
    expect( this.injectables.HgCommandAdapter ).to.respondTo( "run" )

    return Promise.resolve( {
      revision: TEST_DATA.repoTip,
      // TODO: mv array to testData
      files: [TEST_DATA.sampleFilePath]
    } )
  }

}

module.exports = FetchNoteListServiceMock