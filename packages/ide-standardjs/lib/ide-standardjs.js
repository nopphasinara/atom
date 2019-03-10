'use babel'

import { CompositeDisposable } from 'atom'

import LinterStandard from './linter-standard'

export default {
  subscriptions: null,

  activate (state) {
    this.subscriptions = new CompositeDisposable()
    this.linter = new LinterStandard()
  },

  deactivate () {
    this.subscriptions.dispose()
  },

  provideLinter () {
    return this.linter
  }
}
