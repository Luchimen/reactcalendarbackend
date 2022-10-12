const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../helpers/jwt");
const crearUsuario = async (req, res) => {
  const { email, password } = req.body;
  try {
    let usuario = await Usuario.findOne({
      email,
    });
    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "Un usuario ya existe con ese correo",
      });
    }

    usuario = new Usuario(req.body);

    //Encriptando contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);
    await usuario.save();
    const token = await generarJWT(usuario.id, usuario.name);
    res.status(201).json({
      ok: true,
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Contacte con el administrador",
    });
  }
};
const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({
      email,
    });
    if (!usuario) {
      return res.status(400).json({
        ok: false,
        msg: "No existe un usuario con ese correo",
      });
    }

    //Validar los password
    const validPassword = bcrypt.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Passwrod incorrecto",
      });
    }
    //Generar el JWT
    const token = await generarJWT(usuario.id, usuario.name);
    res.status(200).json({
      ok: true,
      mgs: "Usuario logueado",
      uid: usuario.id,
      name: usuario.name,
      token,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "Contacte con el administrador",
    });
  }
};

const revalidarToken = async (req, res) => {
  const token = await generarJWT(req.id, req.name);
  res.json({
    ok: true,
    msg: "Token revalidado",
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
