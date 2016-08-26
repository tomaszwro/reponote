const { expect }  = require( "chai" )

function expectContent( result, content ) {
  expect( result.fileContent ).to.equal( content )
}

function expectRevision( result ) {
  expect( result.revision ).to.be.a( "string" )
  expect( result.revision ).to.not.be.empty
}

const CONFLICT_REGEX = /^----- conflicting changes ------\n([\s\S]*)----- versus -----\n([\s\S]*)----- end of conflicting changes -----\n$/

function expectContentMerged( content, { expectedLocal, expectedOther } ) {
  let matchData = content.match( CONFLICT_REGEX )
  expect( matchData ).to.exist
  let [match, other, local] = matchData
  expect( other ).to.equal( expectedLocal )
  expect( local ).to.equal( expectedOther )
}

module.exports = {
  expectRevision,
  expectContent,
  expectContentMerged,
}