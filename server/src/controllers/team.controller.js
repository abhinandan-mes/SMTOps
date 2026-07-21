const prisma = require('../config/prisma');

exports.createTeam = async (req, res, next) => {
  try {
    const { name, code, description, leaderId } = req.body;
    const team = await prisma.team.create({
      data: { name, code, description, leaderId }
    });
    res.status(201).json(team);
  } catch (error) {
    next(error);
  }
};

exports.getTeams = async (req, res, next) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        leader: { select: { id: true, name: true } },
        _count: { select: { members: true } }
      }
    });
    res.json(teams);
  } catch (error) {
    next(error);
  }
};

exports.updateTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, code, description, status, leaderId } = req.body;
    const team = await prisma.team.update({
      where: { id },
      data: { name, code, description, status, leaderId }
    });
    res.json(team);
  } catch (error) {
    next(error);
  }
};

exports.deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.team.update({
      where: { id },
      data: { status: 'INACTIVE' } // Soft delete
    });
    res.json({ message: 'Team deactivated successfully' });
  } catch (error) {
    next(error);
  }
};
