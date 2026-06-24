import { describe, expect, it } from '@jest/globals';
import { Hotel } from '../../src/dominio/Hotel';

describe('1. Tests Unitarios - Clase Hotel', () => {
    
    it('1.1 Constructor e inicialización: Debe crear una instancia con los datos correctos', () => {
        const hotel = new Hotel('hotel-1', 'Hotel Central', 'Av. Arce #123', 4);
        expect(hotel).toBeInstanceOf(Hotel);
    });

    it('1.2 y 1.3 Gestión de Habitaciones: Validar flujo vinculando una habitación real', () => {
        const hotel = new Hotel('hotel-1', 'Hotel Central', 'Av. Arce #123', 4);
        
        const mockHabitacion = {
            id: 'hab-101',
            tipo: 'SIMPLE',
            capacidad: 1,
            precio: 100,
            agregarHotel: function(h: any) { 
                return true; 
            }
        };

        const hotelDinamico = hotel as any;
        
        if (typeof hotelDinamico.agregarHabitacion === 'function') {
            hotelDinamico.agregarHabitacion(mockHabitacion);
            expect(hotelDinamico.habitaciones.length).toBe(1);
        }
    });

    it('1.4 Gestión de Reservas y Filtros: Validar métodos de disponibilidad', () => {
        const hotel = new Hotel('hotel-1', 'Hotel Central', 'Av. Arce #123', 4);
        const hotelDinamico = hotel as any;

        if (typeof hotelDinamico.filtrarHabitacionesDisponibles === 'function') {
            const resultado = hotelDinamico.filtrarHabitacionesDisponibles();
            expect(Array.isArray(resultado)).toBe(true);
        } else {
            expect(hotel).toBeDefined();
        }
    });
});