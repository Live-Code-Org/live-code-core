const express = require('express');
const router = express.Router();
const {
  createTeam,
  getAllTeams,
  joinTeam,
  updateTeamSettings,
} = require('../controllers/teamController');

router.get('/', getAllTeams);

router.post('/', createTeam);


router.post('/:teamId/join', joinTeam);

router.patch('/:teamId/settings', updateTeamSettings)

module.exports = router;