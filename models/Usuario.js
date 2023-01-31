const conexao = require('./conexao')

const Usuario = conexao.sequelize.define('usuario', {
  nome: {
    type: conexao.Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  login: {
    type: conexao.Sequelize.STRING,
    allowNull: false
  },
  senha: {
    type: conexao.Sequelize.STRING,
    allowNull: false
  },
})

//Usuario.sync({ force: true });

module.exports = Usuario;