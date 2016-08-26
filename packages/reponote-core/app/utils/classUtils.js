// TODO: move to a separate package

function cachedProperty( that, privatePropName, calculateFn ) {
  if ( that[privatePropName] == null ) {
    that[privatePropName] = calculateFn()
  }
  return that[privatePropName]
}

function assignWhitelisted( receiver, params ) {
  let whitelist = Object.keys( receiver.constructor.attributes )
  // Poor man's Object#pick
  for ( let paramName of whitelist ) {
    receiver[paramName] = params[paramName]
  }
}

module.exports = {
  cachedProperty,
  assignWhitelisted,
}