import express from 'express';
import { MemoryHotelRepositoryImpl } from '../persistance/hotel.repository.impl';
import { ObtenerHotelUseCase } from '../../aplicacion/casosDeUso/obtenerHotel.use-case';
import { CrearHotelUseCase } from '../../aplicacion/casosDeUso/crearHotel.use-case'; 
import { agregarHabitacionSimpleUseCase } from '../../aplicacion/casosDeUso/agregarHabitacionSimple.use-case';
import { IdParamvalidator } from '../validations/id-param.validator';
import { ExceptionHandler } from '../middlewares/ExceptionHandler'; 
import { ValidationException } from '../exceptions/ValidationError';

// --- NUEVAS IMPORTACIONES REQUERIDAS ---
import { agregarHabitacionDobleUseCase } from '../../aplicacion/casosDeUso/agregarHabitacionDoble.use-case';
import { FiltrarHabitacionesUseCase } from '../../aplicacion/casosDeUso/filtrarHabitaciones.use-case';

const memoriHotelRepository = new MemoryHotelRepositoryImpl();

export function initializeController(app: express.Express) {

    /**
     * @swagger
     * /hotel:
     * post:
     * summary: Crear un nuevo hotel
     * tags:
     * - Hoteles
     * requestBody:
     * required: true
     * content:
     * application/json:
     * schema:
     * $ref: '#/components/schemas/HotelInput'
     * responses:
     * 201:
     * description: Hotel creado exitosamente
     * 400:
     * description: Error de validacion
     */
    app.post('/hotel', (req: express.Request, res: express.Response) => {
        const body = req.body as { nombre: string; direccion: string; estrellas: number };
        let respError: any = undefined;
        try {
            const hotel = new CrearHotelUseCase(memoriHotelRepository).execute(body);
            res.status(201).json(hotel);
        } catch (err) {
            respError = ExceptionHandler.handle(err as Error);
            return res.status(respError.status).json({
                message: respError.message,
                error: respError.error,
            });
        }
    });

    /**
     * @swagger
     * /hotel/{id}:
     * get:
     * summary: Obtiene un hotel por su ID
     * tags:
     * - Hoteles
     * parameters:
     * - in: path
     * name: id
     * required: true
     * schema:
     * type: string
     * description: ID del hotel
     * responses:
     * 200:
     * description: Detalles del hotel
     * 400:
     * description: ID invalido
     * 404:
     * description: Hotel no encontrado
     */
    app.get('/hotel/:id', (req: express.Request, res: express.Response) => {
        const params = req.params as { id: string };
        let respError: any = undefined;
        try {
            IdParamvalidator.validate(params.id);
            const hotel = new ObtenerHotelUseCase(memoriHotelRepository).execute(params.id);
            res.status(200).json(hotel);
        } catch (err) {
            respError = ExceptionHandler.handle(err as Error);
            return res.status(respError.status).json({
                message: respError.message,
                error: respError.error,
            });
        }
    });

    /**
     * @swagger
     * /hotel/{id}/habitacion-simple:
     * post:
     * summary: Agrega una habitacion simple al hotel
     * tags:
     * - Hoteles
     * parameters:
     * - in: path
     * name: id
     * required: true
     * schema:
     * type: string
     * description: ID del hotel
     * requestBody:
     * required: true
     * content:
     * application/json:
     * schema:
     * $ref: '#/components/schemas/HabitacionSimple'
     * responses:
     * 200:
     * description: Habitacion simple agregada exitosamente
     * 400:
     * description: Error de validacion
     * 404:
     * description: Hotel no encontrado
     */
    app.post('/hotel/:id/habitacion-simple', (req: express.Request, res: express.Response) => {
        const params = req.params as { id: string };
        const body = req.body as { numeroHabitacion: number; precio: number };
        let respError: any = undefined;
        try {
            IdParamvalidator.validate(params.id);
            const hotel = new ObtenerHotelUseCase(memoriHotelRepository).execute(params.id);
            new agregarHabitacionSimpleUseCase().execute(hotel, body);
            res.status(200).json({ mensaje: 'Habitacion simple agregada exitosamente' });
        } catch (err) {
            respError = ExceptionHandler.handle(err as Error);
            return res.status(respError.status).json({
                message: respError.message,
                error: respError.error,
            });
        }
    });

    /**
     * @swagger
     * /hotel/:id/habitacion-doble:
     * post:
     * summary: Agrega una habitacion doble al hotel
     * tags:
     * - Hoteles
     * parameters:
     * - in: path
     * name: id
     * required: true
     * schema:
     * type: string
     * description: ID del hotel
     * requestBody:
     * required: true
     * content:
     * application/json:
     * schema:
     * $ref: '#/components/schemas/HabitacionSimple'
     * responses:
     * 200:
     * description: Habitacion doble agregada exitosamente
     * 400:
     * description: Error de validacion
     * 404:
     * description: Hotel no encontrado
     */
    app.post('/hotel/:id/habitacion-doble', (req: express.Request, res: express.Response) => {
        const params = req.params as { id: string };
        const body = req.body as { numeroHabitacion: number; precio: number };
        let respError: any = undefined;
        try {
            IdParamvalidator.validate(params.id);
            const hotel = new ObtenerHotelUseCase(memoriHotelRepository).execute(params.id);
            new agregarHabitacionDobleUseCase().execute(hotel, body);
            res.status(200).json({ mensaje: 'Habitación doble agregada exitosamente' });
        } catch (err) {
            respError = ExceptionHandler.handle(err as Error);
            return res.status(respError.status).json({
                message: respError.message,
                error: respError.error,
            });
        }
    });

    /**
     * @swagger
     * /hotel/{id}/filtrar-habitaciones-disponibles:
     * get:
     * summary: Filtra habitaciones disponibles por capacidad y rango de fechas
     * tags:
     * - Hoteles
     * parameters:
     * - in: path
     * name: id
     * required: true
     * schema:
     * type: string
     * description: ID del hotel
     * - in: query
     * name: capacidad
     * required: true
     * schema:
     * type: integer
     * description: Capacidad minima requerida
     * - in: query
     * name: fechaInicio
     * required: true
     * schema:
     * type: string
     * format: date
     * description: Fecha de entrada (YYYY-MM-DD)
     * - in: query
     * name: fechaFin
     * required: true
     * schema:
     * type: string
     * format: date
     * description: Fecha de salida (YYYY-MM-DD)
     * responses:
     * 200:
     * description: Lista de habitaciones disponibles que cumplen el filtro
     * 400:
     * description: Parametros invalidos o inconsistencia en las fechas
     * 404:
     * description: Hotel no encontrado
     */
    app.get('/hotel/:id/filtrar-habitaciones-disponibles', (req: express.Request, res: express.Response) => {
        const params = req.params as { id: string };
        const query = req.query as { capacidad?: string; fechaInicio?: string; fechaFin?: string };
        let respError: any = undefined;

        try {
            IdParamvalidator.validate(params.id);

            if (!query.capacidad || !query.fechaInicio || !query.fechaFin) {
                throw new ValidationException('Faltan parámetros de consulta obligatorios: capacidad, fechaInicio y fechaFin.');
            }

            const capacidadNum = parseInt(query.capacidad, 10);
            if (isNaN(capacidadNum) || capacidadNum <= 0) {
                throw new ValidationException('La capacidad debe ser un número entero válido y mayor a 0.');
            }

            const fechaInicioDate = new Date(query.fechaInicio);
            const fechaFinDate = new Date(query.fechaFin);

            if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
                throw new ValidationException('Formatos de fecha inválidos. Use el estándar YYYY-MM-DD.');
            }

            if (fechaInicioDate >= fechaFinDate) {
                throw new ValidationException('La fecha de inicio debe ser estrictamente anterior a la fecha de fin.');
            }

            const hotel = new ObtenerHotelUseCase(memoriHotelRepository).execute(params.id);

            const habitacionesDisponibles = new FiltrarHabitacionesUseCase().execute(hotel, {
                capacidad: capacidadNum,
                fechaInicio: query.fechaInicio,
                fechaFin: query.fechaFin
            });

            res.status(200).json(habitacionesDisponibles);
        } catch (err) {
            respError = ExceptionHandler.handle(err as Error);
            return res.status(respError.status).json({
                message: respError.message,
                error: respError.error,
            });
        }
    });
}