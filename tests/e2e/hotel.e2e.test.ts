import { describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { MemoryHotelRepositoryImpl } from '../../src/infraestructura/persistance/hotel.repository.impl';
import { createApp } from '../../src';

const repo = new MemoryHotelRepositoryImpl();

describe('3. Tests End-to-End (E2E) - API Rest', () => {
    const app = createApp(repo);

    it('3.1 Agregar Habitación Simple (E2E): Flujo de creación exitoso vía HTTP', async () => {
        const res = await request(app)
            .post('/hotel')
            .send({
                "nombre": "Hotel E2E Simple",
                "direccion": "España",
                "estrellas": 3,
                "habitacion": {
                    "id": "hab-s",
                    "tipo": "SIMPLE",
                    "capacidad": 1,
                    "precio": 100
                }
            });
        
        expect(res.status).toBe(200);
    });

    it('3.2 Agregar Habitación Doble (E2E): Flujo de creación de habitación doble diferenciada', async () => {
        const res = await request(app)
            .post('/hotel')
            .send({
                "nombre": "Hotel E2E Doble",
                "direccion": "América",
                "estrellas": 5,
                "habitacion": {
                    "id": "hab-d",
                    "tipo": "DOBLE",
                    "capacidad": 2,
                    "precio": 200
                }
            });
        
        expect(res.status).toBe(200);
    });
});