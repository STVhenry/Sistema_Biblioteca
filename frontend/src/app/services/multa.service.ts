import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Multa } from '../models/multa.model';

/**
 * Servicio Angular que consume la API REST de Multa (JSON).
 * Toda la comunicacion con el backend se hace con HttpClient,
 * sin formularios tradicionales.
 */
@Injectable({
  providedIn: 'root'
})
export class MultaService {

  private apiUrl = 'http://localhost:8080/api/multas';

  constructor(private http: HttpClient) { }

  listar(): Observable<Multa[]> {
    return this.http.get<Multa[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Multa> {
    return this.http.get<Multa>(`${this.apiUrl}/${id}`);
  }

  crear(entidad: Multa): Observable<Multa> {
    return this.http.post<Multa>(this.apiUrl, entidad);
  }

  actualizar(id: number, entidad: Multa): Observable<Multa> {
    return this.http.put<Multa>(`${this.apiUrl}/${id}`, entidad);
  }

  eliminar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
