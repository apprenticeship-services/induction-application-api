module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      skipMD5: true
    },
    instance: {
      dbName: 'jest'
    },
    replSet: {
      count: 3,
      storageEngine: 'wiredTiger'
    },
    autoStart: false
  }
}
