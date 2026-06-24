import { describe, expect, it } from '@jest/globals';
import { Hotel } from '../../src/dominio/Hotel';
import { MemoryHotelRepositoryImpl } from '../../src/infraestructura/persistance/hotel.repository.impl';

describe('2. Tests de Integración - Operaciones del Hotel', () => {

    const mockHabitacionSimple = {
        id: 'hab-101',
        tipo: 'SIMPLE',
        capacidad: 1,
        precio: 100,
        agregarHotel: function(h: any) { return true; }
    };

    const mockHabitacionDoble = {
        id: 'hab-102',
        tipo: 'DOBLE',
        capacidad: 2,
        precio: 180,
        agregarHotel: function(h: any) { return true; }
    };

    it('2.1 y 2.3 Agregar Habitación Simple: Debe persistirse y actualizar el estado recuperado por ID', async () => {
        const repo = new MemoryHotelRepositoryImpl();
        const hotel = new Hotel('hotel-123', 'Hotel Integracion S', 'Direccion S', 3);
        
        repo.crearHotel(hotel);

        (hotel as any).agregarHabitacion(mockHabitacionSimple);

        const hotelRecuperado = repo.obtenerHotel('hotel-123');
        
        expect(hotelRecuperado).toBeDefined();
        expect(hotelRecuperado.nombre).toBe('Hotel Integracion S');
        expect((hotelRecuperado as any).habitaciones).toContainEqual(mockHabitacionSimple);
    });

    it('2.2 Agregar Habitación Doble: Debe validar las características y diferencias de capacidad', async () => {
        const repo = new MemoryHotelRepositoryImpl();
        const hotel = new Hotel('hotel-456', 'Hotel Integracion D', 'Direccion D', 5);
        
        repo.crearHotel(hotel);

        (hotel as any).agregarHabitacion(mockHabitacionDoble);

        const hotelRecuperado = repo.obtenerHotel('hotel-456');
        const listaHabitaciones = (hotelRecuperado as any).habitaciones;
        const habGuardada = listaHabitaciones.find((h: any) => h.id === 'hab-102');

        expect(habGuardada).toBeDefined();
        expect(habGuardada.capacidad).toBe(2);
        expect(habGuardada.tipo).toBe('DOBLE');
    });
});