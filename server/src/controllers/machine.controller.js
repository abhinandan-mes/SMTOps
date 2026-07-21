const prisma = require('../config/prisma');
const QRCode = require('qrcode');

exports.createMachine = async (req, res, next) => {
  try {
    const { machineName, machineCode, productionLine, vendor, model, serialNumber, softwareVersion, installationDate } = req.body;
    
    // Generate QR Code containing the machineCode (could also be a full URL to the frontend route)
    // Format: http://<frontend_url>/machines/<machineCode>/timeline
    const qrData = `SMTOps-Machine:${machineCode}`;
    const qrCodeUrl = await QRCode.toDataURL(qrData);

    const machine = await prisma.machine.create({
      data: {
        machineName,
        machineCode,
        productionLine,
        vendor,
        model,
        serialNumber,
        softwareVersion,
        installationDate: installationDate ? new Date(installationDate) : null,
        qrCodeUrl
      }
    });

    res.status(201).json(machine);
  } catch (error) {
    next(error);
  }
};

exports.getMachines = async (req, res, next) => {
  try {
    const { productionLine, status } = req.query;
    const filter = {};
    if (productionLine) filter.productionLine = productionLine;
    if (status) filter.status = status;

    const machines = await prisma.machine.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' }
    });
    res.json(machines);
  } catch (error) {
    next(error);
  }
};

exports.getMachineByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const machine = await prisma.machine.findUnique({
      where: { machineCode: code }
    });
    if (!machine) return res.status(404).json({ message: 'Machine not found' });
    res.json(machine);
  } catch (error) {
    next(error);
  }
};
