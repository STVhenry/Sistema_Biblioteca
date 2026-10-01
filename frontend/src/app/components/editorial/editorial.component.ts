import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Editorial } from '../../models/editorial.model';
import { EditorialService } from '../../services/editorial.service';

/**
 * Componente CRUD de Editorial contra la API REST (JSON), sin formularios
 * tradicionales HTML — todo por HttpClient. Incluye exportacion a PDF
 * del listado actual (jsPDF + jspdf-autotable).
 */
@Component({
  selector: 'app-editorial',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editorial.component.html'
})
export class EditorialComponent implements OnInit {

  editorials: Editorial[] = [];

  editorialActual: Editorial = this.editorialVacio();
  editando = false;
  mensajeError = '';

  constructor(
    private editorialService: EditorialService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.cargarEditorials();
  }

  editorialVacio(): Editorial {
    return {
      nombre: '',
      pais: '',
      telefono: '',
    };
  }

  cargarEditorials(): void {
    this.editorialService.listar().subscribe(data => this.editorials = data);
  }

  guardar(): void {
    this.mensajeError = '';

    const accion = this.editando && this.editorialActual.id
      ? this.editorialService.actualizar(this.editorialActual.id, this.editorialActual)
      : this.editorialService.crear(this.editorialActual);

    accion.subscribe({
      next: () => {
        this.cargarEditorials();
        this.cancelar();
      },
      error: (err) => {
        this.mensajeError = err?.error?.error || err?.error?.mensaje || 'No se pudo guardar el registro.';
      }
    });
  }

  editar(item: Editorial): void {
    this.editorialActual = { ...item };
    this.editando = true;
  }

  eliminar(id: number | undefined): void {
    if (!id) return;
    if (!confirm('¿Seguro que deseas eliminar este registro?')) return;
    this.editorialService.eliminar(id).subscribe({
      next: () => this.cargarEditorials(),
      error: (err) => {
        this.mensajeError = err?.error?.error || 'No se pudo eliminar (puede estar en uso en otro registro).';
      }
    });
  }

  cancelar(): void {
    this.editorialActual = this.editorialVacio();
    this.editando = false;
    this.mensajeError = '';
  }

  descargarPdf(): void {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text('Reporte de Editoriales', 14, 15);
    doc.setFontSize(9);
    doc.text('Generado: ' + new Date().toLocaleString('es-PE'), 14, 21);

    autoTable(doc, {
      startY: 26,
      head: [['Nombre', 'País', 'Teléfono']],
      body: this.editorials.map(item => [item.nombre, item.pais, item.telefono]) as any[][],
      styles: { fontSize: 8 },
      headStyles: { fillColor: [30, 41, 59] }
    });

    doc.save('editorial.pdf');
  }
}
