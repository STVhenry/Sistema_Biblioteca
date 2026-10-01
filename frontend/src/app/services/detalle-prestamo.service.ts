import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DetallePrestamo } from '../models/detalle-prestamo.model';

/**
 * Servicio Angular que consume la API REST de DetallePrestamo (JSON).
 * Toda la comunicacion con el backend se hace con HttpClient,
 * sin formularios tradicionales.
 */
@Injectable({
  providedIn: 'root'
})
export class DetallePrestamoService {

  private apiUrl = 'http://localhost:8080/api/detalle-prestamos';

  constructor(private http: HttpClient) { }

  listar(): Observable<DetallePrestamo[]> {
    return this.http.get<DetallePrestamo[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<DetallePrestamo> {
    return this.http.get<DetallePrestamo>(`${this.apiUrl}/${id}`);
  }

  crear(entidad: DetallePrestamo): Observable<DetallePrestamo> {
    return this.http.post<DetallePrestamo>(this.apiUrl, entidad);
  }

  actualizar(id: number, entidad: DetallePrestamo): Observable<DetallePrestamo> {
    return this.http.put<DetallePrestamo>(`${this.apiUrl}/${id}`, entidad);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
