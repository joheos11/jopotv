## JopoTv — Addon para Stremio

Addon simple para Stremio que provee contenidos/links desde este repositorio.

Proyecto: https://github.com/joheos11/JopoTv

### Contenido del repositorio

- `addon.js` — Lógica principal del addon (endpoints, manifest serving, catálogo).
- `manifest.json` — Manifiesto del addon (metadatos que Stremio consume).
- `server.js` — Servidor Node.js que expone el manifiesto y routes del addon.
- `package.json` — Dependencias y scripts del proyecto.

---

## Requisitos

- Node.js (>= 14) y npm
- Conexión a Internet para despliegue y pruebas desde clientes Stremio

---

## Ejecutar localmente (desarrollo)

1. Instala dependencias:

```powershell
cd D:\Jorge\GIT\Stremio\JopoTv
npm install
```

2. Inicia el servidor:

```powershell
node server.js
# o si tienes script start en package.json
npm start
```

3. Por defecto el servidor sirve el manifiesto (por ejemplo) en `http://localhost:PORT/manifest.json`.

4. Para probar el addon en tu cliente Stremio (local):

   - Abre Stremio → Add-ons → Mi add-on → "Instalar desde URL" (o similar).
   - Pega la URL pública al `manifest.json`, por ejemplo: `https://<tu-dominio>/manifest.json` o `http://<ngrok-id>.ngrok.io/manifest.json` si usas túnel.

---

## Exponer localmente (ngrok)

Si quieres probar desde otro equipo o con Stremio instalado en otro dispositivo, puedes exponer tu servidor local con ngrok:

```powershell
# instala/ejecuta ngrok y expón el puerto (ej. 8080)
ngrok http 8080
# copia la URL HTTPS que te devuelva ngrok y usa: https://xxxxx.ngrok.io/manifest.json
```

---

## Despliegue (recomendado)

Opciones sencillas y actuales para producir una URL pública HTTPS al `manifest.json`:

- Vercel (recomendado por facilidad): conecta tu repositorio GitHub y despliega en minutos.
- GitHub Pages: funciona si tu addon puede servir archivos estáticos (manifest estático). Si tienes un servidor Node, no sirve por sí sola.
- Heroku / Railway: permiten desplegar servidores Node.js y exponen una URL pública.

Ejemplo rápido con Vercel:

1. Conecta tu repo `joheos11/JopoTv` a Vercel.
2. Configura la build command si es necesario (p. ej. `npm install && npm run build`) y el start command (`node server.js`).
3. Despliega; usa la URL proporcionada y apunta `manifest.json` allí.

---

## Cómo añadir el addon en Stremio (resumen)

1. Obtén la URL pública de tu `manifest.json` (despliegue o ngrok).
2. Abre Stremio → Add-ons → "Instalar desde URL" → pega la URL.

---

## Contribuciones y contacto

Si quieres mejorar el addon, abre un issue o un pull request en https://github.com/joheos11/JopoTv

---

## Licencia

Indica aquí la licencia que prefieras (por ejemplo MIT). Si no la has definido aún, puedes añadir un archivo `LICENSE` o editar este README.

---

Archivo creado automáticamente: `README.md` — instrucciones básicas para desarrollo y despliegue.
