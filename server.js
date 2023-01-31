const express = require("express");
const app = express();
const port = 8081;
const bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const Produto = require("./models/Produto");
const Usuario = require("./models/Usuario");
const conexao = require("./models/conexao");
//const session = require('express-session');
//app.use(session({secret:'shrek2',saveUninitialized:true,resave:true,cookie: {maxAge: 3600000}}));
//conexao.sequelize.sync()

/*var login = "admin";
var senha = "123456";*/

//Bcrypt e jwt
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { eAdmin } = require('./middleware/auth')

//body parser
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//config
//template engine

const exphbs = require("express-handlebars");
const path = require("path");
const { redirect } = require("express/lib/response");
app.use(express.static(path.join(__dirname, "/public")));

//handlebars
app.use(express.static(path.join(__dirname, "/views")));
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.set("views", path.join(__dirname, "/views"));
app.engine(
  "hbs",
  exphbs.engine({
    defaultLayout: "main",
    extname: ".hbs",
    layoutsDir: path.join(__dirname, "views/layouts"),
  })

);


app.set("view engine", "hbs");

//rotas

app.get("/", (req, res) => {
  Produto.findAll().then(function (lista) {
    res.render('index', { lista: lista });
  })
})

app.get("/privacidade", function (req, res) {
  res.render("privacidade")
})

app.get("/termos", function (req, res) {
  res.render("termos")
})

/*app.get("/paginaInicial",eAdmin, function (req, res) {
  res.render("posLogin");
});*/

app.get("/listaDeEventos", function (req, res) {

})

app.get("/buscaProdutos", function (req, res) {
  res.render("buscaProdutos");
});

//validação de usuario
//app.use("*",validaToken)

app.get("/cadastraProdutos", function (req, res) {
  res.render("cadastraProdutos");
});
app.get("/atualizaProduto", (req, res) => {
  var id = req.query.id;

  Produto.findOne({
    where: {
      id: id
    }
  }).then(function (produto) {
    var formulario = "<form action='/upprodutos' method='post'>";
    formulario += "Id: <input type='text' name='id' value='" + produto.id + "'<br>";
    formulario += "Código: <input type='text' name='codigo' value='" + produto.codigo + "'><br>";
    formulario += "Nome: <input type='text' name='nome' value='" + produto.nome + "'><br>";
    formulario += "Preço: <input type='text' name='preco' value='" + produto.preco + "'><br>";
    formulario += "Tipo de Evento: <input type='text' name='tipoDeEvento' value='" + produto.tipoDeEvento + "'><br><br>";
    formulario += "Local: <input type='text' name='local' value='" + produto.local + "'><br><br>";
    formulario += "Data do Evento: <input type='date' name='data' value='" + produto.data + "'><br><br>";
    formulario += "Descrição: <input type='text' name='descricao' value='" + produto.descricao + "'> <br> "
    formulario += "<button>Atualizar</button>";
    formulario += "</form>";
    res.send(formulario);

  }).catch(function (erro) {
    console.log("Houve problema na busca do produto: " + erro);
    res.send("Houve um erro na solicitação. Contate o administrador!");
  })
});

app.post("/upprodutos", urlencodedParser, (req, res) => {
  var id = req.body.id;
  var codigo = req.body.codigo;
  var nome = req.body.nome;
  var preco = req.body.preco;
  var tipoEvent = req.body.tipoDeEvento;
  var local = req.body.local;
  var data = req.body.data;
  var descricao = req.body.descricao;
  var foto = req.body.foto;

  var produto = {
    codigo: codigo,
    nome: nome,
    preco: preco,
    tipoDeEvento: tipoEvent,
    local: local,
    data: data,
    descricao: descricao,
    foto: foto,
  };

  console.log(produto);

  Produto.update(produto, {
    where: {
      id: id,
    },
  })
    .then(function () {
      console.log("Produto atualizado com sucesso!");
      res.send("Produto atualizado com sucesso!");
    })
    .catch(function (erro) {
      console.log("Deu algum erro no update: " + erro);
      res.send(
        "Houve algum problema durante a atualização. Contate o administrado!"
      );
    });
});

app.get("/delprodutos", (req, res) => {
  var id = req.query.id;

  Produto.destroy({
    where: { id: id },
  })
    .then(function () {
      console.log("Produto removido com sucesso!");
      res.send("Produto removido com sucesso!");
    })
    .catch(function (erro) {
      console.log("Erro ao remover produto " + erro);
      res.send("Houve um problema ao remover o produto!");
    });
});

