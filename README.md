# Sistema de Gestión de Biblioteca

Proyecto académico — **Programación de Aplicaciones Web**. Sistema de gestión de biblioteca con **arquitectura por capas**, backend en **Spring Boot** (API REST en JSON) y frontend en **Angular**.

## 🏗️ Arquitectura del sistema

```
[ Frontend Angular (components / services / models) ]
                      ↕  HTTP (JSON)
   [ Controller (@RestController) ]
                      ↕
   [ Service (interfaz + implementación) ]
                      ↕
   [ Repository (Spring Data JPA) ]
                      ↕
       [ Entity (JPA) ] ↔ [ Base de datos MySQL ]
```

Todo el registro y edición de datos se hace **por JSON** (peticiones HTTP con `Content-Type: application/json`), no por formularios tradicionales ni acceso directo a la base de datos.

## 📁 Estructura de carpetas

```
SistemaBiblioteca/
├── backend/                     Proyecto Spring Boot (Maven)
│   └── src/main/java/com/pontificia/biblioteca/
│       ├── entity/              12 entidades JPA (una por tabla)
│       ├── repository/          Interfaces JpaRepository
│       ├── service/             Interfaces de lógica de negocio
│       ├── service/impl/        Implementación de cada service
│       ├── controller/api/      Controladores REST (JSON)
│       ├── dto/                 (reservado para DTOs de reportes)
│       └── config/               Configuración (CORS, etc.)
├── database/
│   └── schema_biblioteca.sql    Script MySQL: 12 tablas + datos de prueba
└── frontend/                    Proyecto Angular
    └── src/app/
        ├── components/          Componentes (ejemplo completo: libros/)
        ├── models/               Interfaces TypeScript (una por entidad)
        └── services/             Servicios HttpClient (uno por entidad)
```

## 🗄️ Modelo de datos (12 tablas)

| Tabla | Descripción |
|---|---|
| `rol` | Catálogo de roles del sistema |
| `usuario` | Bibliotecarios/administradores que operan el sistema |
| `categoria_libro` | Género o categoría bibliográfica |
| `editorial` | Editoriales de los libros |
| `autor` | Autores de los libros |
| `socio` | Lectores/miembros registrados de la biblioteca |
| `libro` | Título bibliográfico (catálogo) |
| `libro_autor` | Relación N:M entre libro y autor |
| `ejemplar` | Copia física de un libro (lo que realmente se presta) |
| `prestamo` | Cabecera de un préstamo a un socio |
| `detalle_prestamo` | Detalle de ejemplares por préstamo (N:M) |
| `multa` | Penalidad por devolución tardía de un préstamo |

Relaciones 1:N (`Socio → Préstamo`, `Libro → Ejemplar`, etc.) y N:M resueltas con tablas intermedias (`libro_autor`, `detalle_prestamo`), como en un sistema bibliotecario real: un libro puede tener varios autores, y un préstamo puede incluir varios ejemplares.

## 🔐 Login

El sistema tiene una pantalla de login (`/login`) que valida contra la tabla `usuario` (endpoint `POST /api/auth/login`). Mientras no haya sesión iniciada, no se puede entrar al dashboard (`/dashboard`) — lo protege un *guard* de Angular.

Usuario de prueba (ya viene en `schema_biblioteca.sql`):
- **Usuario:** `admin`
- **Contraseña:** `admin123`

## ⚙️ Cómo ejecutar el proyecto (un solo comando)

Ya no hace falta abrir dos terminales (backend + `ng serve`). El `pom.xml` del backend compila el frontend Angular automáticamente y lo deja sirviéndose desde el mismo Spring Boot, en el mismo puerto.

1. Crea la base de datos ejecutando `database/schema_biblioteca.sql` en MySQL (o deja que Spring Boot la cree sola, ya tiene `createDatabaseIfNotExist=true`).
2. Revisa `backend/src/main/resources/application.properties` y ajusta usuario/contraseña de MySQL si no usas `root/root`.
3. Desde la carpeta `backend/`, ejecuta un único comando:
   ```
   mvnw clean package spring-boot:run        (Windows: mvnw.cmd clean package spring-boot:run)
   ```
   La primera vez tarda más: Maven descarga Node/npm por su cuenta y corre `npm install` + `ng build`. Necesitas internet solo para ese primer build. Las siguientes veces es más rápido.
4. Abre **`http://localhost:8080`** en el navegador. Ahí sale directo la pantalla de **login**, y ya no `http://localhost:4200`.

> Si por algo necesitas volver al modo de desarrollo (backend en 8080 + `ng serve` en 4200 con recarga en caliente), sigue funcionando igual: corre `mvnw spring-boot:run` en `backend/` y, aparte, `npm install` + `ng serve` en `frontend/`. El `CorsConfig` del backend ya permite peticiones desde `http://localhost:4200`.
>
> Para saltarte la compilación del frontend en un build de Maven (por ejemplo si solo tocaste algo del backend), agrega `-Dskip.frontend.build=true` al comando.

## 🔗 Endpoints REST disponibles (por cada una de las 12 entidades)

Todos siguen el mismo patrón, por ejemplo para libros:

| Método | Endpoint | Acción |
|---|---|---|
| GET | `/api/libros` | Listar todos |
| GET | `/api/libros/{id}` | Buscar por ID |
| POST | `/api/libros` | Crear (body JSON) |
| PUT | `/api/libros/{id}` | Actualizar (body JSON) |
| DELETE | `/api/libros/{id}` | Eliminar |

Endpoints adicionales con lógica de negocio propia (en `Prestamo`):
- `GET /api/prestamos/vencidos` → préstamos activos cuya fecha límite ya pasó.
- `PATCH /api/prestamos/{id}/devolucion` → marca el préstamo como DEVUELTO y, si hubo atraso, genera automáticamente una `Multa` (S/ 1.00 por día de atraso).

## 📌 Cómo continuar el proyecto

El componente `libros` (en `frontend/src/app/components/libros/`) es un ejemplo completo y funcional de CRUD por JSON. Para agregar los demás módulos (socios, préstamos, ejemplares, autores...), repite el mismo patrón:
1. Ya tienes el `model` y el `service` Angular generados para las 12 entidades.
2. Solo falta crear su componente (list + form), copiando la estructura de `libros.component.ts` / `.html`.
