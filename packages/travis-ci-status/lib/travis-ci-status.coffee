fs = require 'fs'
path = require 'path'
{shell} = require 'electron'
{Disposable} = require 'atom'

TravisCi = null

BuildMatrixView = null
BuildStatusView = null

module.exports =
  # Internal: The default configuration properties for the package.
  config:
    travisCiRemoteName:
      type: 'string'
      default: 'origin'
      title: 'Travis CI Remote Name'
      description: 'Enter the name of the remote used for Travis integration'
      order: 1
    travisCiAltRemotes:
      type: 'string'
      default: ''
      title: 'Remote Overrides'
      description: 'Enter repository-specific remotes as a JSON string to override the default in the format:<br/>`{"repository":"remote"}`'
      order: 2
    useTravisCiPro:
      type: 'boolean'
      default: false
      title: 'Use Travis CI Pro'
      order: 3
    personalAccessToken:
      type: 'string'
      default: ''
      title: 'Personal Access Token'
      description: 'Your personal [GitHub access token](https://github.com/settings/tokens) (*required for Travis CI Pro*)'
      order: 4

  # Internal: The build matrix bottom panel view.
  buildMatrixView: null

  # Internal: The build status status bar entry view.
  buildStatusView: null

  # Internal: Active the package.
  #
  # Returns nothing.
  activate: ->
    @updateSettings

    @projectChangeSubscription = atom.project.onDidChangePaths =>
      @checkTravisRepos().then => @init(@statusBar)

    @checkTravisRepos()

  checkTravisRepos: ->
    @activationPromise = Promise.all(
      atom.project.getDirectories().map(
        atom.project.repositoryForDirectory.bind(atom.project)
      )
    ).then (repos) =>
      repos = repos.filter (repo) -> repo

      new Promise(
        (resolve) =>
          if @hasGitHubRepo(repos)
            @isTravisProject((config) -> config and resolve())
      )

  # Internal: Deactive the package and destroys any views.
  #
  # Returns nothing.
  deactivate: ->
    atom.travis = null
    @statusBarSubscription?.dispose()
    @buildMatrixView?.destroy()
    @projectChangeSubscription?.dispose()

  # Internal: Serialize each view state so it can be restored when activated.
  #
  # Returns an object containing key/value pairs of view state data.
  serialize: ->

  # Internal: Get whether the project repository has a GitHub remote.
  #
  # Returns true if the repository has a GitHub remote, else false
  hasGitHubRepo: (repos) ->
    return false if repos.length is 0

    for repo in repos
      name = @getFinalRemote(repo)
      return true if /(.)*github\.com/i.test(repo.getConfigValue("remote.#{name}.url"))

    false

  # Internal: Get the repoistory's name with owner.
  #
  # Returns a string of the name with owner, or null if the origin URL doesn't
  # exist.
  getNameWithOwner: ->
    repo = atom.project.getRepositories()[0]
    name = @getFinalRemote(repo)
    url  = repo.getConfigValue("remote.#{name}.url")

    return null unless url?

    /([^\/:]+)\/([^\/]+)$/.exec(url.replace(/\.git$/, ''))[0]

  getFinalRemote: (repo) ->
    if not repo?
      repo = atom.project.getRepositories()[0]

    url = repo.getOriginURL()
    gitPath = /([^\/:]+)\/([^\/]+)$/.exec(url.replace(/\.git$/, ''))[0]

    name = atom.config.get('travis-ci-status.travisCiRemoteName')
    override = atom.config.get('travis-ci-status.travisCiAltRemotes')
    override = JSON.parse(override)

    if override.hasOwnProperty(gitPath)
      name = override[gitPath]

    name

  # Internal: Check there is a .travis.yml configuration file.
  # Bool result is passed in callback.
  #
  # Returns nothing.
  isTravisProject: (callback) ->
    return unless callback instanceof Function

    projPath = atom.project.getPaths()[0]
    return callback(false) unless projPath?

    conf = path.join(projPath, '.travis.yml')
    fs.exists(conf, callback)

  # Internal: initializes any views.
  #
  # Returns nothing
  init: (statusBar) ->
    TravisCi ?= require 'travis-ci'

    atom.travis = new TravisCi(
      version: '2.0.0',
      pro: atom.config.get('travis-ci-status.useTravisCiPro')
    )

    atom.commands.add 'atom-workspace', 'travis-ci-status:open-on-travis', =>
      @openOnTravis()

    BuildStatusView ?= require './build-status-view'
    BuildMatrixView ?= require './build-matrix-view'

    nwo = @getNameWithOwner()
    gfr = @getFinalRemote()
    @buildMatrixView = new BuildMatrixView(nwo)
    @buildStatusView = new BuildStatusView(nwo, @buildMatrixView, statusBar, gfr)

  # Internal: Open the project on Travis CI in the default browser.
  #
  # Returns nothing.
  openOnTravis: ->
    nwo = @getNameWithOwner()

    domain = if atom.travis.pro
      'magnum.travis-ci.com'
    else
      'travis-ci.org'

    shell.openExternal("https://#{domain}/#{nwo}")

  consumeStatusBar: (statusBar) ->
    @statusBar = statusBar
    @activationPromise.then( => @init(statusBar))
    @statusBarSubscription = new Disposable =>
      @buildStatusView?.destroy()
