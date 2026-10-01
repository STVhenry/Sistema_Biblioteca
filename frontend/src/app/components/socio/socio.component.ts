import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Socio } from '../../models/socio.model';
import { SocioService } from '../../services/socio.service';

/**
 * Componente CRUD de Socio contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-socio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './socio.component.html'
})
export class SocioComponent implements OnInit {

  socios: Socio[] = [];

  socioActual: Socio = this.socioVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private socioService: SocioService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.cargarSocios();
  }

  socioVacio(): Socio {
    return {
      numeroDocumento: '',
      nombres: '',
      telefono: '',
      email: '',
      direccion: '',
      fechaInscripcion: '',
      estado: true,
    };
  }

  cargarSocios(): void {
    this.socioService.listar().subscribe(data => this.socios = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.socioActual.id
      ? this.socioService.actualizar(this.socioActual.id, this.socioActual)
      : this.socioService.crear(this.socioActual);

    accion.subscribe({
      next: () => {
        this.cargarSocios();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Socio): void {
    this.socioActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.socioService.eliminar(id).subscribe({
      next: () => this.cargarSocios(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.socioActual = this.socioVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Socios', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Documento', 'Nombres', 'Teléfono', 'Email']],
      body: this.socios.map(item => [item.numeroDocumento, item.nombres, item.telefono, item.email]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('socio.pdf');
  }
}
