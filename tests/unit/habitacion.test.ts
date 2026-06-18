import { describe, expect, it } from '@jest/globals';
import { HabitacionSimple, HabitacionDoble, HabitacionSuite, HabitacionFamiliar } from '../../src/dominio/Habitacion';
import { Hotel } from '../../src/dominio/Hotel';
import { Cliente } from '../../src/dominio/Cliente';

describe('Habitacion - Unit Tests', () => {

  describe('HabitacionSimple', () => {
    it('debe crear una habitacion simple con capacidad 1', () => {
      const h = new HabitacionSimple(101, 50);
      expect(h.capacidad).toBe(1);
      expect(h.numero).toBe(101);
      expect(h.precioBase).toBe(50);
    });

    it('debe estar disponible si no tiene reservas', () => {
      const h = new HabitacionSimple(101, 50);
      expect(h.disponible(new Date('2025-01-01'), new Date('2025-01-05'))).toBe(true);
    });
  });

  describe('HabitacionDoble', () => {
    it('debe crear una habitacion doble con capacidad 2', () => {
      const h = new HabitacionDoble(201, 80);
      expect(h.capacidad).toBe(2);
    });
  });

  describe('HabitacionSuite', () => {
    it('debe crear una suite con capacidad 4', () => {
      const h = new HabitacionSuite(301, 200, true, true);
      expect(h.capacidad).toBe(4);
    });
  });

  describe('HabitacionFamiliar', () => {
    it('debe crear una habitacion familiar con capacidad correcta', () => {
      const h = new HabitacionFamiliar(401, 120, 2);
      expect(h.capacidad).toBe(4);
    });
  });

  describe('agregarHotel', () => {
    it('debe lanzar error si se agrega a dos hoteles', () => {
      const h = new HabitacionSimple(101, 50);
      const hotel1 = new Hotel('h1', 'Hotel 1', 'Calle 1', 3);
      const hotel2 = new Hotel('h2', 'Hotel 2', 'Calle 2', 4);
      hotel1.agregarHabitacion(h);
      expect(() => hotel2.agregarHabitacion(h)).toThrow();
    });
  });

  describe('toJSON', () => {
    it('debe serializar correctamente', () => {
      const h = new HabitacionSimple(101, 50);
      const json = h.toJSON();
      expect(json.numero).toBe(101);
      expect(json.precioBase).toBe(50);
      expect(json.capacidad).toBe(1);
    });
  });
});