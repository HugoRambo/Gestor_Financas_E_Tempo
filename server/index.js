const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();

// Configuração do banco de dados
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'meu_banco_de_dados'
});

db.connect((err) => {
  if (err) {
    console.log('Erro ao conectar ao banco de dados: ', err);
  } else {
    console.log('Conexão bem sucedida ao banco de dados!');
  }
});

// Rota de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      res.send({ error: 'Erro ao executar a consulta.' });
    } else if (results.length === 0) {
      res.send({ error: 'Nome de usuário ou senha incorretos.' });
    } else {
      const user = results[0];
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.send({ error: 'Erro ao comparar senhas.' });
        } else if (result) {
          res.send({ message: 'Login bem sucedido!' });
        } else {
          res.send({ error: 'Nome de usuário ou senha incorretos.' });
        }
      });
    }
  });
});

// Inicialização do servidor
app.listen(3001, () => {
  console.log('Servidor iniciado na porta 3001.');
});