export default interface IRecibo {
    idUsuarioContador: number,
    idUsuarioEmpleado: number,
    idTipoRecibo: number,
    fecha: string,
    sueldo_neto: number,
    sueldo_bruto: number
}