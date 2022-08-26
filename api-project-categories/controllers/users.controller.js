const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../Providers/mailProvider");

exports.findAll = async (req, res) => {
  await User.findAll({
    attributes: ["id", "name", "email", "gender", "password"],
    order: [["name", "ASC"]],
  })
    .then((users) => {
      return res.json({
        erro: false,
        users,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        erro: true,
        mensagem: `Erro: ${err} ou Nenhum Usuário encontrado!!!`,
      });
    });
};

exports.findOne = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await User.findByPk(id);
    if (!users) {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum Usuário encontrado!",
      });
    }
    res.status(200).json({
      erro: false,
      users,
    });
  } catch (err) {
    res.status(400).json({
      erro: true,
      mensagem: `Erro: ${err}`,
    });
  }
};

exports.create = async (req, res) => {
  var dados = req.body;
  dados.password = await bcrypt.hash(dados.password, 8);
  let email = dados.email;
  let name = dados.name;
  let gender = dados.gender;

  await User.create(dados)
    .then(() => {
      /* enviar e-mail */
      let to = email;
      let cc = "";
      var htmlbody = "";
      htmlbody += '<div style="background-color:#000; margin-bottom:150px;">';
      htmlbody += '<div style="margin-top:150px;">';
      htmlbody += '<p style="color:#fff; font-weight:bold;margin-top:50px;">';
      htmlbody += "Olá {name},";
      htmlbody += "</p>";
      htmlbody += '<p style="color:#fff; font-style:italic;margin-top:50px;">';
      htmlbody += "Sua conta foi criada com sucesso!";
      htmlbody += "</p>";
      htmlbody += '<p style="color:#fff;margin-top:50px;">';
      htmlbody += "Seu login é o seu email: {email}";
      htmlbody += "</p>";
      htmlbody += '<p style="color:#fff;margin-top:50px;">';
      htmlbody += "Sexo: {gender}";
      htmlbody += "</p>";
      htmlbody += "</div>";
      htmlbody += "</div>";
      htmlbody = htmlbody.replace("{name}", name);
      htmlbody = htmlbody.replace("{email}", email);
      htmlbody = htmlbody.replace("{gender}", gender);
      /* ************* */
      sendMail(to, cc, "Sua conta foi criada com sucesso!", htmlbody);

      return res.json({
        erro: false,
        mensagem: "Usuário cadastrado com sucesso!",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        erro: true,
        mensagem: `Erro: Usuário não cadastrado... ${err}`,
      });
    });
};

exports.update = async (req, res) => {
  const { id } = req.body;

  await User.update(req.body, { where: { id } })
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Usuário alterado com sucesso!",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        erro: true,
        mensagem: `Erro: Usuário não alterado ...${err}`,
      });
    });
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } })
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Usuário apagado com sucesso!",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        erro: true,
        mensagem: `Erro: ${err} Usuário não apagado...`,
      });
    });
};

exports.findOne2 = async (req, res) => {
  await sleep(3000);
  function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
  const user = await User.findOne({
    attributes: ["id", "name", "email", "gender", "password"],
    where: {
      email: req.body.email,
    },
  });
  if (user === null) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Email ou senha incorreta!!!",
    });
  }
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Email ou senha incorreta!!!",
    });
  }

  var token = jwt.sign({ id: user.id }, process.env.SECRET, {
    expiresIn: 900, //10min
  });

  return res.json({
    erro: false,
    mensagem: "Login realizado com sucesso!!!",
    token,
    user: user.id
    // name: user.name,
    // email: user.email,
    // gender: user.gender
  });
};

exports.update2 = async (req, res) => {
  const { id, password } = req.body;
  var senhaCrypt = await bcrypt.hash(password, 8);

  await User.update({ password: senhaCrypt }, { where: { id: id } })
    .then(() => {
      return res.json({
        erro: false,
        mensagem: "Senha edita com sucesso!",
      });
    })
    .catch((err) => {
      return res.status(400).json({
        erro: true,
        mensagem: `Erro: ${err}... A senha não foi alterada!!!`,
      });
    });
};

exports.editProfileImage = async (req, res) => {
  if (req.file) {
    console.log(req.file);

    await User.findByPk(req.userId)
      .then((user) => {
        console.log(user);
        const imgOld = "./public/upload/users/" + user.dataValues.profileimage;
        fs.access(imgOld, (err) => {
          if (!err) {
            fs.unlink(imgOld, () => {});
          }
        });
      })
      .catch(() => {
        return (
          res.status(400),
          json({
            erro: true,
            mensagem: "Erro: Perfil do usuário não encontrado!",
          })
        );
      });
    await User.update(
      { profileimage: req.file.filename },
      { where: { id: req.userId } }
    )
      .then(() => {
        return res.json({
          erro: false,
          mensagem: "Imagem editada com sucesso!",
        });
      })
      .catch((err) => {
        return res.status(400).json({
          erro: true,
          mensagem: `Erro: Imagem não editada!... ${err}`,
        });
      });
  } else {
    return res.status(400).json({
      erro: true,
      mensagem: "Erro: Selecione uma imagem válida (.png,.jpeg,.jpg",
    });
  }
};

exports.viewProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const users = await User.findByPk(id);
    if (!users) {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Nenhum Usuário encontrado!",
      });
    }
    if(users.image){
        var endImagem = process.env.URL_IMG + 'files/users/' + users.profieimage
    }else{
        var endImagem = ""
    }
    var endImagem = "http://localhost:4600/files/users/" + users.profileimage;
    res.status(200).json({
      erro: false,
      users,
      endImagem,
    });
  } catch (err) {
    res.status(400).json({
      erro: true,
      mensagem: `Erro: ${err}`,
    });
  }
};

exports.validaToken = async (req, res) => {
  await User.findByPk(req.userId, {
    attributes: ["id", "name", "email"],
  })
    .then((user) => {
      return res.status(200).json({
        erro: false,
        user,
      });
    })
    .catch(() => {
      return res.status(400).json({
        erro: true,
        mensagem: "Erro: Necessário realizar o login!!!",
      });
    });
};
