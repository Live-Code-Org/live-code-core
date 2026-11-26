const Team = require('../models/Team');
const User = require('../models/User');
const mongoose = require('mongoose');

const validateTeamMembers = async (proposedMembers, allowDuplicateRoles = false, existingTeamId = null) => {
  if (proposedMembers.length > 5) {
    return { status: 400, message: 'A team cannot exceed 5 members' };
  }

  for (const m of proposedMembers) {
    if (!m.user || !mongoose.Types.ObjectId.isValid(m.user)) {
      return { status: 400, message: 'Invalid or missing user ID' };
    }
  }

  const userIds = proposedMembers.map((m) => m.user.toString());
  if (new Set(userIds).size !== userIds.length) {
    return { status: 400, message: 'Duplicate users are not allowed in the same team' };
  }
  // Verifies that the users is registered in the database
  const usersInDb = await User.find({ _id: { $in: userIds } });
  if (usersInDb.length !== userIds.length) {
    return { status: 404, message: 'One or more users were not found' };
  }

  // Verifies that the user(s) is not registered in another team
  const busyUser = usersInDb.find(
    (u) => u.currentTeam !== null && u.currentTeam.toString() !== existingTeamId?.toString()
  );
  if (busyUser) {
    return {
      status: 400,
      message: `User ${busyUser.githubHandle || busyUser.fullName} is already in an active team`,
    };
  }

  const normalizedRoles = proposedMembers.map((m) => (m.roleInTeam || '').trim().toLowerCase());
  const duplicateRoles = normalizedRoles.filter((role, index) => normalizedRoles.indexOf(role) !== index);

  if (duplicateRoles.length > 0 && !allowDuplicateRoles) {
    return {
      status: 409,
      code: 'DUPLICATE_ROLE_NOT_ALLOWED',
      message: `Duplicate role(s) detected: ${[...new Set(duplicateRoles)].join(', ')}. This team does not allow duplicate roles.`,
      duplicateRoles: [...new Set(duplicateRoles)],
    };
  }

  return null;
};

// @desc    Create a new team (with optional initial members & role policy)
// @route   POST /api/teams
const createTeam = async (req, res) => {
  try {
    const {
      name,
      description,
      techStack,
      github,
      creatorId,
      creatorRole,
      initialMembers = [],
      allowDuplicateRoles = false,
    } = req.body;

    const formatedInitialMembers = initialMembers.map((member) =>({
        user: member.user,
        roleInTeam: member.roleInTeam,
        isAdmin: false,
    }));

    const allMembers = [
        {
            user: creatorId,
            roleInTeam: creatorRole || 'Team Lead',
            isAdmin: true,
        },
        ...formatedInitialMembers, 
    ];

    const validationError = await validateTeamMembers(allMembers, allowDuplicateRoles);
    if (validationError) {
        return res.status(validationError.status).json(validationError);
    }

    const newTeam = await Team.create({
        name,
        description,
        techStack,
        github,
        allowDuplicateRoles,
        members: allMembers,
    });

    const allUserIds = allMembers.map((m)=> m.user);

    await User.updateMany(
        {_id: {$in: allUserIds}}, {$set:{ status: 'in_team', currentTeam: newTeam._id}}
    );
    return res.status(201).json(newTeam)
  } catch (error) {
    console.error('Error creating team:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Team name already exists' });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Get all teams (Discovery Lobby)
// @route   GET /api/teams
const getAllTeams = async (req, res) => {
  try {
    const { status, tech } = req.query;
    const filter = {};
    
    filter.status = status || "recruiting" ; 
    if (tech) {
      filter.techStack = tech.trim().toLowerCase()
    }
    const teams = await Team.find(filter)
      .populate(
        'members.user',
        'fullName githubHandle avatarUrl primaryRole reputationScore certification.isCertified',
      )
      .select('-__v')
      .sort({createdAt: -1})
      .lean();
    res.status(200).json(teams)
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Join an existing team
// @route   POST /api/teams/:teamId/join
const joinTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId, roleInTeam } = req.body;

    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: 'Invalid team ID' });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({message: 'User not found'});
    };

    const team = await Team.findById(teamId);
    if (!team) {
        return res.status(404).json({ message: 'Team not found' });
    };

    if (team.status !== 'recruiting') {
        return res.status(400).json({ message: 'The team is not recruiting' });
    };
    if (!roleInTeam || typeof roleInTeam !== 'string' || !roleInTeam.trim()) {
      return res.status(400).json({ message: 'roleInTeam is required' });
    }
    const proposedMembers = [...team.members, {user: userId, roleInTeam, isAdmin: false}];

    const validationError = await validateTeamMembers(
      proposedMembers, 
      team.allowDuplicateRoles,
      team._id
    );

    if (validationError) {
      return res.status(validationError.status).json(validationError);
    }
    team.members.push({user: userId, roleInTeam, isAdmin: false});
    await team.save();

    await User.findByIdAndUpdate(userId, {status: 'in_team', currentTeam: team._id});
    res.status(200).json(team);
  } catch (error) {
    console.error('Error joining team:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// @desc    Update team settings (Admins only)
// @route   PATCH /api/teams/:teamId/settings
const updateTeamSettings = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId, allowDuplicateRoles, description, status } = req.body;

    const team = await Team.findById(teamId);
    if (!team) {
       return res.status(404).json({message: 'team not found'});
    }
    
    const isAdmin = team.members.some(
      (m) => m.user.toString() === userId && m.isAdmin === true
    )
    if (!isAdmin) {
      return res.status(403).json({ message: 'Only team admins can update settings' });
    }

    if (allowDuplicateRoles !== undefined) {
      team.allowDuplicateRoles = allowDuplicateRoles;
    }
    if (description !== undefined) {
      team.description = description;
    }
    if (status !== undefined) {
      team.status = status;
    }

    await team.save()
    res.status(200).json(team);
  } catch (error) {
    console.error('Error updating team settings:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  createTeam,
  getAllTeams,
  joinTeam,
  updateTeamSettings,
};


