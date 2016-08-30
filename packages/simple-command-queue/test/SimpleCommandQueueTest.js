const { expect }              = require( "chai" )
const SimpleCommandQueue      = require( "../SimpleCommandQueue" )
const { SampleCommand,        
        SampleService,        
        COMMAND_SERVICE_MAP } = require( "./dummies" )
const SimpleCommandBus        = require( "simple-command-bus" )

// TODO: use sinon.js to spy & fake time not to have a timeout in tests?
// TODO: remove dependency on SimpleCommandBus, not needed (need to change tests)

describe( "SimpleCommandQueue", () => {

  // TODO: that was a hotfix, change
  let serviceProvider = {
    get: ( command ) => {
      return new COMMAND_SERVICE_MAP[command.constructor.name]( command )
    }
  }

  it( "processes single command", async () => {

    let processor = new SimpleCommandBus( serviceProvider )
    let commandQueue = new SimpleCommandQueue( processor )
    let sampleCommand = new SampleCommand( "Hello" )

    let result = await commandQueue.process( sampleCommand )
    expect( result ).to.be.equal( "SampleService resolved with: Hello" )

  } )

  it( "processes two commands", async () => {

    let processor = new SimpleCommandBus( serviceProvider )
    let commandQueue = new SimpleCommandQueue( processor )
    let sampleCommand = new SampleCommand( "Hello" )

    let [resultA, resultB] = await Promise.all( [
      commandQueue.process( new SampleCommand( "Hello" ) ),
      commandQueue.process( new SampleCommand( "Siema" ) ),
    ] )
    expect( resultA ).to.be.equal( "SampleService resolved with: Hello" )
    expect( resultB ).to.be.equal( "SampleService resolved with: Siema" )

  } )

  it( "processes three commands and preserves order", async () => {

    let processor = new SimpleCommandBus( serviceProvider )
    let commandQueue = new SimpleCommandQueue( processor )
    let sampleCommand = new SampleCommand( "Hello" )
    
    let results = []
    let trackMessage = ( message ) => { results.push( message ) }

    await Promise.all( [
      commandQueue.process( new SampleCommand( "Hello", 50, trackMessage ) ),
      commandQueue.process( new SampleCommand( "Siema", 0,  trackMessage ) ),
      commandQueue.process( new SampleCommand( "Witka", 0,  trackMessage ) ),
    ] )

    expect( results ).to.deep.equal( ["Hello", "Siema", "Witka"] )

  } )

  it( "processes two commands even if first fails", async () => {

    let processor = new SimpleCommandBus( serviceProvider )
    let commandQueue = new SimpleCommandQueue( processor )
    let sampleCommand = new SampleCommand( "Hello" )

    try {
      let resultA = await commandQueue.process( new SampleCommand( null ) )
    } catch ( error ) {
      expect( error.message ).to.be.equal( "no message given" )
    }

    let resultB = await commandQueue.process( new SampleCommand( "Siema" ) )
    expect( resultB ).to.be.equal( "SampleService resolved with: Siema" )

  } )

} )

