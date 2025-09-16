# Expeditions UI – Frontend (React + Vite)

Interfaz web **tipo PDA** para carretilleros. Permite **seleccionar una orden de carga** y **asignar un palet** usando la API del backend (`expeditionsec`). La pantalla está pensada para ser **simple, táctil y rápida**.

---

## Lógica detrás del código

El objetivo es que el operario haga **lo mínimo posible**:

1. **Carga de órdenes**: al montar la app hago un `fetch` a `GET /api/orders/open` del backend y pinto un `<select>` con las órdenes abiertas (incluye la matrícula del camión cuando aplica).
2. **Entrada del palet**: el operario introduce o escanea el **ID del palet**.
3. **Asignación**: al enviar el formulario hago `POST /api/assignments/pallet-to-order` con `palletId` y `orderId`.
4. **Feedback inmediato**:
   - Si la API devuelve error (p. ej. orden cerrada, palet no disponible, ya asignado), muestro un **mensaje rojo**.
   - Si todo va bien, muestro un **mensaje azul** con la respuesta del backend.
5. **UX**: mientras envío la petición deshabilito el botón y muestro `Asignando...` para evitar dobles clics.

> El estilo es **inline CSS**. Quizás esto no sea lo más recomendable, pero consideré que para esta prueba era algo sencillo.

---

## Estructura del código
<img width="443" height="839" alt="image" src="https://github.com/user-attachments/assets/500111b6-f5be-40b2-a54d-26ced42bcbd0" />


- **`App.jsx`** contiene:
  - Estado: `orders`, `orderId`, `palletId`, `loadingOrders`, `sending`, `result`, `error`.
  - `useEffect` para cargar órdenes al inicio.
  - `assign(e)` para hacer el POST de asignación.
  - Objeto `styles`.

> Si quisiera crecer, separaría **servicios** de API (`/src/api/*.js`) y **componentes** (`/src/components/*`). Para esta prueba mantengo todo en un archivo para **máxima claridad**.

---

## Configuración (API)

Por defecto apunto al backend en `http://localhost:8080`.  
En `App.jsx` tengo:

const API = "http://localhost:8080";

CÓMO EJECUTAR EL PROYECTO

Requiere Node 18+.

# 1) Instalar dependencias
npm install

# 2) Arrancar en desarrollo
npm run dev


La app se abre en: http://localhost:5173

Debemos asegurarnos de tener el backend corriendo en http://localhost:8080

