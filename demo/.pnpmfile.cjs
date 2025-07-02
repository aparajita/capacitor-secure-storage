function readPackage(package_, context) {
  if (package_.name === 'jsdom' && package_.version.startsWith('23.2')) {
    // Replace tough-cookie v4 with v5
    package_.dependencies = {
      ...package_.dependencies,
      'tough-cookie': '^5.0.0-rc.3',
    }
    context.log('tough-cookie@4 => tough-cookie@5 in dependencies of jsdom')
  }

  return package_
}

module.exports = {
  hooks: {
    readPackage,
  },
}
