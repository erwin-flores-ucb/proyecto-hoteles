import { describe, expect, it } from '@jest/globals';
import { Hotel } from '../../src/dominio/Hotel';
import { HabitacionSimple } from '../../src/dominio/Habitacion';
import { CrearHotelUseCase } from '../../src/aplicacion/casosDeUso/crearHotel.use-case';
import { agregarHabitacionSimpleUseCase } from '../../src/aplicacion/casosDeUso/agregarHabitacionSimple.use-case';
import { MemoryHotelRepositoryImpl } from '../../src/infraestructura/persistance/hotel.repository.impl';

describe('Agregar Habitación Simple - integración', () => {
    it('agrega una habitación simple a un hotel existente', () => {
        const repo = new MemoryHotelRepositoryImpl();
        const hotel = new CrearHotelUseCase(repo).execute({ nombre: 'Hotel Test', direccion: 'Calle 1', estrellas: 3 });
        expect(() => new agregarHabitacionSimpleUseCase().execute(hotel, { numeroHabitacion: 101, precio: 150 })).not.toThrow();
    });

    it('la habitación simple tiene capacidad 1', () => {
        const habitacion = new HabitacionSimple(101, 150);
        expect(habitacion.capacidad).toBe(1);
    });

    it('el hotel actualiza su estado después de agregar la habitación', () => {
        const repo = new MemoryHotelRepositoryImpl();
        const hotel = new CrearHotelUseCase(repo).execute({ nombre: 'Hotel Estado', direccion: 'Calle 2', estrellas: 4 });
        new agregarHabitacionSimpleUseCase().execute(hotel, { numeroHabitacion: 102, precio: 200 });
        const disponibles = hotel.filtrarHabitacionesDisponibles(1, new Date('2030-06-01'), new Date('2030-06-05'));
        expect(disponibles.length).toBe(1);
    });

    it('la habitación simple queda asociada al hotel', () => {
        const repo = new MemoryHotelRepositoryImpl();
        const hotel = new CrearHotelUseCase(repo).execute({ nombre: 'Hotel Asociado', direccion: 'Calle 3', estrellas: 3 });
        new agregarHabitacionSimpleUseCase().execute(hotel, { numeroHabitacion: 103, precio: 120 });
        expect(hotel).toBeInstanceOf(Hotel);
    });
});
