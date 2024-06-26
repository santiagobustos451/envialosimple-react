## Documentación del Desafío Técnico - Desarrollador Frontend

### Introducción:

Este proyecto es la resolución de un desafío técnico, con el objetivo de demostrar habilidades de desarrollo frontend, incluyendo la implementación de funcionalidades de autenticación, manejo de formularios y diseño responsivo. A continuación se describirá detalladamente la estructura de la aplicación y su funcionamiento.

## Instrucciones para ejecutar la aplicación Dockerizada

**Requisitos previos:** Para ejecutar esta aplicación correctamente, asegurarse de que Docker esté instalado y sea accesible desde la línea de comandos.

1. **Clonar el repositorio:**
   Clonar el repositorio del proyecto.

```bash
git clone https://github.com/santiagobustos451/envialosimple-react/
```

2. **Navegar al directorio del proyecto:**
   Abrir una terminal y navegar hasta el directorio raíz del proyecto.

```bash
cd envialosimple-react
```

3. **Construir la imagen Docker:**
   Ejecutar el siguiente comando para construir la imagen Docker.

```bash
docker build -t envialosimple-react:v1.0 .
```

4. **Ejecutar el contenedor Docker:**
   Una vez que la imagen se haya construido correctamente, ejecutar el siguiente comando para iniciar el contenedor Docker. Asegurarse de elegir un puerto local que esté disponible y abierto para mapearlo al puerto del contenedor (por ejemplo, el puerto 8080):

```bash
docker run -p <puerto_local>:8080 envialosimple-react:v1.0
```

Reemplaza <puerto_local> con el número de puerto local que desees utilizar.

Este comando ejecutará el contenedor y mapeará el puerto 8080 del contenedor al puerto especificado localmente.

5. **Acceder a la aplicación:**
   Una vez que el contenedor esté en ejecución, abre un navegador web y navega a la siguiente dirección:

```
http://localhost:<puerto_local>
```
Reemplaza <puerto_local> con el número de puerto local que hayas elegido. Por ejemplo, si has elegido el puerto 8080, la dirección sería http://localhost:8080. Deberías ver la aplicación ejecutándose correctamente en tu navegador.


### Estructura del Proyecto:

```
src
│
├── assets
│ ├── logo.svg
│ └── ...
│
├── components
│ ├── auth
│ │ └── SignOutButton.tsx
│ │
│ ├── common // Componentes de uso general, partes de la interfaz
│ │ ├── Dropdown.tsx
│ │ ├── Modal.tsx
│ │ └── ...
│ │
│ ├── forms // Formularios que se comunican con los endpoints de la API
│ │ └── products
│ │   ├── AddProduct.tsx
│ │   ├── EditProduct.tsx
│ │   └── ...
│ │
│ └── svg
│ ├── Logotype.tsx
│ └── ...
│
├── pages // Componentes asociados a rutas
│ ├── Login.tsx
│ ├── ListProducts.tsx
│ └── RouteError.tsx
│
└── style
├── base.css
└── ...
```

### Funcionalidades Principales:

La aplicación consta de las siguientes funcionalidades principales, de acuerdo con los requisitos del proyecto:

1. **Página de Login**:

   - Interfaz para que los usuarios ingresen sus credenciales.
   - Autenticación de usuario mediante una solicitud al endpoint público de "Login".
   - Redireccionamiento a la página de "Listado de productos" si las credenciales son válidas.

2. **Listado de Productos**:
   - Sección privada que requiere autenticación para acceder.
   - Muestra los productos disponibles en el stock, utilizando el endpoint "Listar Productos".
   - Funcionalidades adicionales incluyen filtrado, ordenamiento, paginación, y acceso a los formularios de adición, edición y eliminación de productos.

### Interacción con la API:

Para interactuar con la API y obtener datos, se utilizan funciones asíncronas que realizan solicitudes HTTP. Un ejemplo de una de estas funciones es `fetchProducts`, que se encarga de obtener la lista de productos desde el servidor.

La función `fetchProducts` sigue los siguientes pasos:

1. **Preparación de la solicitud**: Se construye la URL de la solicitud con los parámetros necesarios, como la página, el límite de productos por página, filtros, orden y token de autorización.

2. **Realización de la solicitud**: Se realiza la solicitud HTTP GET utilizando la función `fetch`. La URL construida se pasa como argumento, junto con un objeto de opciones que incluye el método HTTP, los encabezados de la solicitud (en este caso, el token de autorización y el tipo de contenido).

3. **Manejo de la respuesta**: Se verifica si la respuesta de la API es exitosa (código de estado 200). Si la respuesta es exitosa, se convierte la respuesta en formato JSON y se extraen los datos relevantes, como la lista de productos, el número total de páginas y el total de productos. Estos datos se almacenan en el estado local del componente para su uso posterior.

4. **Manejo de errores**: En caso de que ocurra algún error durante la solicitud, se activa un bloque `catch` para manejar la excepción. En este caso, se muestra un mensaje de error en la consola y se desactiva el indicador de carga.

A continuación se muestra el código de ejemplo de la función `fetchProducts` que ilustra estos pasos:

```typescript
const fetchProducts = async () => {
  setIsLoading(true);

  try {
    const queryParams = new URLSearchParams({
      page: String(page),
      limit: String(limit.value),
      filterName: filter,
      orderby: String(orderBy.value),
      order: String(order.value),
    });

    const urlWithParams = `${apiUrl}?${queryParams.toString()}`;
    console.log(urlWithParams);

    const response = await fetch(urlWithParams, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        'Failed to fetch products. Server responded with status ' +
          response.status
      );
    }

    const responseData = await response.json();
    setIsLoading(false);
    setProducts(responseData.result.payload);
    setTotalPages(responseData.result.pages);
    setTotalProducts(responseData.result.total);
  } catch (error) {
    setIsLoading(false);
    console.error('There was a problem with the fetch operation:', error);
    alert('Failed to fetch products. Please try again later.');
  }
};
```

### Organización de Estilos CSS:

Los estilos CSS están organizados de manera modular para facilitar el mantenimiento y la escalabilidad del código. Se siguen las siguientes convenciones de organización:

- **Archivo base.css**: Este archivo contiene estilos globales que se aplican a toda la aplicación, como definiciones de colores, fuentes y estilos de botones. También se establecen variables CSS personalizadas para la fácil personalización y mantenimiento del diseño.

- **Archivos .module.css asociados a cada componente**: Los estilos específicos de cada componente se encuentran en archivos CSS modulares asociados directamente con cada componente React. Esto ayuda a evitar conflictos de estilos y facilita la comprensión del alcance de los estilos en cada componente.

- **Formato de clases**: Las clases CSS siguen el formato snakeCase para facilitar su integración en el código mediante el uso de módulos CSS.

- **Media Queries para diseño responsivo**: Se utilizan media queries para aplicar estilos específicos y reordenar los elementos según el tamaño de la pantalla, garantizando una experiencia de usuario consistente en diferentes dispositivos y resoluciones.

### Nota Adicional:

Este proyecto utiliza las siguientes tecnologías y bibliotecas:

- React para el desarrollo frontend - Compilado mediante Vite.
- React Router para el enrutamiento de la aplicación.
- React Auth Kit para la gestión de la autenticación de usuario.
- React Hook Form para el manejo de formularios.
- Fetch API para comunicarse con la API del servidor.

Para cualquier pregunta o aclaración adicional, no dude en contactar al desarrollador responsable del proyecto.
