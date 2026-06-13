import { HabitacionSimple, HabitacionDoble, HabitacionSuite, HabitacionFamiliar } from "../../src/dominio/Habitacion";
import { Cliente } from "../../src/dominio/Cliente";
import { Hotel } from "../../src/dominio/Hotel";
import { Reserva } from "../../src/dominio/Reserva"; // O "../../src/dominio/Recerva" según tu import real

describe("Pruebas Unitarias - Reserva y Habitaciones", () => {
  let cliente: Cliente;
  let habitacionSimple: HabitacionSimple;
  let fechaE: Date;
  let fechaS: Date;

  beforeEach(() => {
    cliente = new Cliente("123", "Omar Torrez", "omar@gmail.com", "77777777");
    habitacionSimple = new HabitacionSimple(101, 150);
    fechaE = new Date("2026-06-15");
    fechaS = new Date("2026-06-20");
  });

  // ==========================================
  // 1. PRUEBAS PARA RESERVA (Cubre líneas 5-30)
  // ==========================================
  describe("Clase Reserva", () => {
    test("Debe crear una reserva correctamente con estado pendiente", () => {
      const reserva = new Reserva(cliente, habitacionSimple, fechaE, fechaS);
      expect(reserva.fechaEntrada).toEqual(fechaE);
      expect(reserva.fechaSalida).toEqual(fechaS);
      expect(reserva.estaActivo()).toBe(true);
    });

    test("Debe cambiar el estado a cancelada y no estar activa", () => {
      const reserva = new Reserva(cliente, habitacionSimple, fechaE, fechaS);
      reserva.cancelarReserva();
      expect(reserva.estaActivo()).toBe(false);
    });

    test("Debe cambiar el estado a finalizada y no estar activa", () => {
      const reserva = new Reserva(cliente, habitacionSimple, fechaE, fechaS);
      reserva.finalizarReserva();
      expect(reserva.estaActivo()).toBe(false);
    });
  });

  // ==========================================
  // 2. PRUEBAS PARA HABITACIÓN (Cubre líneas 73-94)
  // ==========================================
  describe("Clase Habitacion y sus Subclases", () => {
    test("Debe lanzar error si se intenta agregar la habitación a más de un hotel", () => {
      const hotel1 = new Hotel("H1", "Hotel Sucre", "Calle Principal 123", 5);
      const hotel2 = new Hotel("H2", "Hotel La Plata", "Calle Segunda 456", 4);
      
      habitacionSimple.agregarHotel(hotel1);
      
      expect(() => {
        habitacionSimple.agregarHotel(hotel2);
      }).toThrowError(/ya pertenece al hotel/);
    });

    test("Debe lanzar error si se intenta reservar en fechas no disponibles", () => {
      habitacionSimple.reservar(cliente, fechaE, fechaS);
      
      // Intentar reservar en un rango que choca con la reserva anterior
      expect(() => {
        habitacionSimple.reservar(cliente, new Date("2026-06-16"), new Date("2026-06-18"));
      }).toThrowError(/no está disponible/);
    });

    test("Debe serializar a JSON correctamente omitiendo la referencia circular del hotel", () => {
      const hotel = new Hotel("H1", "Hotel Imperial", "Av. Central", 4);
      habitacionSimple.agregarHotel(hotel);
      
      const json = habitacionSimple.toJSON();
      expect(json).toHaveProperty("numero", 101);
      expect(json).toHaveProperty("precioBase", 150);
      expect(json).toHaveProperty("capacidad", 1);
      expect(json).not.toHaveProperty("_hotel"); // Valida que no haya referencia circular
    });

    test("Debe inicializar correctamente las subclases HabitacionDoble, Suite y Familiar", () => {
      const doble = new HabitacionDoble(201, 250);
      const suite = new HabitacionSuite(301, 500, true, true);
      const familiar = new HabitacionFamiliar(401, 350, 2);

      expect(doble.capacidad).toBe(2);
      expect(suite.capacidad).toBe(4);
      expect(familiar.capacidad).toBe(4); // 2 base + 2 camas extras
    });
  });
});