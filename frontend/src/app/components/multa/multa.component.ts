import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Multa } from '../../models/multa.model';
import { MultaService } from '../../services/multa.service';
import { PrestamoService } from '../../services/prestamo.service';
import { Prestamo } from '../../models/prestamo.model';
import { SocioService } from '../../services/socio.service';
import { Socio } from '../../models/socio.model';

/**
 * Componente CRUD de Multa contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-multa',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multa.component.html'
})
export class MultaComponent implements OnInit {

  multas: Multa[] = [];
  prestamos: Prestamo[] = [];
  socios: Socio[] = [];

  multaActual: Multa = this.multaVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private multaService: MultaService,
    private http: HttpClient,
    private prestamoService: PrestamoService,
    private socioService: SocioService
  ) { }

  ngOnInit(): void {
    this.cargarMultas();
    this.prestamoService.listar().subscribe(data => this.prestamos = data);
    this.socioService.listar().subscribe(data => this.socios = data);
  }

  multaVacio(): Multa {
    return {
      monto: 0,
      motivo: '',
      fechaMulta: '',
      pagada: true,
      prestamo: { id: 0 },
      socio: { id: 0 },
    };
  }

  cargarMultas(): void {
    this.multaService.listar().subscribe(data => this.multas = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.multaActual.id
      ? this.multaService.actualizar(this.multaActual.id, this.multaActual)
      : this.multaService.crear(this.multaActual);

    accion.subscribe({
      next: () => {
        this.cargarMultas();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Multa): void {
    this.multaActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.multaService.eliminar(id).subscribe({
      next: () => this.cargarMultas(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.multaActual = this.multaVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Multas', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Monto', 'Motivo', 'Fecha']],
      body: this.multas.map(item => ['S/ ' + item.monto, item.motivo, item.fechaMulta]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('multa.pdf');
  }
}
