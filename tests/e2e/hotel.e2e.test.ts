
import {describe, expect, it} from '@jest/globals';
import { Hotel } from '../../src/dominio/Hotel';
import request from 'supertest';
import { MemoryHotelRepositoryImpl } from '../../src/infraestructura/persistance/hotel.repository.impl';
import { createApp } from '../../src';
const repo = new MemoryHotelRepositoryImpl();

describe('Hotel app-rest e2e', () => {
    const app = createApp(repo);

    it('Create hotel or errors /hotel', async () => {
        
        const res = await request(app).post('/hotel').send({
            "nombre": "UCB - HOTEL 2",
            "direccion": "España",
            "estrellas": 3
        });
        
        expect(res.status).toBe(200);
        // test de error
    });
});