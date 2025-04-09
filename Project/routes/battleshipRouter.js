const express = require('express');
const router = express.Router();
const game = require('../game/battleshipEngine');

router.get('/new', (req, res) => {
  const grid = req.query.grid ? JSON.parse(req.query.grid) : [10, 10];
  const fleet = req.query.fleet ? JSON.parse(req.query.fleet) : [[1, 1], [2, 2], [1, 1], [1, 1]];
  res.json(game.startGame(grid, fleet));
});

router.get('/lob', (req, res) => {
  const grid = req.query.grid ? JSON.parse(req.query.grid) : null;
  if (!grid) return res.json({ status: 'reject', time: Date.now() });
  res.json(game.lob(grid));
});

router.get('/hit', (req, res) => {
  res.json(game.reportHit());
});

router.get('/miss', (req, res) => {
  res.json(game.reportMiss());
});

router.get('/cancel', (req, res) => {
  res.json(game.cancel());
});

router.get('/concede', (req, res) => {
  res.json(game.concede());
});

router.get('/status', (req, res) => {
  res.json(game.status());
});

router.get('/reset', (req, res) => {
  if (game.active) game.cancel();
  res.json({ status: 'reset' });
});


module.exports = router;
