import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Prestamo } from '../../models/prestamo.model';
import { PrestamoService } from '../../services/prestamo.service';
import { SocioService } from '../../services/socio.service';
import { Socio } from '../../models/socio.model';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

/**
 * Componente CRUD de Prestamo contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-prestamo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prestamo.component.html'
})
export class PrestamoComponent implements OnInit {

  prestamos: Prestamo[] = [];
  socios: Socio[] = [];
  usuarios: Usuario[] = [];

  prestamoActual: Prestamo = this.prestamoVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private prestamoService: PrestamoService,
    private http: HttpClient,
    private socioService: SocioService,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.cargarPrestamos();
    this.socioService.listar().subscribe(data => this.socios = data);
    this.usuarioService.listar().subscribe(data => this.usuarios = data);
  }

  prestamoVacio(): Prestamo {
    return {
      fechaPrestamo: '',
      fechaLimite: '',
      estado: '',
      socio: { id: 0 },
      usuario: { id: 0 },
    };
  }

  cargarPrestamos(): void {
    this.prestamoService.listar().subscribe(data => this.prestamos = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.prestamoActual.id
      ? this.prestamoService.actualizar(this.prestamoActual.id, this.prestamoActual)
      : this.prestamoService.crear(this.prestamoActual);

    accion.subscribe({
      next: () => {
        this.cargarPrestamos();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Prestamo): void {
    this.prestamoActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.prestamoService.eliminar(id).subscribe({
      next: () => this.cargarPrestamos(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.prestamoActual = this.prestamoVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Préstamos', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Fecha préstamo', 'Fecha límite', 'Estado']],
      body: this.prestamos.map(item => [item.fechaPrestamo, item.fechaLimite, item.estado]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('prestamo.pdf');
  }

  marcarDevuelto(item: Prestamo): void {
    if (!item.id) return;
    if (!confirm('¿Registrar la devolución de este préstamo? Si está vencido, se generará una multa automáticamente.')) return;
    this.http.patch(`http://localhost:8080/api/prestamos/${item.id}/devolucion`, {}).subscribe({
      next: () => this.cargarPrestamos(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo registrar la devolución.';
      }
    });
  }
}
