const prisma = require('../config/prisma');

exports.submitHandover = async (req, res, next) => {
  try {
    const { shift, teamId, summary, pendingWork, openIssues, machineRemarks, generalRemarks } = req.body;
    const engineerId = req.userId;

    const handover = await prisma.shiftHandover.create({
      data: {
        shift,
        teamId,
        engineerId,
        summary,
        pendingWork,
        openIssues,
        machineRemarks,
        generalRemarks
      }
    });
    res.status(201).json(handover);
  } catch (error) {
    next(error);
  }
};

exports.getHandovers = async (req, res, next) => {
  try {
    const { teamId, shift } = req.query;
    const filter = {};
    if (teamId) filter.teamId = teamId;
    if (shift) filter.shift = shift;

    const handovers = await prisma.shiftHandover.findMany({
      where: filter,
      include: {
        engineer: { select: { name: true, employeeId: true } },
        acknowledger: { select: { name: true } },
        team: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(handovers);
  } catch (error) {
    next(error);
  }
};

exports.acknowledgeHandover = async (req, res, next) => {
  try {
    const { id } = req.params;
    const acknowledgedBy = req.userId;

    const handover = await prisma.shiftHandover.update({
      where: { id },
      data: {
        acknowledgedBy,
        acknowledgedAt: new Date()
      }
    });
    res.json(handover);
  } catch (error) {
    next(error);
  }
};
