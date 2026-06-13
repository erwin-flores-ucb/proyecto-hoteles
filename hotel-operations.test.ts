import { describe, expect, it } from '@jest/globals';
import { MemoryHotelRepositoryImpl } from '../../src/infraestructura/persistance/hotel.repository.impl';
import { CrearHotelUseCase } from '../../src/aplicacion/casosDeUso/crearHotel.use-case';
import { agregarHabitacionSimpleUseCase } from '../../src/aplicacion/casosDeUso/agregarHabitacionSimple.use-case';
import { ObtenerHotelUseCase } from '../../src/aplicacion/casosDeUso/obtenerHotel.use-case';
import { HabitacionSimple, HabitacionDoble } from '../../src/dominio/Habitacion'; 
import { DatabaseNotFoundException } from '../../src/infraestructura/exceptions/DatabaseNotFoudException';

describe('Hotel Integration Tests - Operations', () => {
    
    // 2.1 & 2.2 & 2.3 Flujo completo de integración
    it('debe gestionar el flujo completo de agregar habitaciones y recuperar el hotel con sus datos correctos', () => {
        // Inicializamos la infraestructura y casos de uso (capa aplicación e infraestructura)
        const hotelRepository = new MemoryHotelRepositoryImpl();
        const crearHotelUC = new CrearHotelUseCase(hotelRepository);
        const agregarSimpleUC = new agregarHabitacionSimpleUseCase();
        const obtenerHotelUC = new ObtenerHotelUseCase(hotelRepository);

        // 1. Creamos un hotel base a través del caso de uso
        const hotelCreado = crearHotelUC.execute({
            nombre: 'Hotel Cochabamba Palace',
            direccion: 'Av. América 456',
            estrellas: 4
        });
        
        const hotelId = hotelCreado.getId()!;

        // 2.1 Agregar Habitación Simple
        const datosHabSimple = { numeroHabitacion: 101, precio: 150 };
        agregarSimpleUC.execute(hotelCreado, datosHabSimple);

        // 2.2 Agregar Habitación Doble
        if (typeof HabitacionDoble !== 'undefined') {
            const habitacionDoble = new HabitacionDoble(202, 300);
            hotelCreado.agregarHabitacion(habitacionDoble);
        }

        // 2.3 Obtener Hotel por su ID y validar persistencia e integración de estados
        const hotelRecuperado = obtenerHotelUC.execute(hotelId);

        // Validaciones del Hotel Recuperado
        expect(hotelRecuperado).toBeDefined();
        expect(hotelRecuperado.getId()).toBe(hotelId);
        expect(hotelRecuperado.nombre).toBe('Hotel Cochabamba Palace');
        expect(hotelRecuperado.getDireccion()).toBe('Av. América 456');
        expect(hotelRecuperado.getEstrellas()).toBe(4);

        // Validar que las habitaciones se hayan integrado y guardado en el estado del hotel
        const habitacionesDisponibles = hotelRecuperado.filtrarHabitacionesDisponibles(1, new Date(), new Date());
        expect(habitacionesDisponibles.length).toBeGreaterThanOrEqual(1);
        
        const habitacionData = habitacionesDisponibles[0].toJSON();
        expect(habitacionData.numero).toBe(101);
        expect(habitacionData.precioBase).toBe(150);
    });

    it('debe lanzar una excepción DatabaseNotFoundException si el hotel buscado no existe', () => {
        const hotelRepository = new MemoryHotelRepositoryImpl();
        const obtenerHotelUC = new ObtenerHotelUseCase(hotelRepository);

        // Intentamos obtener un ID inexistente para validar los flujos de error solicitados
        expect(() => {
            obtenerHotelUC.execute('id-fantasma');
        }).toThrow(DatabaseNotFoundException);
    });

    // ¡NUEVO TEST AÑADIDO AQUÍ! Cubre las líneas del repositorio en memoria para forzar la cobertura
    it('debe listar todos los hoteles guardados en el repositorio en memoria', () => {
        const hotelRepository = new MemoryHotelRepositoryImpl();
        const crearHotelUC = new CrearHotelUseCase(hotelRepository);

        // Insertamos un hotel rápido para asegurar que la lista no esté vacía al verificar
        crearHotelUC.execute({
            nombre: 'Hotel Temporal Test',
            direccion: 'Calle Falsa 123',
            estrellas: 3
        });

        const lista = hotelRepository.listHoteles();
        expect(Array.isArray(lista)).toBe(true);
        expect(lista.length).toBeGreaterThan(0);
    });
});