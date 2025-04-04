import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Component = sequelize.define('Component', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('cpu', 'motherboard', 'memory', 'storage', 'gpu', 'psu', 'case', 'cooling'),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  specs: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  wattage: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  // CPU specific
  socket: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cores: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  threads: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  baseSpeed: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  boostSpeed: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  // Motherboard specific
  chipset: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  memorySlots: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  memoryType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  maxMemory: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Memory specific
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  speed: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // Storage specific
  storageType: {
    type: DataTypes.ENUM('SSD', 'HDD', 'NVMe'),
    allowNull: true,
  },
  // GPU specific
  vram: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  // PSU specific
  efficiency: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  modular: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
});

export default Component;
