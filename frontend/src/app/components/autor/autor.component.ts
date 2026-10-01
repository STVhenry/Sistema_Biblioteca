import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Autor } from '../../models/autor.model';
import { AutorService } from '../../services/autor.service';

/**
 * Componente CRUD de Autor contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-autor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autor.component.html'
})
export class AutorComponent implements OnInit {

  autors: Autor[] = [];

  autorActual: Autor = this.autorVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private autorService: AutorService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.cargarAutors();
  }

  autorVacio(): Autor {
    return {
      nombres: '',
      apellidos: '',
      nacionalidad: '',
    };
  }

  cargarAutors(): void {
    this.autorService.listar().subscribe(data => this.autors = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.autorActual.id
      ? this.autorService.actualizar(this.autorActual.id, this.autorActual)
      : this.autorService.crear(this.autorActual);

    accion.subscribe({
      next: () => {
        this.cargarAutors();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Autor): void {
    this.autorActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.autorService.eliminar(id).subscribe({
      next: () => this.cargarAutors(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.autorActual = this.autorVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Autores', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Nombres', 'Apellidos', 'Nacionalidad']],
      body: this.autors.map(item => [item.nombres, item.apellidos, item.nacionalidad]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('autor.pdf');
  }
}
