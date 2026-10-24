# 📺 TV Chile - Guía Completa de Instalación y Marco Legal

Aplicación nativa Web para Smart TV Samsung (Tizen OS) diseñada especialmente para **adultos mayores y familias**, pensada para sintonizar y disfrutar de forma directa, ágil y gratuita los canales de televisión abierta chilena de libre recepción.

---

## ⚖️ Marco Legal y Regulatorio en Chile

Para total transparencia de los usuarios, desarrolladores y titulares de señales, a continuación se detallan los fundamentos técnicos y legales bajo los cuales opera esta aplicación dentro de la legislación chilena:

### 1. Naturaleza del Software: Reproductor Cliente de Código Abierto
* **TV Chile es única y exclusivamente un software reproductor multimedia (cliente)**, de funcionamiento análogo a un navegador web o a reproductores multimedia como *VLC*, *Kodi* o *ExoPlayer*.
* La aplicación **no aloja, no transmite, no retransmite, no re-codifica ni almacena ningún tipo de contenido audiovisual ni señal televisiva**. 
* El software no cuenta con servidores de streaming propios ni bases de datos de video. Su única función técnica es interpretar enlaces web públicos utilizando el protocolo estándar de la industria **HLS (HTTP Live Streaming)** para renderizarlos en la pantalla del televisor.

### 2. Principio de Televisión de Libre Recepción (Ley N° 18.838 / CNTV)
* En Chile, la televisión abierta se rige por la **Ley N° 18.838** (que crea el Consejo Nacional de Televisión - CNTV) y la **Ley N° 18.168** (Ley General de Telecomunicaciones), bajo el principio fundamental de **emisión abierta, universal y gratuita de libre recepción** para todos los habitantes de la República.
* Las señales nacionales (como *TVN*, *Canal 13*, *Chilevisión*, *Mega*, etc.), así como los múltiples canales regionales, universitarios y comunitarios del país, emiten de forma libre y gratuita por el espectro radioeléctrico y disponen simultáneamente de emisiones de streaming digital abiertas al público general en sus plataformas web oficiales, **sin barreras de pago, sin suscripción y sin cifrado de acceso condicional**.

### 3. Enlaces Públicos y Proyecto Comunitario `m3u.cl`
* La aplicación utiliza como fuente de indexación el directorio comunitario y colaborativo público de **`https://m3u.cl`** (específicamente `https://m3u.cl/lista/CL.m3u`).
* Esta lista incluye **exclusivamente canales de libre recepción (Free-To-Air / FTA)** de Chile. 
* **No se incluye, no se promueve ni se da soporte a canales de televisión de pago (cable/satélite)**, señales premium, eventos pay-per-view, ni contenido protegido por tecnologías de cifrado DRM (como *Widevine*, *PlayReady* o *FairPlay*).

### 4. Propiedad Intelectual (Ley N° 17.336) y Marcas
* Todos los contenidos, transmisiones, logotipos, nombres comerciales y marcas exhibidas pertenecen a sus respectivos concesionarios y organismos de radiodifusión según la **Ley N° 17.336 sobre Propiedad Intelectual**.
* El uso de los logotipos se realiza estrictamente con propósitos informativos y de referencia visual para facilitar la accesibilidad a adultos mayores, bajo el principio de uso justo y legítima identificación de la fuente pública de origen.
* **Descargo de Responsabilidad (Disclaimer)**: Esta aplicación es un proyecto educativo, de accesibilidad y sin fines de lucro. Si algún canal u organismo titular de una señal abierta desea que su enlace público no sea indexado en el directorio general, puede gestionarlo directamente ante el repositorio de origen en `m3u.cl` o comunicarse con el autor del repositorio para su remoción inmediata.

---

## 🎯 Características Principales de TV Chile

