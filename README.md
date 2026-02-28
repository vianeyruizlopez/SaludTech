# 🏥 Enfermería al Día – Backend API

API RESTful desarrollada en Node.js + Express para gestión del flujo operativo del personal de enfermería.

---

## 🚀 Instalación y Configuración

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con tus credenciales
```

### 3. Crear base de datos
Ejecuta el SQL de `database.sql` en tu servidor MySQL.

### 4. Iniciar el servidor
```bash
# Producción
npm start

# Desarrollo (con nodemon)
npm run dev
```

---

## 📁 Estructura del Proyecto

```
enfermeria-api/
├── src/
│   ├── app.js                    # Punto de entrada
│   ├── config/
│   │   ├── database.js           # Pool MySQL
│   │   └── firebase.js           # Firebase Admin SDK
│   ├── middlewares/
│   │   └── auth.middleware.js    # verifyToken + authorizeRoles
│   ├── repositories/             # Capa de acceso a BD
│   │   ├── usuario.repository.js
│   │   ├── habitacion.repository.js
│   │   ├── paciente.repository.js
│   │   ├── nota.repository.js
│   │   ├── tarea.repository.js
│   │   └── turno.repository.js
│   ├── services/                 # Lógica de negocio
│   │   ├── auth.service.js
│   │   ├── usuario.service.js
│   │   ├── habitacion.service.js
│   │   ├── paciente.service.js
│   │   ├── nota.service.js
│   │   ├── tarea.service.js
│   │   └── turno.service.js
│   ├── controllers/              # Manejo de requests/responses
│   │   ├── auth.controller.js
│   │   ├── usuario.controller.js
│   │   ├── habitacion.controller.js
│   │   ├── paciente.controller.js
│   │   ├── nota.controller.js
│   │   ├── tarea.controller.js
│   │   └── turno.controller.js
│   └── routes/
│       └── index.js              # Todas las rutas /api/v1
├── .env.example
├── .gitignore
└── package.json
```

---

## 🌐 Endpoints

### 🔐 Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Registro con email/password |
| POST | `/api/v1/auth/login` | Login con email/password |
| POST | `/api/v1/auth/firebase` | Login con Firebase ID Token |

**Login Firebase – Body:**
```json
{ "idToken": "TOKEN_DE_FIREBASE" }
```

**Respuesta:**
```json
{
  "user": { "id_usuario": 1, "email": "...", "rol": "Enfermero" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 👤 Usuarios (🛡 Supervisor)
| Método | Endpoint |
|--------|----------|
| GET | `/api/v1/usuarios` |
| GET | `/api/v1/usuarios/:id` |
| PUT | `/api/v1/usuarios/:id` |
| DELETE | `/api/v1/usuarios/:id` |

---

### 🏥 Habitaciones
| Método | Endpoint |
|--------|----------|
| POST | `/api/v1/habitaciones` |
| GET | `/api/v1/habitaciones` |
| GET | `/api/v1/habitaciones/:id` |
| PUT | `/api/v1/habitaciones/:id` |
| PATCH | `/api/v1/habitaciones/:id/estado` |
| GET | `/api/v1/habitaciones/:id/pacientes` |

---

### 🧑 Pacientes
| Método | Endpoint |
|--------|----------|
| POST | `/api/v1/pacientes` |
| GET | `/api/v1/pacientes` |
| GET | `/api/v1/pacientes/:id` |
| PUT | `/api/v1/pacientes/:id` |
| DELETE | `/api/v1/pacientes/:id` |
| GET | `/api/v1/pacientes/:id/handoff?horas=12` |

---

### 📝 Notas de Enfermería
| Método | Endpoint |
|--------|----------|
| POST | `/api/v1/notas` |
| GET | `/api/v1/notas` |
| GET | `/api/v1/notas/:id` |

---

### 📌 Tareas
| Método | Endpoint |
|--------|----------|
| POST | `/api/v1/tareas` |
| GET | `/api/v1/tareas?estado=Pendiente` |
| GET | `/api/v1/tareas/:id` |
| PATCH | `/api/v1/tareas/:id/estado` |
| DELETE | `/api/v1/tareas/:id` |

---

### 🕒 Turnos
| Método | Endpoint |
|--------|----------|
| POST | `/api/v1/turnos/iniciar` |
| PATCH | `/api/v1/turnos/:id/finalizar` |
| GET | `/api/v1/turnos` |
| GET | `/api/v1/usuarios/:id/turnos` |

---

## 🔐 Autenticación

Todos los endpoints protegidos requieren el header:

```
Authorization: Bearer <tu_token_jwt>
```

---

## 🔑 Flujo OAuth 2.0 con Firebase

```
1. Usuario se autentica en Firebase (Frontend)
2. Frontend obtiene Firebase ID Token
3. POST /api/v1/auth/firebase  { idToken }
4. Backend verifica con Firebase Admin SDK
5. Se sincroniza/crea usuario en MySQL
6. Responde con JWT interno del sistema
7. El cliente usa ese JWT para todas las peticiones
```
