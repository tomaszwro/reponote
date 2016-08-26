const BaseCommand = require( "app/commands/BaseCommand" )
const validations = require( "app/validations" )

class SaveNoteCommand extends BaseCommand {
  
  static get attributes() { return {
    repoAuthData: validations.repoAuthData,
    filePath:     validations.filePath,
    baseRevision: validations.baseRevision,
    newContent:   validations.newContent,
  } }

}

module.exports = SaveNoteCommand