* 👵 **Diseñada para Adultos Mayores**: Al encender la tele o abrir la app, entra directamente a sintonizar en pantalla completa sin menús complejos ni botones confusos.
* 🔢 **Sintonización Numérica Directa**: Si el control remoto tiene números (`0` al `9`), se teclea el canal directamente (ej: `1` y `3` para Canal 13).
* 🎮 **Zapping Tradicional**: Botones `CH+` y `CH-` (o flechas arriba y abajo) para cambiar de canal tal como en la televisión de toda la vida.
* 📺 **Banner OSD Gigante**: Letras y números grandes con alto contraste que informan el canal, logo y hora actual, ocultándose solo a los 4 segundos.
* 🧠 **Memoria Automática**: Recuerda cuál fue el último canal visto para volver a sintonizarlo automáticamente al volver a encender la TV.

---

## 🛠️ Tutorial de Instalación Paso a Paso en Samsung Smart TV

Cualquier persona con un televisor **Samsung Smart TV (Tizen OS 2017 a 2026+)** puede instalar la aplicación mediante el método oficial más cómodo: **TizenBrew**.

---

### Paso 1: Activar el Modo Desarrollador en tu TV Samsung (Solo se hace 1 vez)
1. Enciende tu televisor Samsung y entra a la sección **Apps** (Smart Hub).
2. Con el control remoto, presiona la secuencia: **`1 2 3 4 5`**.
3. Aparecerá la ventana **Developer Mode Configuration**:
   * Cambia el interruptor a **ON**.
   * En **Host PC IP**, escribe la dirección IP de tu computador (ejemplo: `192.168.1.100`).
     *(Puedes ver la IP de tu PC en los ajustes de Wi-Fi de tu computadora)*.
4. Presiona **OK**.
5. **Reinicio completo obligatorio**: Mantén presionado el botón de encendido del control remoto durante 5 segundos hasta que la pantalla se apague y vuelva a encender con el logo de **Samsung** (o desenchufa la TV 10 segundos).

---

### Paso 2: Instalar TizenBrew en tu televisor (Desde PC o Mac)
TizenBrew es la tienda/gestor libre que permite ejecutar módulos sin lidiar con certificados complicados. Se instala una sola vez usando el instalador oficial para computadoras:

