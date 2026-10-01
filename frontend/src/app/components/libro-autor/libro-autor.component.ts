import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { LibroAutor } from '../../models/libro-autor.model';
import { LibroAutorService } from '../../services/libro-autor.service';
import { LibroService } from '../../services/libro.service';
import { Libro } from '../../models/libro.model';
import { AutorService } from '../../services/autor.service';
import { Autor } from '../../models/autor.model';

/**
 * Componente CRUD de LibroAutor contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-libro-autor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './libro-autor.component.html'
})
export class LibroAutorComponent implements OnInit {

  libroAutors: LibroAutor[] = [];
  libros: Libro[] = [];
  autores: Autor[] = [];

  libroAutorActual: LibroAutor = this.libroAutorVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private libroAutorService: LibroAutorService,
    private http: HttpClient,
    private libroService: LibroService,
    private autorService: AutorService
  ) { }

  ngOnInit(): void {
    this.cargarLibroAutors();
    this.libroService.listar().subscribe(data => this.libros = data);
    this.autorService.listar().subscribe(data => this.autores = data);
  }

  libroAutorVacio(): LibroAutor {
    return {
      libro: { id: 0 },
      autor: { id: 0 },
    };
  }

  cargarLibroAutors(): void {
    this.libroAutorService.listar().subscribe(data => this.libroAutors = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.libroAutorActual.id
      ? this.libroAutorService.actualizar(this.libroAutorActual.id, this.libroAutorActual)
      : this.libroAutorService.crear(this.libroAutorActual);

    accion.subscribe({
      next: () => {
        this.cargarLibroAutors();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: LibroAutor): void {
    this.libroAutorActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.libroAutorService.eliminar(id).subscribe({
      next: () => this.cargarLibroAutors(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.libroAutorActual = this.libroAutorVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Autores por Libro', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['ID', 'Libro (ID)', 'Autor (ID)']],
      body: this.libroAutors.map(item => [item.id, item.libro?.id, item.autor?.id]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('libro-autor.pdf');
  }
}
