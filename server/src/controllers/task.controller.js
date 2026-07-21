const prisma = require('../config/prisma');

exports.createTask = async (req, res, next) => {
  try {
    const { taskName, description, assignedToId, priority, dueDate, checklist, isRecurring, recurringPattern } = req.body;
    const createdById = req.userId;

    const task = await prisma.task.create({
      data: {
        taskName,
        description,
        assignedToId,
        createdById,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        checklist,
        isRecurring,
        recurringPattern
      }
    });

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const { assignedToId, status, priority } = req.query;
    const filter = {};
    if (assignedToId) filter.assignedToId = assignedToId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const tasks = await prisma.task.findMany({
      where: filter,
      include: {
        assignedTo: { select: { name: true } },
        createdBy: { select: { name: true } }
      },
      orderBy: { dueDate: 'asc' }
    });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

exports.updateTaskStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, checklist } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: { status, checklist }
    });
    res.json(task);
  } catch (error) {
    next(error);
  }
};
