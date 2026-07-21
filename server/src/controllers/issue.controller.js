const prisma = require('../config/prisma');

const generateIssueNumber = async () => {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const count = await prisma.issue.count({
    where: { issueNumber: { startsWith: `ISS-${dateStr}` } }
  });
  const sequentialNum = String(count + 1).padStart(3, '0');
  return `ISS-${dateStr}-${sequentialNum}`;
};

exports.createIssue = async (req, res, next) => {
  try {
    const { title, description, teamId, machine, productionLine, priority, assignedToId, dueDate } = req.body;
    const createdById = req.userId;
    const issueNumber = await generateIssueNumber();

    const issue = await prisma.issue.create({
      data: {
        issueNumber, title, description, teamId, machine, productionLine,
        priority, assignedToId, createdById, dueDate: dueDate ? new Date(dueDate) : null
      }
    });
    res.status(201).json(issue);
  } catch (error) {
    next(error);
  }
};

exports.getIssues = async (req, res, next) => {
  try {
    const { teamId, status, priority, assignedToId } = req.query;
    const filter = {};
    if (teamId) filter.teamId = teamId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedToId) filter.assignedToId = assignedToId;

    const issues = await prisma.issue.findMany({
      where: filter,
      include: {
        team: { select: { name: true } },
        assignedTo: { select: { name: true } },
        createdBy: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(issues);
  } catch (error) {
    next(error);
  }
};

exports.transferIssue = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newTeamId, reason, comments } = req.body;
    const transferredById = req.userId;

    const issue = await prisma.issue.update({
      where: { id },
      data: { 
        teamId: newTeamId, 
        status: 'TRANSFERRED',
        assignedToId: null // Reset assignment upon transfer
      }
    });

    await prisma.issueHistory.create({
      data: {
        issueId: id,
        transferredById,
        transferredToId: newTeamId,
        reason,
        comments
      }
    });

    res.json(issue);
  } catch (error) {
    next(error);
  }
};

exports.updateIssueStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, rootCause, correctiveAction, preventiveAction } = req.body;
    
    const issue = await prisma.issue.update({
      where: { id },
      data: { status, rootCause, correctiveAction, preventiveAction }
    });
    res.json(issue);
  } catch (error) {
    next(error);
  }
};
