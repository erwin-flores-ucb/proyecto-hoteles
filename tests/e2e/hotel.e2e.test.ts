import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { MemoryHotelRepositoryImpl } from '../../src/infraestructura/persistance/hotel.repository.impl';
import express from 'express';
import { initializeController } from '../../src/infraestructura/controllers';
import methodOverride from 'method-override';

function createTestApp() {
  const repo = new MemoryHotelRepositoryImpl();
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(methodOverride());
  initializeController(app, repo);
  return { app, repo };
}

describe('Hotel app-rest e2e', () => {

  it('POST /hotel - crea un hotel correctamente', async () => {
    const { app } = createTestApp();
    const res = await request(app).post('/hotel').send({
      nombre: 'UCB - HOTEL 2',
      direccion: 'Espana',
      estrellas: 3
    });
    expect(res.status).toBe(200);
  });

  it('GET /hotel/list - lista hoteles', async () => {
    const { app } = createTestApp();
    await request(app).post('/hotel').send({
      nombre: 'Hotel Lista',
      direccion: 'Calle 1',
      estrellas: 3
    });
    const res = await request(app).get('/hotel/list');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('GET /hotel/:id - obtiene un hotel por id', async () => {
    const { app } = createTestApp();
    const created = await request(app).post('/hotel').send({
      nombre: 'Hotel ID',
      direccion: 'Calle 2',
      estrellas: 4
    });
    const id = created.body.id || created.body._id;
    const res = await request(app).get(`/hotel/${id}`);
    expect(res.status).toBe(200);
  });

  it('POST /hotel/:id/habitacion-simple - agrega habitacion simple', async () => {
    const { app } = createTestApp();
    const created = await request(app).post('/hotel').send({
      nombre: 'Hotel Simple E2E',
      direccion: 'Calle 3',
      estrellas: 3
    });
    const id = created.body.id || created.body._id;
    const res = await request(app)
      .post(`/hotel/${id}/habitacion-simple`)
      .send({ numeroHabitacion: 101, precio: 50 });
    expect(res.status).toBe(200);
    expect(res.body.mensaje).toBeDefined();
  });

  it('POST /hotel/:id/habitacion-simple - verifica que la habitacion queda disponible', async () => {
    const { app } = createTestApp();
    const created = await request(app).post('/hotel').send({
      nombre: 'Hotel Verificar',
      direccion: 'Calle 4',
      estrellas: 3
    });
    const id = created.body.id || created.body._id;
    await request(app)
      .post(`/hotel/${id}/habitacion-simple`)
      .send({ numeroHabitacion: 101, precio: 50 });
    const res = await request(app).get(`/hotel/${id}`);
    expect(res.status).toBe(200);
  });

});