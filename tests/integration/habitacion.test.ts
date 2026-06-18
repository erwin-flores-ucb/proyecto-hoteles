import { describe, expect, it } from '@jest/globals';
import { CrearHotelUseCase } from '../../src/aplicacion/casosDeUso/crearHotel.use-case';
import { agregarHabitacionSimpleUseCase } from '../../src/aplicacion/casosDeUso/agregarHabitacionSimple.use-case';
import { agregarHabitacionDobleUseCase } from '../../src/aplicacion/casosDeUso/agregarHabitacionDoble.use-case';
import { ObtenerHotelUseCase } from '../../src/aplicacion/casosDeUso/obtenerHotel.use-case';
import { MemoryHotelRepositoryImpl } from '../../src/infraestructura/persistance/hotel.repository.impl';
import { HabitacionSimple, HabitacionDoble } from '../../src/dominio/Habitacion';

describe('Agregar habitaciones - Integration Tests', () => {

  describe('2.1 Agregar Habitación Simple', () => {
    it('debe agregar una habitación simple a un hotel existente', async () => {
      const repo = new MemoryHotelRepositoryImpl();
      const crearHotel = new CrearHotelUseCase(repo);
      const agregarSimple = new agregarHabitacionSimpleUseCase();

      const hotel = await crearHotel.execute({
        nombre: 'Hotel Simple',
        direccion: 'Calle 1',
        estrellas: 3
      });

      agregarSimple.execute(hotel, { numeroHabitacion: 101, precio: 50 });

      expect(hotel.getHabitaciones()).toHaveLength(1);
    });

    it('la habitación simple debe tener capacidad 1', async () => {
      const repo = new MemoryHotelRepositoryImpl();
      const crearHotel = new CrearHotelUseCase(repo);
      const agregarSimple = new agregarHabitacionSimpleUseCase();

      const hotel = await crearHotel.execute({
        nombre: 'Hotel Simple',
        direccion: 'Calle 1',
        estrellas: 3
      });

      agregarSimple.execute(hotel, { numeroHabitacion: 101, precio: 50 });

      const habitacion = hotel.getHabitaciones()[0];
      expect(habitacion.capacidad).toBe(1);
      expect(habitacion).toBeInstanceOf(HabitacionSimple);
    });

    it('debe persistir la habitación simple en el repositorio', async () => {
      const repo = new MemoryHotelRepositoryImpl();
      const crearHotel = new CrearHotelUseCase(repo);
      const agregarSimple = new agregarHabitacionSimpleUseCase();
      const obtenerHotel = new ObtenerHotelUseCase(repo);

      const hotel = await crearHotel.execute({
        nombre: 'Hotel Simple',
        direccion: 'Calle 1',
        estrellas: 3
      });

      agregarSimple.execute(hotel, { numeroHabitacion: 101, precio: 50 });

      const hotelRecuperado = await obtenerHotel.execute(hotel.getId()!);
      expect(hotelRecuperado.getHabitaciones()).toHaveLength(1);
    });
  });

  describe('2.2 Agregar Habitación Doble', () => {
    it('debe agregar una habitación doble a un hotel existente', async () => {
      const repo = new MemoryHotelRepositoryImpl();
      const crearHotel = new CrearHotelUseCase(repo);
      const agregarDoble = new agregarHabitacionDobleUseCase();

      const hotel = await crearHotel.execute({
        nombre: 'Hotel Doble',
        direccion: 'Calle 2',
        estrellas: 4
      });

      agregarDoble.execute(hotel, { numeroHabitacion: 201, precio: 80 });

      expect(hotel.getHabitaciones()).toHaveLength(1);
    });

    it('la habitación doble debe tener capacidad 2', async () => {
      const repo = new MemoryHotelRepositoryImpl();
      const crearHotel = new CrearHotelUseCase(repo);
      const agregarDoble = new agregarHabitacionDobleUseCase();

      const hotel = await crearHotel.execute({
        nombre: 'Hotel Doble',
        direccion: 'Calle 2',
        estrellas: 4
      });

      agregarDoble.execute(hotel, { numeroHabitacion: 201, precio: 80 });

      const habitacion = hotel.getHabitaciones()[0];
      expect(habitacion.capacidad).toBe(2);
      expect(habitacion).toBeInstanceOf(HabitacionDoble);
    });

    it('debe persistir la habitación doble en el repositorio', async () => {
      const repo = new MemoryHotelRepositoryImpl();
      const crearHotel = new CrearHotelUseCase(repo);
      const agregarDoble = new agregarHabitacionDobleUseCase();
      const obtenerHotel = new ObtenerHotelUseCase(repo);

      const hotel = await crearHotel.execute({
        nombre: 'Hotel Doble',
        direccion: 'Calle 2',
        estrellas: 4
      });

      agregarDoble.execute(hotel, { numeroHabitacion: 201, precio: 80 });

      const hotelRecuperado = await obtenerHotel.execute(hotel.getId()!);
      expect(hotelRecuperado.getHabitaciones()).toHaveLength(1);
    });
  });

  describe('2.3 Obtener Hotel', () => {
    it('debe recuperar un hotel existente por su ID', async () => {
      const repo = new MemoryHotelRepositoryImpl();
      const crearHotel = new CrearHotelUseCase(repo);
      const obtenerHotel = new ObtenerHotelUseCase(repo);

      const hotel = await crearHotel.execute({
        nombre: 'Hotel Recuperado',
        direccion: 'Av. Central',
        estrellas: 5
      });

      const hotelRecuperado = await obtenerHotel.execute(hotel.getId()!);
      expect(hotelRecuperado.nombre).toBe('Hotel Recuperado');
      expect(hotelRecuperado.getDireccion()).toBe('Av. Central');
      expect(hotelRecuperado.getEstrellas()).toBe(5);
    });

    it('debe recuperar el hotel con todas sus habitaciones', async () => {
      const repo = new MemoryHotelRepositoryImpl();
      const crearHotel = new CrearHotelUseCase(repo);
      const agregarSimple = new agregarHabitacionSimpleUseCase();
      const agregarDoble = new agregarHabitacionDobleUseCase();
      const obtenerHotel = new ObtenerHotelUseCase(repo);

      const hotel = await crearHotel.execute({
        nombre: 'Hotel Completo',
        direccion: 'Av. Central',
        estrellas: 4
      });

      agregarSimple.execute(hotel, { numeroHabitacion: 101, precio: 50 });
      agregarDoble.execute(hotel, { numeroHabitacion: 201, precio: 80 });

      const hotelRecuperado = await obtenerHotel.execute(hotel.getId()!);
      expect(hotelRecuperado.getHabitaciones()).toHaveLength(2);
    });

    it('debe lanzar error si el hotel no existe', async () => {
      const repo = new MemoryHotelRepositoryImpl();
      const obtenerHotel = new ObtenerHotelUseCase(repo);

      expect(() => obtenerHotel.execute('id-inexistente')).toThrow('Hotel no encontrado');
    });
  });
});