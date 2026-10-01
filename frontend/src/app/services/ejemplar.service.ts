import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Ejemplar } from '../models/ejemplar.model';

/**
 * Servicio Angular que consume la API REST de Ejemplar (JSON).
 * Toda la comunicacion con el backend se hace con HttpClient,
 * sin formularios tradicionales.
 */
@Injectable({
  providedIn: 'root'
})
export class EjemplarService {

  private apiUrl = 'http://localhost:8080/api/ejemplares';

  constructor(private http: HttpClient) { }

  listar(): Observable<Ejemplar[]> {
    return this.http.get<Ejemplar[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Ejemplar> {
    return this.http.get<Ejemplar>(`${this.apiUrl}/${id}`);
  }

  crear(entidad: Ejemplar): Observable<Ejemplar> {
    return this.http.post<Ejemplar>(this.apiUrl, entidad);
  }

  actualizar(id: number, entidad: Ejemplar): Observable<Ejemplar> {
    return this.http.put<Ejemplar>(`${this.apiUrl}/${id}`, entidad);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
