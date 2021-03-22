SassCompiler = require '../lib/sass-compiler'

describe "SassCompiler", ->
  [workspaceElement, activationPromise] = []

  beforeEach ->
    workspaceElement = atom.views.getView(atom.workspace)
    activationPromise = atom.packages.activatePackage('sass-compiler')
