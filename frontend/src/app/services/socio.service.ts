import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Socio } from '../models/socio.model';

/**
 * Servicio Angular que consume la API REST de Socio (JSON).
 * Toda la comunicacion con el backend se hace con HttpClient,
 * sin formularios tradicionales.
 */
@Injectable({
  providedIn: 'root'
})
export class SocioService {

  private apiUrl = 'http://localhost:8080/api/socios';

  constructor(private http: HttpClient) { }

  listar(): Observable<Socio[]> {
    return this.http.get<Socio[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Socio> {
    return this.http.get<Socio>(`${this.apiUrl}/${id}`);
  }

  crear(entidad: Socio): Observable<Socio> {
    return this.http.post<Socio>(this.apiUrl, entidad);
  }

  actualizar(id: number, entidad: Socio): Observable<Socio> {
    return this.http.put<Socio>(`${this.apiUrl}/${id}`, entidad);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
