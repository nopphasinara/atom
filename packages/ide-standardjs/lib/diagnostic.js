'use babel'

export default class Diagnostic {
  constructor (filePath, message) {
    this.excerpt = message.message
    this.severity = message.severity === 2 ? 'error' : 'warning'
    this.location = {
      file: filePath,
      position: this.getPosition(message.line, message.column)
    }
    // this.description = ''
  }

  getPosition (line, column) {
    line = line - 1
    column = column - 1
    return [[line, column], [line, column + 1]]
  }
}
