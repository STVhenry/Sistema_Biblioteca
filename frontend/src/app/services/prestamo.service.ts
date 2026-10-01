import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestamo } from '../models/prestamo.model';

/**
 * Servicio Angular que consume la API REST de Prestamo (JSON).
 * Toda la comunicacion con el backend se hace con HttpClient,
 * sin formularios tradicionales.
 */
@Injectable({
  providedIn: 'root'
})
export class PrestamoService {

  private apiUrl = 'http://localhost:8080/api/prestamos';

  constructor(private http: HttpClient) { }

  listar(): Observable<Prestamo[]> {
    return this.http.get<Prestamo[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Prestamo> {
    return this.http.get<Prestamo>(`${this.apiUrl}/${id}`);
  }

  crear(entidad: Prestamo): Observable<Prestamo> {
    return this.http.post<Prestamo>(this.apiUrl, entidad);
  }

  actualizar(id: number, entidad: Prestamo): Observable<Prestamo> {
    return this.http.put<Prestamo>(`${this.apiUrl}/${id}`, entidad);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
