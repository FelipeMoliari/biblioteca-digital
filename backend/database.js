const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.NODE_ENV === 'production' ? ':memory:' : path.join(__dirname, 'database.db'),
  logging: false,
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true
  }
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com banco de dados estabelecida com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao conectar com banco de dados:', error);
  }
};

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('✅ Modelos sincronizados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao sincronizar modelos:', error);
  }
};

module.exports = sequelize;
module.exports.testConnection = testConnection;
module.exports.syncDatabase = syncDatabase;