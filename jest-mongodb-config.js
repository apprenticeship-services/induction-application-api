module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      skipMD5: true
    },
    instance: {},
    replSet: {
      count: 4,
      storageEngine: 'wiredTiger'
    },
    autoStart: false
  },
  mongoURLEnvName: 'MONGO_URL'
}
