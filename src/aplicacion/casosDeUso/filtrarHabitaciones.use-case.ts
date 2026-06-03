import { Hotel } from "../../dominio/Hotel";
import { Habitacion } from "../../dominio/Habitacion";

export interface FiltrarHabitacionesQuery {
    capacidad: number;
    fechaInicio: string; 
    fechaFin: string;    
}

export class FiltrarHabitacionesUseCase {
    execute(hotel: Hotel, query: FiltrarHabitacionesQuery): Habitacion[] {
        const inicio = new Date(query.fechaInicio);
        const fin = new Date(query.fechaFin);

        return hotel.filtrarHabitacionesDisponibles(query.capacidad, inicio, fin);
    }
}