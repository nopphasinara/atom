global.Faker = () ->
  proto = {
    getFoo: () ->
      return this.foo || ''
    ,
  }

  return Object.assign(this, {
    proto: proto,
  })

global.loadDeps = () ->
  if !global.hasOwnProperty('jquery')
    global.jquery = require('jquery')

  if !global.hasOwnProperty('_')
    global._ = require('lodash')

  if !global.hasOwnProperty('stdpath')
    global.stdpath = require('path')

  if !global.hasOwnProperty('fse')
    global.fse = require('fs-extra')

  require('./helpers.js')

loadDeps()
