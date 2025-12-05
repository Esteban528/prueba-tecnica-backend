import express, { Request, Response } from 'express';
import { AsociadoUpdateDTO } from './types/UpdateDTO';
import { Asociado } from './types/Asociado';

const app = express();
const port = 3000;
const DATA_URL =
  "https://raw.githubusercontent.com/managerrojo/COAVANCOL-Prueba-T-cnica-/refs/heads/main/IndexAsociados";
const estados = ["Todos", "Prospecto", "Expediente en Construcción", "Pendiente Jurídico", "Pendiente Cierre de Crédito"]

app.use(express.json());

let data: Asociado[] = [];

const fetchData = async () => {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`Error http: ${response.status}`);
    }
    data = await response.json() as Asociado[];
    console.log("Datos cargados:", data.length);
  } catch (error) {
    console.error("Error:", error);
  }
};

fetchData();

app.get('/', (req: Request, res: Response) => {
  res.json(data);
});

app.post('/updateEstadoPipeline', (req: Request, res: Response) => {
  const update: AsociadoUpdateDTO = req.body;

  const asociado = data.find(a => a.id == update.asociadoId);
  if (!asociado) {
    return res.status(404).json({ error: "Asociado no encontrado" });
  }

  if (!update.nuevoEstado || !estados.includes(update.nuevoEstado)) {
    return res.status(400).json({ error: "Estado inválido" });
  }

  asociado.estado_pipeline = update.nuevoEstado;
  console.log(`Asociado modified ${asociado}`)

  res.status(200).json({ message: "Estado actualizado con éxito", asociado });
});

app.listen(port, () => {
  console.log(`Servidor escuchando ${port}`);
});
