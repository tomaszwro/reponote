const validateJs = require( "validate.js" )

module.exports = {
  // TODO: a lil crappy, will throw
  repoAuthData: value => value.validate(),
  newContent:   value => validateJs.isString( value ) || { presence: { message: "is required" } },
  // TODO: too agressive
  filePath:     { presence: true, format: { pattern: /^([\w ]+\/)*[\w ]+$/, message: "invalid" } },
  baseRevision: { presence: true, format: { pattern: /^[0-9a-f]+$/,         message: "invalid" } }, 
}
