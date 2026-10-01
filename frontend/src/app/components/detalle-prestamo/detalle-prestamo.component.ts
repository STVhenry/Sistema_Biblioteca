import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DetallePrestamo } from '../../models/detalle-prestamo.model';
import { DetallePrestamoService } from '../../services/detalle-prestamo.service';
import { PrestamoService } from '../../services/prestamo.service';
import { Prestamo } from '../../models/prestamo.model';
import { EjemplarService } from '../../services/ejemplar.service';
import { Ejemplar } from '../../models/ejemplar.model';

/**
 * Componente CRUD de DetallePrestamo contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-detalle-prestamo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalle-prestamo.component.html'
})
export class DetallePrestamoComponent implements OnInit {

  detallePrestamos: DetallePrestamo[] = [];
  prestamos: Prestamo[] = [];
  ejemplares: Ejemplar[] = [];

  detallePrestamoActual: DetallePrestamo = this.detallePrestamoVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private detallePrestamoService: DetallePrestamoService,
    private http: HttpClient,
    private prestamoService: PrestamoService,
    private ejemplarService: EjemplarService
  ) { }

  ngOnInit(): void {
    this.cargarDetallePrestamos();
    this.prestamoService.listar().subscribe(data => this.prestamos = data);
    this.ejemplarService.listar().subscribe(data => this.ejemplares = data);
  }

  detallePrestamoVacio(): DetallePrestamo {
    return {
      fechaDevolucion: '',
      estado: '',
      prestamo: { id: 0 },
      ejemplar: { id: 0 },
    };
  }

  cargarDetallePrestamos(): void {
    this.detallePrestamoService.listar().subscribe(data => this.detallePrestamos = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.detallePrestamoActual.id
      ? this.detallePrestamoService.actualizar(this.detallePrestamoActual.id, this.detallePrestamoActual)
      : this.detallePrestamoService.crear(this.detallePrestamoActual);

    accion.subscribe({
      next: () => {
        this.cargarDetallePrestamos();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: DetallePrestamo): void {
    this.detallePrestamoActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.detallePrestamoService.eliminar(id).subscribe({
      next: () => this.cargarDetallePrestamos(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.detallePrestamoActual = this.detallePrestamoVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Detalle de Préstamos', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['ID', 'Fecha devolución', 'Estado']],
      body: this.detallePrestamos.map(item => [item.id, item.fechaDevolucion, item.estado]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('detalle-prestamo.pdf');
  }
}
