// TODO: start using commands instead of plain params in service tests and
// then use ServiceProvider here

const INJECTABLES = {
  HgCommandAdapter:  require( "cmd-adapter-hg-cli" ),
  GitCommandAdapter: require( "cmd-adapter-git-cli" ),
  RepoHandlerGit:    require( "app/handlers/RepoHandlerGit" ),
  RepoHandlerHg:     require( "app/handlers/RepoHandlerHg" ),
}

function serviceFactory( ServiceClass ) {
  return new ServiceClass( INJECTABLES )
}

module.exports = serviceFactory