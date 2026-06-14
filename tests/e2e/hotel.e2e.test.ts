import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { MemoryHotelRepositoryImpl } from '../../src/infraestructura/persistance/hotel.repository.impl';
import { createApp } from '../../src';

const repo = new MemoryHotelRepositoryImpl();
const app = createApp(repo);

describe('Hotel E2E - Habitación Simple', () => {
    it('POST /hotel/:id/habitacion-simple agrega una habitación simple exitosamente', async () => {
        const hotelRes = await request(app).post('/hotel').send({ nombre: 'Hotel Simple Test', direccion: 'Calle 1', estrellas: 4 });
        const id = hotelRes.body.id;
        const res = await request(app).post(`/hotel/${id}/habitacion-simple`).send({ numeroHabitacion: 101, precio: 150 });
        expect(res.status).toBe(200);
    });

    it('la respuesta tiene el mensaje correcto al agregar habitación simple', async () => {
        const hotelRes = await request(app).post('/hotel').send({ nombre: 'Hotel Mensaje', direccion: 'Calle 2', estrellas: 3 });
        const id = hotelRes.body.id;
        const res = await request(app).post(`/hotel/${id}/habitacion-simple`).send({ numeroHabitacion: 102, precio: 120 });
        expect(res.body).toHaveProperty('mensaje');
    });

    it('la habitación simple está disponible en consultas posteriores', async () => {
        const hotelRes = await request(app).post('/hotel').send({ nombre: 'Hotel Consulta', direccion: 'Calle 3', estrellas: 5 });
        const id = hotelRes.body.id;
        await request(app).post(`/hotel/${id}/habitacion-simple`).send({ numeroHabitacion: 103, precio: 180 });
        const getRes = await request(app).get(`/hotel/${id}`);
        expect(getRes.status).toBe(200);
    });

    it('retorna error si el id del hotel no es válido', async () => {
        const res = await request(app).post('/hotel/id!!invalido/habitacion-simple').send({ numeroHabitacion: 104, precio: 100 });
        expect(res.status).toBe(406);
    });
});

describe('Hotel E2E - Habitación Doble', () => {
    it('POST /hotel/:id/habitacion-doble agrega una habitación doble exitosamente', async () => {
        const hotelRes = await request(app).post('/hotel').send({ nombre: 'Hotel Doble E2E', direccion: 'Calle 1', estrellas: 4 });
        const id = hotelRes.body.id;
        const res = await request(app).post(`/hotel/${id}/habitacion-doble`).send({ numeroHabitacion: 201, precio: 300 });
        expect(res.status).toBe(200);
    });

    it('la respuesta tiene estructura correcta al agregar habitación doble', async () => {
        const hotelRes = await request(app).post('/hotel').send({ nombre: 'Hotel Doble Estructura', direccion: 'Calle 2', estrellas: 3 });
        const id = hotelRes.body.id;
        const res = await request(app).post(`/hotel/${id}/habitacion-doble`).send({ numeroHabitacion: 202, precio: 280 });
        expect(res.body).toHaveProperty('mensaje');
    });

    it('la habitación doble está disponible en consultas posteriores', async () => {
        const hotelRes = await request(app).post('/hotel').send({ nombre: 'Hotel Consulta Doble', direccion: 'Calle 3', estrellas: 5 });
        const id = hotelRes.body.id;
        await request(app).post(`/hotel/${id}/habitacion-doble`).send({ numeroHabitacion: 203, precio: 320 });
        const getRes = await request(app).get(`/hotel/${id}`);
        expect(getRes.status).toBe(200);
    });

    it('habitación doble se diferencia de la simple en el hotel', async () => {
        const hotelRes = await request(app).post('/hotel').send({ nombre: 'Hotel Diferencia', direccion: 'Calle 4', estrellas: 4 });
        const id = hotelRes.body.id;
        await request(app).post(`/hotel/${id}/habitacion-simple`).send({ numeroHabitacion: 101, precio: 150 });
        const resDoble = await request(app).post(`/hotel/${id}/habitacion-doble`).send({ numeroHabitacion: 201, precio: 300 });
        expect(resDoble.status).toBe(200);
        const getRes = await request(app).get(`/hotel/${id}`);
        expect(getRes.status).toBe(200);
    });
});
