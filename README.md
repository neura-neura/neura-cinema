# Neura Cinema

**Página:** https://neura-neura.github.io/neura-cinema/

Selecciona videos y subtítulos desde el navegador; tu servidor propio los recibe y sirve a VRChat. No se ejecuta un lanzador ni se instala software en la laptop.

## Uso

1. Abre la página: entra automáticamente como invitado, sin cuenta ni clave. Para gestionar las sesiones de todos usa **Administrar con GitHub** (solo la cuenta propietaria).
2. Si estás en la misma red que el servidor, pulsa **Conectar por red local** y permite el acceso a dispositivos de la red si el navegador lo solicita. Los bloques de video viajan directamente a tu servidor por HTTP dentro de la red local; los enlaces de reproducción siguen siendo HTTPS públicos. Si no estás en casa, sigue usando internet.
3. Selecciona un video y pulsa **Subir y preparar**. El proceso termina de copiarlo antes de publicar el enlace.
4. Añade SRT o ASS; se convierten a texto temporizado, sin dibujos ni estilos avanzados ASS.
5. Copia **Video URL** al reproductor del mundo y **Subtitle URL** a su panel de subtítulos.
6. En VRChat usa una instancia privada y activa **Allow Untrusted URLs** en cada cliente.
7. Para terminar pulsa **Terminar y eliminar**. Las sesiones caducan a las 24 horas por defecto, con opciones de 6 o 48 horas.

El servidor debe permanecer encendido. Una vez preparado el video, la computadora que lo subió puede apagarse. El navegador recuerda automáticamente un identificador de invitado durante hasta 90 días; permite recuperar solo las sesiones que creaste allí. Borrar los datos del navegador o cambiar de computadora pierde ese acceso. La cuenta administradora puede recuperarlas. Las sesiones de video siguen caducando en 6, 24 o 48 horas, independientemente del acceso. Máximo dos sesiones activas por invitado. El acceso de administrador dura hasta 8 horas, se mantiene en la pestaña y se revoca al salir. GitHub solo verifica la identidad pública; no se solicitan permisos de repositorios.

## HTTPS y gratuidad

GitHub Pages aloja solo HTML/JavaScript. Los videos están en el servidor propio. Loophole conecta ese servidor al exterior mediante una conexión saliente cifrada, proporciona HTTPS y no requiere IP pública ni abrir puertos.

Loophole [anuncia gratuidad y ausencia de límites de transferencia](https://loophole.cloud/docs/faq). No es una garantía de capacidad o disponibilidad. La página permite medir la entrega y comparar un margen de 1.5 veces el perfil por espectador. Las redes pueden interrumpirse y el backend de VRChat controla su buffer.

El video se sube por bloques de 1 MiB reintentables. El servicio prepara un MP4 H.264/AAC con descarga parcial y elimina el original de trabajo al terminar. No se afirma que el servidor detecte el fin de reproducción de todos los espectadores: la eliminación se hace mediante el botón o por caducidad.

Código de la interfaz; el backend se instala separadamente. No hay credenciales incluidas.

Para continuar una subida empezada con la versión anterior: pulsa Detener subida, recarga la página, activa la red local, selecciona exactamente el mismo archivo y pulsa Subir y preparar. La posición recibida se conserva en el servidor. La ruta local usa bloques de 4 MiB; la de internet conserva bloques de 1 MiB. Si falla una petición a la red local, se reintenta por internet comprobando la posición antes de continuar. El soporte del permiso de red local depende del navegador; si lo bloquea, la página conserva la ruta por internet.

## Preparación en esta computadora

En navegadores compatibles, «Preparar en esta computadora» queda activado por defecto. Selecciona el original, la calidad y Subir y preparar: la página crea el MP4 localmente y después envía ese archivo, usando la ruta LAN si está activada. El servidor comprueba el MP4 y, si ya es compatible, lo publica sin reconvertir. Los subtítulos se añaden por separado como antes. Mantén la pestaña abierta hasta que termine de copiarse el archivo. No se instala ningún lanzador.

La conversión usa WebCodecs y solicita aceleración por hardware, cuya disponibilidad depende del equipo y navegador. Si una pista necesaria no es compatible, se muestra un error y no se sube un video sin audio; puedes desmarcar la preparación local para usar el servidor.

El resultado se guarda progresivamente en almacenamiento temporal del navegador. Si detienes la subida, seleccionar el mismo original y la misma calidad recupera el MP4 para continuar sin reconvertir. Tras completar la copia al servidor se elimina esa copia temporal. Al usar de nuevo el conversor se limpian borradores caducados (48 horas). Borrar los datos del sitio también elimina los borradores. Una subida original empezada con la versión anterior se reanuda como original, para no descartar los bytes ya enviados.

Mediabunny 1.66.0 se distribuye sin modificaciones bajo MPL-2.0. [Licencia y código fuente correspondiente](vendor/NOTICE.md).
