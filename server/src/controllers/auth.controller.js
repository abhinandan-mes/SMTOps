const prisma = require('../config/prisma');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role, teamId: user.teamId },
    process.env.JWT_SECRET || 'secret123',
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || 'refreshsecret123',
    { expiresIn: '7d' }
  );
  return { accessToken, refreshToken };
};

exports.login = async (req, res, next) => {
  try {
    const { employeeId, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { employeeId },
      include: { team: true }
    });

    if (!user || user.status === 'INACTIVE') {
      return res.status(401).json({ message: 'Invalid credentials or inactive account' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken }
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        employeeId: user.employeeId,
        role: user.role,
        team: user.team?.name
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  try {
    const { employeeId, name, email, password, role } = req.body;
    
    const existingUser = await prisma.user.findUnique({ where: { employeeId } });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        employeeId,
        name,
        email,
        passwordHash,
        role
      }
    });

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    next(error);
  }
};
