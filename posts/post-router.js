const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', (req, res) => {
  // SELECT * FROM Posts;
  db('posts')
    .then(posts => {
      res.json(posts)
    })
    .catch(err => {
      res.status(500).json({ message: 'Failed to get posts' })
    })
});

router.get('/:id', (req, res) => {
  const {id} = req.params

  db('posts').where({ id })
    .then(posts => {
      const post = posts[0]

      if (post) {
        res.json(post)
      }else {
        res.status(404).json({ message: 'invalid post id' })
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: 'Failed to get post' })
    })
});

router.post('/', (req, res) => {
  const postData = req.body
  // need logic for invalid data
  db('posts').insert(postData)
    .then(ids => {
      res.status(201).json(ids)
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ errorMessage: 'Error inserting post' })
    })
});

router.put('/:id', (req, res) => {
  const { id } = req.params
  const changes = req.body

  // UPDATE Posts SET changes.key = changes.value WHERE id = id
  db('posts').where({ id }).update(changes)
    .then(count => {
      if (count) {
        res.json({updated: count})
      }else {
        res.status(404).json({ message: 'invalid post id' })
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: `${err}` })
    })
});

router.delete('/:id', (req, res) => {
  const { id } = req.params

  //DELETE FROM Posts WHERE id = id
  db('posts').where({ id }).del()
    .then(count => {
      if (count) {
        res.json({ deleted: count })
      } else {
        res.status(404).json({ message: 'invalid post id' })
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: `${err}` })
    })
});

module.exports = router;