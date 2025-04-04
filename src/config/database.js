import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('postgresql://neondb_owner:npg_TWud5rpBcG0j@ep-bitter-hat-a4doyajf-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require', {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

export { sequelize };
