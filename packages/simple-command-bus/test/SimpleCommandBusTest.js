const { expect }              = require( "chai" )
const SimpleCommandBus        = require( "../SimpleCommandBus" )
const { SampleCommand,
        SampleService,
        COMMAND_SERVICE_MAP } = require( "./dummies" )

describe( "SimpleCommandBus", () => {

  it( "processes single command", async () => {

    // TODO: that was a hotfix, change
    let serviceProvider = {
      get: ( command ) => {
        return new COMMAND_SERVICE_MAP[command.constructor.name]( command )
      }
    }

    let commandBus = new SimpleCommandBus( serviceProvider )
    let sampleCommand = new SampleCommand( "Hello" )

    let result = commandBus.process( sampleCommand )
    expect( result ).to.be.equal( "Result from SampleService: Hello" )

  } )

} )

