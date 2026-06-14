import { describe, expect, it } from '@jest/globals';
import { Hotel } from '../../src/dominio/Hotel';
import { HabitacionSimple, HabitacionDoble } from '../../src/dominio/Habitacion';

describe('Hotel - constructor e inicialización', () => {
    it('crea una instancia de Hotel con id proporcionado', () => {
        const hotel = new Hotel('hotel-1', 'Hotel UCB', 'Calle 1', 4);
        expect(hotel).toBeInstanceOf(Hotel);
    });

    it('crea una instancia de Hotel con id null (genera id automático)', () => {
        const hotel = new Hotel(null, 'Hotel Auto', 'Calle 2', 3);
        expect(hotel).toBeInstanceOf(Hotel);
        expect(hotel.getId()).not.toBeNull();
        expect(typeof hotel.getId()).toBe('string');
    });

    it('el id generado automáticamente no está vacío', () => {
        const hotel = new Hotel(null, 'Hotel Auto', 'Calle 2', 3);
        expect(hotel.getId()).toBeTruthy();
    });
});

describe('Hotel - getters', () => {
    const hotel = new Hotel('hotel-test', 'Hotel Test', 'Av. Principal 123', 5);

    it('getId retorna el id correcto', () => {
        expect(hotel.getId()).toBe('hotel-test');
    });

    it('nombre retorna el nombre correcto', () => {
        expect(hotel.nombre).toBe('Hotel Test');
    });

    it('getDireccion retorna la dirección correcta', () => {
        expect(hotel.getDireccion()).toBe('Av. Principal 123');
    });

    it('getEstrellas retorna las estrellas correctas', () => {
        expect(hotel.getEstrellas()).toBe(5);
    });
});

describe('Hotel - agregarHabitacion', () => {
    it('agrega una habitación simple correctamente', () => {
        const hotel = new Hotel('hotel-1', 'Hotel UCB', 'Calle 1', 4);
        const habitacion = new HabitacionSimple(101, 100);
        expect(() => hotel.agregarHabitacion(habitacion)).not.toThrow();
    });

    it('agrega una habitación doble correctamente', () => {
        const hotel = new Hotel('hotel-2', 'Hotel UCB 2', 'Calle 2', 3);
        const habitacion = new HabitacionDoble(201, 200);
        expect(() => hotel.agregarHabitacion(habitacion)).not.toThrow();
    });

    it('lanza error si se agrega la misma habitación a dos hoteles distintos', () => {
        const hotel1 = new Hotel('h1', 'Hotel 1', 'Dir 1', 3);
        const hotel2 = new Hotel('h2', 'Hotel 2', 'Dir 2', 4);
        const habitacion = new HabitacionSimple(101, 100);
        hotel1.agregarHabitacion(habitacion);
        expect(() => hotel2.agregarHabitacion(habitacion)).toThrow();
    });
});

describe('Hotel - filtrarHabitacionesDisponibles', () => {
    it('retorna habitaciones disponibles con capacidad suficiente', () => {
        const hotel = new Hotel('hotel-1', 'Hotel UCB', 'Calle 1', 4);
        hotel.agregarHabitacion(new HabitacionSimple(101, 100));
        hotel.agregarHabitacion(new HabitacionDoble(201, 200));
        const disponibles = hotel.filtrarHabitacionesDisponibles(1, new Date('2030-01-01'), new Date('2030-01-05'));
        expect(disponibles.length).toBe(2);
    });

    it('filtra por capacidad mínima requerida', () => {
        const hotel = new Hotel('hotel-2', 'Hotel UCB', 'Calle 1', 4);
        hotel.agregarHabitacion(new HabitacionSimple(101, 100));
        hotel.agregarHabitacion(new HabitacionDoble(201, 200));
        const disponibles = hotel.filtrarHabitacionesDisponibles(2, new Date('2030-02-01'), new Date('2030-02-05'));
        expect(disponibles.length).toBe(1);
    });

    it('retorna array vacío si no hay habitaciones', () => {
        const hotel = new Hotel('hotel-3', 'Hotel UCB', 'Calle 1', 4);
        const disponibles = hotel.filtrarHabitacionesDisponibles(1, new Date('2030-03-01'), new Date('2030-03-05'));
        expect(disponibles.length).toBe(0);
    });
});
