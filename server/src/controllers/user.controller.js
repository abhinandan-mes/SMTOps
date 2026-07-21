const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res, next) => {
  try {
    const { employeeId, name, email, password, role, teamId, shift } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { employeeId } });
    
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: { employeeId, name, email, passwordHash, role, teamId, shift }
    });
    
    // Omit password hash in response
    const { passwordHash: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { role, teamId } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (teamId) filter.teamId = teamId;

    const users = await prisma.user.findMany({
      where: filter,
      include: { team: { select: { name: true } } },
      select: {
        id: true, employeeId: true, name: true, email: true, mobile: true,
        role: true, shift: true, status: true, teamId: true, team: true
      }
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, teamId, shift, status } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { name, email, role, teamId, shift, status },
      select: { id: true, name: true, email: true, role: true, teamId: true, status: true }
    });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    await prisma.user.update({
      where: { id },
      data: { status: 'INACTIVE' } // Soft delete
    });
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    next(error);
  }
};
