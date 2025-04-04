import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const BuildTemplate = sequelize.define('BuildTemplate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.ENUM('gaming', 'workstation', 'office', 'streaming', 'budget'),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  priceRange: {
    type: DataTypes.ENUM('budget', 'mid-range', 'high-end', 'extreme'),
    allowNull: false,
  },
  recommendedSpecs: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  performance: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default BuildTemplate;