1. **Descargar el Instalador Oficial**:
   * En tu computador (Windows, Mac o Linux), ingresa a la página de descargas de **TizenBrew Installer**:
     👉 **[Descargar TizenBrew Installer (Releases oficiales)](https://github.com/reisxd/TizenBrewInstaller/releases/latest)**
   * Descarga el archivo correspondiente a tu sistema operativo:
     * **Windows**: `TizenBrewInstaller-win-x64.exe`
     * **Mac (Apple Silicon M1/M2/M3)**: `TizenBrewInstaller-macos-arm64`
     * **Mac (Intel)**: `TizenBrewInstaller-macos-x64`
     * **Linux**: `TizenBrewInstaller-linux-x64`
2. **Ejecutar el Instalador**:
   * Abre el archivo descargado. 
   * Se abrirá automáticamente una ventana en tu navegador web en: `http://localhost:8091/ui/dist/index.html`.
3. **Conectar a tu TV**:
   * En la pantalla del instalador, escribe la **Dirección IP de tu Smart TV** *(puedes ver la IP de tu TV en: Configuración ➔ General ➔ Red ➔ Estado de Red ➔ Configuración de IP)*.
   * Haz clic en **Connect** (Conectar).
4. **Instalar TizenBrew**:
   * Presiona el botón **Install TizenBrew**.
   * En unos 10 segundos verás el aviso de éxito y la aplicación **TizenBrew** aparecerá instalada en el menú Smart Hub de tu televisor.

---

### Paso 3: Configurar la IP interna (127.0.0.1) en la TV
Para que TizenBrew pueda autogestionar y descargar módulos desde el propio televisor:
1. En tu TV, ve nuevamente a **Apps** y presiona **`1 2 3 4 5`**.
2. En **Host PC IP**, cambia la IP anterior por: **`127.0.0.1`**
3. Presiona **OK**.
4. Reinicia la TV manteniendo presionado el botón de encendido del control durante 5 segundos.

---

### Paso 4: Agregar el Módulo TV Chile en TizenBrew
1. Abre **TizenBrew** en tu televisor.
2. En el menú principal, selecciona la opción:
   👉 **"Añadir módulo GitHub"**
3. En el teclado que aparece en pantalla, escribe exactamente:
   ```text
   diegosagredo911/tvchile
   ```
4. Presiona **Listo / OK**.
5. TizenBrew descargará el paquete en 5 segundos y agregará la tarjeta **TV Chile** en tu pantalla principal.
6. ¡Haz clic sobre ella y comenzarán a reproducirse los canales chilenos en vivo!

---

### Método Alternativo: Instalación Directa por Pendrive USB (Sin PC ni TizenBrew)
Si no deseas instalar TizenBrew o prefieres tener **TV Chile** como una aplicación nativa con su propio ícono en la barra principal del Smart Hub de Samsung:

1. **Formatear el pendrive**: Toma un pendrive USB y asegúrate de que esté formateado en **FAT32**.
2. **Copiar los archivos**: Copia la carpeta **`userwidget`** de este repositorio directamente a la raíz de tu pendrive.
   * La estructura en el pendrive debe quedar exactamente así:
     ```text
     Pendrive (E:)
     └── userwidget/
         └── TVChile.wgt
     ```
     *(También puedes simplemente descargar y descomprimir el archivo `userwidget.zip` que incluimos en el repositorio directamente en tu pendrive)*.
3. **Activar Modo Desarrollador en la TV**: Asegúrate de que el modo desarrollador esté encendido en la TV (Apps ➔ `1 2 3 4 5` ➔ **ON**).
4. **Conectar a la TV**: Enchufa el pendrive a cualquiera de los puertos USB de tu televisor Samsung encendido.
5. **Instalación automática**: En la esquina superior de la pantalla aparecerá el mensaje:
   > *"Installing user widget..."*
6. A los pocos segundos, verás aparecer el ícono de **TV Chile** directamente en tu barra de aplicaciones de Samsung Smart Hub, listo para abrir con un clic.

---

### 🌟 Configuración para que funcione como "Tele Tradicional" (Arranque Automático)

Para que un adulto mayor o cualquier integrante del hogar no tenga que tocar ningún menú al encender la TV:

#### 1. En TizenBrew:
* En el menú principal de TizenBrew, ve a **Ajustes (Settings)** o mantén presionado el botón central sobre la tarjeta de **TV Chile**.
* Activa la opción **"Auto Launch"** (o **"Default Module"**) y selecciona **TV Chile**.

#### 2. En el Menú de tu Samsung Smart TV:
* Presiona el botón de **Configuración (Ajustes)** en tu control remoto.
* Ve a: **General** ➔ **Funciones Inteligentes** *(Smart Features)*.
* Activa en **ON**:
  * ✅ **Ejecutar automáticamente la última aplicación** *(Autorun Last App)*.
  * ✅ **Ejecutar Smart Hub automáticamente** *(Autorun Smart Hub)*.

🎉 **¡Listo!** A partir de ahora, cada vez que enciendas la tele con el control remoto, se abrirá directamente el último canal chileno en pantalla completa.

---

## 🎮 Controles del Mando a Distancia (Samsung TV)

| Botón en el Control | Acción en la Aplicación |
| :--- | :--- |
| **CH+ / Flecha Arriba (▲)** | Canal siguiente (Zapping clásico) |
| **CH- / Flecha Abajo (▼)** | Canal anterior (Zapping clásico) |
| **OK / Enter Central** | Abrir la Guía visual de canales / Sintonizar |
| **Flecha Izquierda (◄)** | Abrir Guía de Canales (o saltar 10 canales hacia atrás) |
| **Flecha Derecha (►)** | Mostrar u ocultar el banner informativo inferior |
| **Teclas 0 al 9** | Sintonizar directamente el número de canal digitado |
| **Volver / Return** | Cerrar la Guía de Canales |
| **Play / Pause** | Pausar o reanudar transmisión en vivo |

---

## 🤝 Créditos y Agradecimientos

* **Lista pública M3U**: Proyecto comunitario chileno [m3u.cl](https://m3u.cl).
* **Plataforma de ejecución**: [TizenBrew](https://github.com/reisxd/TizenBrew) por *reisxd*.
* **Desarrollo y Adaptación**: Diego Sagredo.
