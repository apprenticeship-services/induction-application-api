import { Router } from 'express'

export default (router: Router) => {
  router.get('/hello', (req, res) => {
    res.status(200).send({
      name: 'test'
    })
  })
}
