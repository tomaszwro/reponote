const BaseCommand = require( "app/commands/BaseCommand" )
const validations = require( "app/validations" )

// See README on why is this a command, not a query

class FetchNoteCommand extends BaseCommand {

  static get attributes() { return {
    repoAuthData: validations.repoAuthData,
    repoType:     validations.repoType,
    filePath:     validations.filePath, 
  } }

}

module.exports = FetchNoteCommand