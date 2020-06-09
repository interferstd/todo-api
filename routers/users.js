const express = require('express')

const User = require('../database/User')
const auth = require('../auth')

const router = express.Router()

router.post('/create', async (req, res) => {
  // Create a new user
  try {
    const user = new User(req.body)
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post('/login', async (req, res) => {
  // Login a registered user
  try {
    if (req.body.login === 'admin' && req.body.password === 'admin') {
      res.status(418).send({ shark: true })
      return
    }
    const user = await User.findByCredentials(req.body.login, req.body.password)
    if (!user) {
      return res
        .status(401)
        .send({ error: 'Login failed! Check authentication credentials' })
    }
    const token = await user.generateAuthToken()
    res.status(200).send({ user, token })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.get('/me', auth, async (req, res) => {
  // View logged in user profile
  res.send(await req.user)
})

router.delete('/me', auth, async (req, res) => {
  // Delete user profile
  try {
    await User.deleteOne({ _id: req.user._id })
    res.status(200).send()
  } catch (error) {
    res.status(422).send(error)
  }
})

router.post('/me/logout', auth, async (req, res) => {
  // Log user out of the application
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
    })
    await req.user.save()
    res.status(200).send()
  } catch (error) {
    res.status(500).send(error)
  }
})

router.post('/me/logoutall', auth, async (req, res) => {
  // Log user out of all devices
  try {
    req.user.tokens.splice(0, req.user.tokens.length)
    await req.user.save()
    res.status(200).send()
  } catch (error) {
    res.status(500).send(error)
  }
})

module.exports = router
