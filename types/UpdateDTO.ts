export type AsociadoUpdateDTO = {
  asociadoId: string
  nuevoEstado: "Todos" | "Prospecto" | "Expediente en Construcción" | "Pendiente Jurídico" | "Pendiente Cierre de Crédito"
}
