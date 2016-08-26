// TODO: this should be somewhere else, RepoHandlerProvider?
const REPO_HANDLERS_FOR_TYPE = {
  hg:  "RepoHandlerHg",
  git: "RepoHandlerGit",
}

class BaseService {
  
  constructor( injectables ) {
    this.injectables = injectables
  }

  createRepoHandler( command ) {
    let handlerClassName = REPO_HANDLERS_FOR_TYPE[command.repoType]
    let RepoHandler = this.injectables[handlerClassName]
    let { repoUrlWithAuth, repoWorkingDir } = command
    let repoHandler = new RepoHandler( { repoUrlWithAuth, repoWorkingDir }, this.injectables )

    return repoHandler
  }

}

module.exports = BaseService