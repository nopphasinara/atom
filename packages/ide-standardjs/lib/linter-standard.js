'use babel'

import standard from 'standard'
import Diagnostic from './diagnostic'

export default class LinterStandard {
  constructor () {
    this.name = 'StandardJS'
    this.scope = 'file'
    this.grammarScopes = ['source.js']
    this.lintsOnChange = true
  }

  lint (textEditor) {
    return new Promise((resolve, reject) => {
      this.standardLintText(textEditor, resolve, reject)
    })
  }

  standardLintText (textEditor, resolve, reject) {
    const filePath = textEditor.getPath()
    const fileContent = textEditor.getText()
    const projectPath = atom.project.relativizePath(filePath)[0]
    const opts = { cwd: projectPath, filename: filePath }

    standard.lintText(fileContent, opts, (error, {results, errorCount, warningCount}) => {
      if (error) return reject(error)
      if (errorCount === 0 && warningCount === 0) return resolve([])

      let diagnostics = this.convertResultsToDiagnostics(filePath, results)
      resolve(diagnostics)
    })
  }

  convertResultsToDiagnostics (filePath, results) {
    let diagnostics = []
    results.forEach(function ({filePath, messages}) {
      messages.forEach(function (message) {
        diagnostics.push(new Diagnostic(filePath, message))
      })
    })
    return diagnostics
  }
}
