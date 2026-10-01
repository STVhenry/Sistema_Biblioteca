import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Libro } from '../../models/libro.model';
import { LibroService } from '../../services/libro.service';
import { CategoriaLibroService } from '../../services/categoria.service';
import { CategoriaLibro } from '../../models/categoria.model';
import { EditorialService } from '../../services/editorial.service';
import { Editorial } from '../../models/editorial.model';

/**
 * Componente CRUD de Libro contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-libro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './libro.component.html'
})
export class LibroComponent implements OnInit {

  libros: Libro[] = [];
  categorias: CategoriaLibro[] = [];
  editoriales: Editorial[] = [];

  libroActual: Libro = this.libroVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private libroService: LibroService,
    private http: HttpClient,
    private categoriaService: CategoriaLibroService,
    private editorialService: EditorialService
  ) { }

  ngOnInit(): void {
    this.cargarLibros();
    this.categoriaService.listar().subscribe(data => this.categorias = data);
    this.editorialService.listar().subscribe(data => this.editoriales = data);
  }

  libroVacio(): Libro {
    return {
      isbn: '',
      titulo: '',
      anioPublicacion: 0,
      numeroPaginas: 0,
      estado: true,
      categoria: { id: 0 },
      editorial: { id: 0 },
    };
  }

  cargarLibros(): void {
    this.libroService.listar().subscribe(data => this.libros = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.libroActual.id
      ? this.libroService.actualizar(this.libroActual.id, this.libroActual)
      : this.libroService.crear(this.libroActual);

    accion.subscribe({
      next: () => {
        this.cargarLibros();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Libro): void {
    this.libroActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.libroService.eliminar(id).subscribe({
      next: () => this.cargarLibros(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.libroActual = this.libroVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Libros', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['ISBN', 'Título', 'Año']],
      body: this.libros.map(item => [item.isbn, item.titulo, item.anioPublicacion]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('libro.pdf');
  }
}