app.post("/produtos", urlencodedParser, function (req, res) {
  var codigo = req.body.codigo;
  var nome = req.body.nome;
  var preco = req.body.preco;
  var tipoEvent = req.body.tipoDeEvento;
  var foto = req.body.foto;

  var novoProduto = {
    codigo: codigo,
    nome: nome,
    preco: preco,
    tipoDeEvento: tipoEvent,
    foto: foto
  };
  Produto.create(novoProduto)
    .then(function () {
      console.log("Produto cadastrado com sucesso!");
      res.send("Produto cadastrado com sucesso!");
    })
    .catch(function (erro) {
      console.log("Deu algu erro no cadastro: " + erro);
      res.send(
        "Houve algum problema durante o cadastro. Contate o administrado!"
      );
    });
});

app.get("/produtos", (req, res) => {
  const { Op } = require("sequelize");

  var codigo = req.query.codigo;
  var nome = req.query.nome;
  var preco = req.query.preco;
  var tipoevent = req.query.tipoDeEvento;

  Produto.findAll({
    where: {
      [Op.and]: [
        {
          nome: {
            [Op.substring]: nome,
          },
        },
        {
          tipoDeEvento: {
            [Op.substring]: tipoevent,
          },
        },
        {
          preco: {
            [Op.lte]: preco,
          },
        },
      ],
    },
  }).then(function (produtos) {
    console.log(produtos);
    var tabela = "<h3>Resultado da Busca</h3><br>";

    for (var i = 0; i < produtos.length; i++) {
      tabela += "<b>Codigo:</b> " + produtos[i].codigo + "<br>";
      tabela += "<b>Nome:</b> " + produtos[i].nome + "<br>";
      tabela += "R$ " + produtos[i].preco + "<br>";
      tabela += "<b>Tipo de Evento:</b> " + produtos[i].tipoDeEvento + "<br>";
      tabela += "<b>Descrição:</b> " + produtos[i].descricao + "<br>";
      tabela +=
        "<a href='/atualizaProduto?id=" + produtos[i].id + "'>Atualizar</a>";
      tabela +=
        "&nbsp;&nbsp;<a href='/delprodutos?id=" +
        produtos[i].id +
        "'>Excluir</a><br><br>";
    }

    res.send(tabela);
  });
});
// usuario 

//cadastro
app.get("/cadastraUsuario", function (req, res) {
  res.render("cadastraUsuario");
});

app.post('/cadastro', async (req, res) => {
  const isExist = await Usuario.findOne({
    where: {
      login: req.body.login
    }
  })
  if (isExist) {
    return res.status(400).json({ error: "Usuário já cadastrado!" })
  }

  var dados = req.body;
  dados.senha = await bcrypt.hash(dados.senha, 8);

  await Usuario.create(dados).then(() => {
    return res.redirect('/entrar')
    /*return res.json({
      erro: false,
      mensagem: "Usuario cadastrado com sucesso!"
    })*/
  }).catch(() => {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Usuario não foi cadastrado com sucesso!"
    })
  })


})


// Login

app.get("/entrar", function (req, res) {
  res.render('login')
})

app.post("/login", async (req, res) => {
  const user = await Usuario.findOne({
    attributes: ['id', 'login', 'senha'],
    where: {
      login: req.body.login
    }
  });

  if (user === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Usuario ou a senha incorretos!"
    })
  }

  if (!(await bcrypt.compare(req.body.senha, user.senha))) {
    return res.status(400).json({
      erro: true,
      mensagem: "Usuario ou a senha incorretos!"
    })
  }

  var token = jwt.sign({ id: user.id }, "shrek2ebom", {
    expiresIn: 900
  });

  return res.json({
    erro: false,
    mensagem: "Login",
    token
  })
})


/*app.get("/delusuarios", (req, res) => {
  var id = req.query.id;

  Usuario.destroy({
    where: { id: id },
  })
    .then(function () {
      console.log("Produto removido com sucesso!");
      res.send("Produto removido com sucesso!");
    })
    .catch(function (erro) {
      console.log("Erro ao remover produto " + erro);
      res.send("Houve um problema ao remover o produto!");
    });
});*/



app.listen(port, () => {
  console.log(`Esta aplicação está escutando a
porta ${port}`);
});
