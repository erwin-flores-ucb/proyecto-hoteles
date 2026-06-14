import { describe, expect, it } from '@jest/globals';
import { Hotel } from '../../src/dominio/Hotel';
import { CrearHotelUseCase } from '../../src/aplicacion/casosDeUso/crearHotel.use-case';
import { ObtenerHotelUseCase } from '../../src/aplicacion/casosDeUso/obtenerHotel.use-case';
import { agregarHabitacionSimpleUseCase } from '../../src/aplicacion/casosDeUso/agregarHabitacionSimple.use-case';
import { agregarHabitacionDobleUseCase } from '../../src/aplicacion/casosDeUso/agregarHabitacionDoble.use-case';
import { MemoryHotelRepositoryImpl } from '../../src/infraestructura/persistance/hotel.repository.impl';

describe('Obtener Hotel - integración', () => {
    it('recupera un hotel existente por su ID', () => {
        const repo = new MemoryHotelRepositoryImpl();
        const hotelCreado = new CrearHotelUseCase(repo).execute({ nombre: 'Hotel Recuperado', direccion: 'Calle 1', estrellas: 4 });
        const id = hotelCreado.getId() as string;
        expect(new ObtenerHotelUseCase(repo).execute(id)).toBeInstanceOf(Hotel);
    });

    it('los datos del hotel recuperado son correctos', () => {
        const repo = new MemoryHotelRepositoryImpl();
        const hotelCreado = new CrearHotelUseCase(repo).execute({ nombre: 'Hotel Datos', direccion: 'Av. Correcta 123', estrellas: 5 });
        const id = hotelCreado.getId() as string;
        const hotelObtenido = new ObtenerHotelUseCase(repo).execute(id);
        expect(hotelObtenido.nombre).toBe('Hotel Datos');
        expect(hotelObtenido.getDireccion()).toBe('Av. Correcta 123');
        expect(hotelObtenido.getEstrellas()).toBe(5);
    });

    it('lanza error si el hotel no existe', () => {
        const repo = new MemoryHotelRepositoryImpl();
        expect(() => new ObtenerHotelUseCase(repo).execute('id-inexistente')).toThrow();
    });

    it('recupera el hotel con sus habitaciones asociadas', () => {
        const repo = new MemoryHotelRepositoryImpl();
        const hotelCreado = new CrearHotelUseCase(repo).execute({ nombre: 'Hotel Habitaciones', direccion: 'Calle 5', estrellas: 3 });
        new agregarHabitacionSimpleUseCase().execute(hotelCreado, { numeroHabitacion: 101, precio: 100 });
        new agregarHabitacionDobleUseCase().execute(hotelCreado, { numeroHabitacion: 201, precio: 200 });
        const id = hotelCreado.getId() as string;
        const hotelObtenido = new ObtenerHotelUseCase(repo).execute(id);
        const habitaciones = hotelObtenido.filtrarHabitacionesDisponibles(1, new Date('2030-08-01'), new Date('2030-08-05'));
        expect(habitaciones.length).toBe(2);
    });
});
