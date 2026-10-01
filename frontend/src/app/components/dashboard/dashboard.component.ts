import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, UsuarioSesion } from '../../services/auth.service';

import { RolComponent } from '../rol/rol.component';
import { UsuarioComponent } from '../usuario/usuario.component';
import { CategoriaLibroComponent } from '../categoria/categoria.component';
import { EditorialComponent } from '../editorial/editorial.component';
import { AutorComponent } from '../autor/autor.component';
import { SocioComponent } from '../socio/socio.component';
import { LibroComponent } from '../libro/libro.component';
import { LibroAutorComponent } from '../libro-autor/libro-autor.component';
import { EjemplarComponent } from '../ejemplar/ejemplar.component';
import { PrestamoComponent } from '../prestamo/prestamo.component';
import { DetallePrestamoComponent } from '../detalle-prestamo/detalle-prestamo.component';
import { MultaComponent } from '../multa/multa.component';

type Seccion =
  | 'libros' | 'categorias' | 'editoriales' | 'autores' | 'libro-autores'
  | 'ejemplares' | 'socios' | 'prestamos' | 'detalle-prestamos' | 'multas'
  | 'usuarios' | 'roles';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RolComponent, UsuarioComponent, CategoriaLibroComponent, EditorialComponent,
    AutorComponent, SocioComponent, LibroComponent, LibroAutorComponent,
    EjemplarComponent, PrestamoComponent, DetallePrestamoComponent, MultaComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  usuario: UsuarioSesion | null;
  seccionActiva: Seccion = 'libros';

  menu: { id: Seccion; label: string }[] = [
    { id: 'libros', label: 'Libros' },
    { id: 'categorias', label: 'Categorías' },
    { id: 'editoriales', label: 'Editoriales' },
    { id: 'autores', label: 'Autores' },
    { id: 'libro-autores', label: 'Autores por Libro' },
    { id: 'ejemplares', label: 'Ejemplares' },
    { id: 'socios', label: 'Socios' },
    { id: 'prestamos', label: 'Préstamos' },
    { id: 'detalle-prestamos', label: 'Detalle de Préstamos' },
    { id: 'multas', label: 'Multas' },
    { id: 'usuarios', label: 'Usuarios' },
    { id: 'roles', label: 'Roles' },
  ];

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = this.authService.getUsuario();
  }

  irA(seccion: Seccion): void {
    this.seccionActiva = seccion;
  }

  cerrarSesion(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
