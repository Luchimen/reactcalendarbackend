const Evento = require("../models/Evento");

const getEventos = async (req, res) => {
  const eventos = await Evento.find().populate("user", "name");

  res.status(200).json({
    ok: true,
    eventos,
  });
};

const crearEvento = async (req, res) => {
  //Verificar que tengo el evento
  const evento = await new Evento(req.body);

  try {
    evento.user = req.uid;
    const eventoGuardado = await evento.save();
    res.status(200).json({
      ok: true,
      evento: eventoGuardado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const actualizarEvento = async (req, res) => {
  const eventoId = req.params.id;
  const { uid } = req;

  try {
    const evento = await Evento.findById(eventoId);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "Evento no existe",
      });
    }
    if (evento.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: "No tiene acceso para modificar ese evento",
      });
    }
    const nuevoEvento = {
      ...req.body,
      user: uid,
    };
    const eventoActualizado = await Evento.findByIdAndUpdate(
      eventoId,
      nuevoEvento,
      { new: true }
    );
    res.json({
      ok: true,
      evento: eventoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const eliminarEvento = async (req, res) => {
  const eventoId = req.params.id;

  try {
    const evento = await Evento.findById(eventoId);
    console.log(evento);
    if (!evento) {
      return res.status(404).json({
        ok: false,
        msg: "El evento a eliminar no existe",
      });
    }
    if (evento.user.toString() !== req.uid) {
      return res.status(400).json({
        ok: false,
        msg: "No puede eliminar un evento que no le pertenece",
      });
    }
    await Evento.findByIdAndDelete(eventoId);
    res.status(200).json({
      ok: true,
      msg: "Evento eliminado con exito",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      ok: false,
      msg: "Error en la eliminación hable con el administrador",
    });
  }
};

module.exports = {
  getEventos,
  crearEvento,
  actualizarEvento,
  eliminarEvento,
};
