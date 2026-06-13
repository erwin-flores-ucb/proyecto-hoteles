import { Hotel } from "../../../src/dominio/Hotel";
import { HabitacionSimple } from "../../../src/dominio/Habitacion";

describe("Hotel Entity - Unit Tests", () => {
  
  describe("Constructor e Inicialización", () => {
    it("debe inicializar un hotel con un ID existente si se proporciona", () => {
      const hotel = new Hotel("hotel-123", "Hotel Grand Palace", "Calle Principal 123", 5);
      
      expect(hotel.getId()).toBe("hotel-123");
      expect(hotel.nombre).toBe("Hotel Grand Palace");
      expect(hotel.getDireccion()).toBe("Calle Principal 123");
      expect(hotel.getEstrellas()).toBe(5);
    });

    it("debe autogenerar un ID basado en timestamp si el id es null", () => {
      const hotel = new Hotel(null, "Hotel Sol", "Av. Las Américas", 4);
      
      expect(hotel.getId()).toBeDefined();
      expect(typeof hotel.getId()).toBe("string");
    });
  });

  describe("Gestión de Habitaciones", () => {
    it("debe agregar una habitación al hotel y vincular el hotel en la habitación", () => {
      const hotel = new Hotel("1", "Hotel Central", "Plaza Central", 3);
      const habitacion = new HabitacionSimple(101, 150);

      hotel.agregarHabitacion(habitacion);

      const encontradas = hotel.filtrarHabitacionesDisponibles(1, new Date(), new Date());
      expect(encontradas.length).toBe(1);
      expect(encontradas[0]).toBe(habitacion);
    });
  });

  describe("Validaciones y Reglas de Negocio (Filtros)", () => {
    it("debe filtrar habitaciones disponibles que cumplan con la capacidad", () => {
      const hotel = new Hotel("1", "Hotel Central", "Plaza Central", 3);
      
      const habSimple = new HabitacionSimple(101, 100);
      const habDoble = new HabitacionSimple(102, 200);
      Object.defineProperty(habDoble, 'capacidad', { value: 3 });

      hotel.agregarHabitacion(habSimple);
      hotel.agregarHabitacion(habDoble);

      const resultado = hotel.filtrarHabitacionesDisponibles(2, new Date(), new Date());
      expect(resultado.length).toBe(1);
    });
  });
});