const Sequelize = require('sequelize')
// trocar nome da database e senha
const sequelize = new Sequelize('virtualTickets', 'root', 'root', {
	host: 'localhost',
	dialect: 'mysql',
	query: { raw: true }
})

sequelize.authenticate().then(function () {
	console.log("Conectado!!")
}).catch(function (erro) {
	console.log("Erro ao conectar: " + erro)
})

module.exports = {
	Sequelize: Sequelize,
	sequelize: sequelize
}
