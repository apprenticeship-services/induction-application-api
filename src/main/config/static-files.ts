import express, { Express } from 'express'
import path from 'path'

export const setStaticFiles = (app: Express): void => {
  app.use(express.static(path.join(__dirname, '..', '..', '..', 'client/dist')))
}

export const setStaticFilesRoute = (app: Express): void => {
  app.get('/*', async (_, res) => {
    res.type('html')
    res.sendFile(path.join(__dirname, '..', '..', '..', 'client', 'dist/index.html'))
  })
}
