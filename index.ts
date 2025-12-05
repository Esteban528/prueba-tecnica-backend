import express, { Request, Response } from 'express';
import { AsociadoUpdateDTO } from './types/UpdateDTO';
import { Asociado } from './types/Asociado';

const app = express();
const port = 3000;
const DATA_URL =
  "https://raw.githubusercontent.com/managerrojo/COAVANCOL-Prueba-T-cnica-/refs/heads/main/IndexAsociados";

app.use(express.json());

let data: Asociado[] = [];

const fetchData = async () => {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    data = await response.json() as Asociado[];
    console.log("Loaded data:", data.length);
  } catch (error) {
    console.error("Error :", error);
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
    return res.status(404).json({ error: "Asociado not found" });
  }

  asociado.estado_pipeline = update.estado_pipeline;

  res.status(200).json({ message: "Status updated", asociado });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
