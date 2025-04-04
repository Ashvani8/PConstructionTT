import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';
import Component from './Component.js';

const PCBuild = sequelize.define('PCBuild', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  totalWattage: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM('draft', 'saved', 'ordered'),
    defaultValue: 'draft',
  },
  components: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: {},
  },
  compatibility: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: [],
  },
});

// Associations
PCBuild.belongsTo(User);
User.hasMany(PCBuild);

export default PCBuild;
