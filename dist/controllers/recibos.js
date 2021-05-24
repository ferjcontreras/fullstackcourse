"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRecibo = exports.create = void 0;
const file_system_1 = __importDefault(require("../class/file-system"));
const promesas_1 = __importDefault(require("../utils/promesas"));
const fileSystem = new file_system_1.default();
function create(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const newRecibo = {
            idUsuarioContador: req.usuario._id,
            idUsuarioEmpleado: req.body.id_usuario_empleado,
            idTipoRecibo: req.body.id_tipo_recibo,
            fecha: req.body.fecha,
            sueldo_neto: req.body.sueldo_neto,
            sueldo_bruto: req.body.sueldo_bruto
        };
        if (req.usuario.rol == 2) { // solo permite agregar el recibo si tiene el rol de contador
            try {
                const archivoRecibo = yield fileSystem.fileFromTempToRecibos(newRecibo.idUsuarioEmpleado);
                yield promesas_1.default('start transaction');
                yield promesas_1.default("INSERT INTO recibo (idUsuarioContador, idUsuarioEmpleado, idTipoRecibo, fecha, sueldo_neto, sueldo_bruto, archivo) VALUES (?,?,?,?,?,?,?)", [newRecibo.idUsuarioEmpleado, newRecibo.idUsuarioEmpleado, newRecibo.idTipoRecibo, newRecibo.fecha, newRecibo.sueldo_neto, newRecibo.sueldo_bruto, archivoRecibo]);
                yield promesas_1.default('commit');
                res.json({ estado: "success" });
            }
            catch (error) {
                const rollback = yield promesas_1.default('rollback'); //puede ir sin await(si no necesito ningun dato del rollback)
                res.json({ estado: "error", data: error, rollback: rollback });
            }
        }
        else {
            res.json({
                estado: "error",
                mensaje: "usted no tiene privilegios para realizar esta operación"
            });
        }
    });
}
exports.create = create;
function uploadRecibo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const archivo = req.files.archivo;
        const Recibo = {
            idUsuario: req.body.id_usuario,
        };
        if (req.usuario.rol == 2) { // Si se trata de un contador, entonces si puedo subir el recibo, de lo contrario no
            if (!req.files) {
                return res.status(400).json({
                    estado: "error",
                    mensaje: "No se encontró ningún archivo"
                });
            }
            if (!archivo.mimetype.includes("image") && !archivo.mimetype.includes("pdf")) { // solo permite archivos de imagenes y pdf
                return res.status(400).json({
                    estado: "error",
                    mensaje: "Formato de imagen incorrecto"
                });
            }
            yield fileSystem.saveReciboTemp(Recibo.idUsuario, archivo);
            res.json({
                estado: "success",
                data: archivo
            });
        }
        else {
            res.json({
                estado: "error",
                mensaje: "Usted no tiene privilegios para realizar esta operación"
            });
        }
    });
}
exports.uploadRecibo = uploadRecibo;
