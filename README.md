# Neura Cinema

**Página:** https://neura-neura.github.io/neura-cinema/

Selecciona videos y subtítulos desde el navegador; tu servidor propio los recibe y sirve a VRChat. No se ejecuta un lanzador ni se instala software en la laptop.

## Uso

1. Conecta la dirección HTTPS del servidor con la clave privada del servicio.
2. Selecciona un video y pulsa **Subir y preparar**. El proceso termina de copiarlo antes de publicar el enlace.
3. Añade SRT o ASS; se convierten a texto temporizado, sin dibujos ni estilos avanzados ASS.
4. Copia **Video URL** al reproductor del mundo y **Subtitle URL** a su panel de subtítulos.
5. En VRChat usa una instancia privada y activa **Allow Untrusted URLs** en cada cliente.
6. Para terminar pulsa **Terminar y eliminar**. Las sesiones caducan a las 24 horas por defecto, con opciones de 6 o 48 horas.

El servidor debe permanecer encendido. Una vez preparado el video, la computadora que lo subió puede apagarse. La clave no se publica en este repositorio ni se guarda en almacenamiento persistente del navegador.

## HTTPS y gratuidad

GitHub Pages aloja solo HTML/JavaScript. Los videos están en el servidor propio. Loophole conecta ese servidor al exterior mediante una conexión saliente cifrada, proporciona HTTPS y no requiere IP pública ni abrir puertos.

Loophole [anuncia gratuidad y ausencia de límites de transferencia](https://loophole.cloud/docs/faq). No es una garantía de capacidad o disponibilidad. La página permite medir la entrega y comparar un margen de 1.5 veces el perfil por espectador. Las redes pueden interrumpirse y el backend de VRChat controla su buffer.

El video se sube por bloques de 1 MiB reintentables. El servicio prepara un MP4 H.264/AAC con descarga parcial y elimina el original de trabajo al terminar. No se afirma que el servidor detecte el fin de reproducción de todos los espectadores: la eliminación se hace mediante el botón o por caducidad.

Código de la interfaz; el backend se instala separadamente. No hay claves incluidas.
