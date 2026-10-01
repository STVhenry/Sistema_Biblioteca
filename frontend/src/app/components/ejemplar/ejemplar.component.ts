import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Ejemplar } from '../../models/ejemplar.model';
import { EjemplarService } from '../../services/ejemplar.service';
import { LibroService } from '../../services/libro.service';
import { Libro } from '../../models/libro.model';

/**
 * Componente CRUD de Ejemplar contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-ejemplar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ejemplar.component.html'
})
export class EjemplarComponent implements OnInit {

  ejemplars: Ejemplar[] = [];
  libros: Libro[] = [];

  ejemplarActual: Ejemplar = this.ejemplarVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private ejemplarService: EjemplarService,
    private http: HttpClient,
    private libroService: LibroService
  ) { }

  ngOnInit(): void {
    this.cargarEjemplars();
    this.libroService.listar().subscribe(data => this.libros = data);
  }

  ejemplarVacio(): Ejemplar {
    return {
      codigoBarra: '',
      ubicacion: '',
      estado: '',
      libro: { id: 0 },
    };
  }

  cargarEjemplars(): void {
    this.ejemplarService.listar().subscribe(data => this.ejemplars = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.ejemplarActual.id
      ? this.ejemplarService.actualizar(this.ejemplarActual.id, this.ejemplarActual)
      : this.ejemplarService.crear(this.ejemplarActual);

    accion.subscribe({
      next: () => {
        this.cargarEjemplars();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Ejemplar): void {
    this.ejemplarActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.ejemplarService.eliminar(id).subscribe({
      next: () => this.cargarEjemplars(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.ejemplarActual = this.ejemplarVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Ejemplares', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Código', 'Ubicación', 'Estado']],
      body: this.ejemplars.map(item => [item.codigoBarra, item.ubicacion, item.estado]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('ejemplar.pdf');
  }
}
