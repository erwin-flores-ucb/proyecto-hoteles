import { describe, expect, it } from '@jest/globals';
import { Hotel } from '../../src/dominio/Hotel';
import { HabitacionSimple, HabitacionDoble } from '../../src/dominio/Habitacion';

describe('Hotel Entity - Unit Tests', () => {

  describe('Constructor e inicialización', () => {
    it('debe crear una instancia de Hotel con id proporcionado', () => {
      const hotel = new Hotel('hotel-1', 'Hotel Test', 'Calle 123', 4);
      expect(hotel).toBeInstanceOf(Hotel);
    });

    it('debe crear una instancia de Hotel con id null (genera id automático)', () => {
      const hotel = new Hotel(null, 'Hotel Auto', 'Av. Principal', 5);
      expect(hotel).toBeInstanceOf(Hotel);
      expect(hotel.getId()).not.toBeNull();
    });

    it('debe retornar el id correcto', () => {
      const hotel = new Hotel('mi-id', 'Hotel Test', 'Calle 1', 3);
      expect(hotel.getId()).toBe('mi-id');
    });

    it('debe retornar el nombre correcto', () => {
      const hotel = new Hotel('h1', 'Hotel Paraíso', 'Calle 1', 4);
      expect(hotel.nombre).toBe('Hotel Paraíso');
    });

    it('debe retornar la dirección correcta', () => {
      const hotel = new Hotel('h1', 'Hotel Test', 'Av. Bolivia 123', 3);
      expect(hotel.getDireccion()).toBe('Av. Bolivia 123');
    });

    it('debe retornar las estrellas correctas', () => {
      const hotel = new Hotel('h1', 'Hotel Test', 'Calle 1', 5);
      expect(hotel.getEstrellas()).toBe(5);
    });
  });

  describe('Gestión de habitaciones', () => {
    it('debe iniciar sin habitaciones', () => {
      const hotel = new Hotel('h1', 'Hotel Test', 'Calle 1', 3);
      expect(hotel.getHabitaciones()).toHaveLength(0);
    });

    it('debe agregar una habitación simple correctamente', () => {
      const hotel = new Hotel('h1', 'Hotel Test', 'Calle 1', 3);
      const habitacion = new HabitacionSimple(101, 50);
      hotel.agregarHabitacion(habitacion);
      expect(hotel.getHabitaciones()).toHaveLength(1);
    });

    it('debe agregar una habitación doble correctamente', () => {
      const hotel = new Hotel('h1', 'Hotel Test', 'Calle 1', 3);
      const habitacion = new HabitacionDoble(102, 80);
      hotel.agregarHabitacion(habitacion);
      expect(hotel.getHabitaciones()).toHaveLength(1);
    });

    it('debe agregar múltiples habitaciones', () => {
      const hotel = new Hotel('h1', 'Hotel Test', 'Calle 1', 3);
      hotel.agregarHabitacion(new HabitacionSimple(101, 50));
      hotel.agregarHabitacion(new HabitacionDoble(102, 80));
      expect(hotel.getHabitaciones()).toHaveLength(2);
    });
  });

  describe('filtrarHabitacionesDisponibles', () => {
    it('debe retornar habitaciones disponibles con capacidad suficiente', () => {
      const hotel = new Hotel('h1', 'Hotel Test', 'Calle 1', 3);
      hotel.agregarHabitacion(new HabitacionSimple(101, 50));
      hotel.agregarHabitacion(new HabitacionDoble(102, 80));

      const inicio = new Date('2025-01-01');
      const fin = new Date('2025-01-05');

      const disponibles = hotel.filtrarHabitacionesDisponibles(1, inicio, fin);
      expect(disponibles).toHaveLength(2);
    });

    it('debe filtrar por capacidad mínima', () => {
      const hotel = new Hotel('h1', 'Hotel Test', 'Calle 1', 3);
      hotel.agregarHabitacion(new HabitacionSimple(101, 50));
      hotel.agregarHabitacion(new HabitacionDoble(102, 80));

      const inicio = new Date('2025-01-01');
      const fin = new Date('2025-01-05');

      const disponibles = hotel.filtrarHabitacionesDisponibles(2, inicio, fin);
      expect(disponibles).toHaveLength(1);
    });

    it('debe retornar vacío si no hay habitaciones', () => {
      const hotel = new Hotel('h1', 'Hotel Test', 'Calle 1', 3);
      const inicio = new Date('2025-01-01');
      const fin = new Date('2025-01-05');
      const disponibles = hotel.filtrarHabitacionesDisponibles(1, inicio, fin);
      expect(disponibles).toHaveLength(0);
    });
  });
});