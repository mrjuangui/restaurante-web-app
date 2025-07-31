
# 🍕 Restaurante Web App

Aplicación web full stack para un restaurante ficticio. Permite a los usuarios explorar el menú, hacer pedidos y a los administradores gestionar productos, pedidos y estadísticas.

## 📌 Cuenta Administrador

- **Correo Electrónico:** administrador1@gmail.com 
- **Contraseña:** 150397

---

## 🌐 Demo en producción
- **Frontend:** https://restaurante-frontend-seven.vercel.app  
- **Backend (API):** https://restaurante-web-app-production.up.railway.app

---

## 🧩 Tecnologías Utilizadas

### 🚀 Frontend

- React con Vite
- React Router + Axios
- Componentes
- UI con Bootstrap + CSS personalizado

### 🔐 Backend

- Node.js + Express (ES module)
- PostgreSQL
- JWT para autenticación
- Middleware
- Rutas

### ☁️ Despliegue
- **Frontend:** Vercel
- **Backend:** Railway
- **Base de Datos:** Supabase
- **Imágenes:** Cloudinary (cargadas manualmente)

---

## 👤 Roles de Usuario

### Cliente
- Registro e inicio de sesión.
- Visualización del menú con productos categorizados.
- Carrito de compras.
- Realización de pedidos.
- Visualización de historial de pedidos.
- Página de perfil.

### Administrador
- Todas las funciones de cliente.
- Gestión de productos.
- Gestión de pedidos (actualización de estado).
- Selección de productos recomendados.
- Dashboard con estadísticas de ventas.

---

## 📁 Estructura del repositorio

```
restaurante-web-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── index.js
│   ├── package.json
│   └── .env                # no se sube al repo
└── frontend/
    ├── src/
    │   ├── components/
    │   └── utils/
    ├── package.json
    ├── vite.config.js
    └── .env                # no se sube al repo
```

---

## ⚙️ Configuración local

### 1. Clona el repositorio

```bash
git clone https://github.com/mrjuangui/restaurante-web-app.git
cd restaurante-web-app
```

### 2. Backend

```bash
cd backend
cp .env.example .env    # o crea el archivo manualmente
npm install
npm run dev
```

Asegúrate de configurar las variables de entorno correctamente:

```env
PORT=3000
DATABASE_URL=postgresql://<usuario>:<clave>@<host>:<puerto>/<bd>
JWT_SECRET=una_clave_secreta_segura
```

### 3. Frontend

```bash
cd frontend/dashboard-admin
npm install
npm run dev
```

---

## ☁️ Despliegue

### 🧠 Backend

1. Se desplegó en **Railway.app**
2. Se configuró la variable de entorno `DATABASE_URL` con la conexión a **Supabase** (direct connection).
3. Comando de inicio:
   ```
   npm run start
   ```

### 🎨 Frontend

1. Se desplegó con **Vercel**
2. Se configuró el directorio raíz como `frontend/dashboard-admin`
3. Se usó el siguiente comando de build:
   ```
   npm run build
   ```

---

## 📌 Notas adicionales

- Las imágenes de los productos fueron subidas manualmente a **Cloudinary** y se referencian por URL.
- No se utiliza `.env` en el frontend; las URLs de la API están incrustadas en el código.
- El sistema aún puede mejorarse para ser completamente responsive en dispositivos móviles.

---

## 🧑‍💻 Autor

**Juan G. Perales - Ingeniero de Sistemas**  
[Portafolio](https://mrjuangui.github.io/landing-page/)  
[LinkedIn](https://www.linkedin.com/in/mrjuangui)
