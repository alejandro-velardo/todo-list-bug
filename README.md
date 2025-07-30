
# 📝 ** Qué se ha cambiado ? ** 🔒

Tras un repaso del proyecto, se han podido hacer diversos cambios en diversos sentidos:

**Protección**
Se han protegido los endpoints de ´GET /tasks´, ´GET /task/:id´, ´PUT /task/:id´ (se ha cambiado la lógica del endpoint y el tipo de POST a PUT - más convencional) mediante el uso de guards de Nest.

Ahora el endpoint ´GET /tasks´ solo devuelve las contraseñas del usuario validado.
´GET /task/:id´, ´PUT /task/:id´ solo permiten consultar y hacer cambios al usuario si tiene un token valido.

 
**Autenticación con JWT**
Se reemplazó la constante jwtConstants.secret por una lectura desde ConfigService para evitar hardcodeo y facilitar la configuración por entorno. Se ha borrado el archivo constants.ts.


**Mejorar el manejo de errores**
Se han añadido nuevos tipos de excepciones a la capa de servicios  y se han añadido archivos con DTOs para validar los cuerpos de las solicitudes HTTP, con mensajes de error predeterminado según el tipo de fallo.

También se han añadido otro tipo de logs.

**Auditoría general de seguridad**
Se han retirado variables sensibles del codigo del proyecto guardandolas usando ConfigService. Se ha añadaido un script para hashear todas las contraseñas de base de datos usando bcrypt, y se ha cambiado el metodo de crear un usuario para nunca guardar una contraseña en texto plano en base de datos. 
Se ha forzado el uso de contraseñas más seguras para el registro.

**Otros**
Se han cambiado los tests , cuando ha sido necesario, para que pasaran una vez implementados estos cambios. Se ha añadido un archivo test.http para probar la API. 

**Bonus PoC**
Se ha implementadoun microservicio usando RabbitMQ y Nodemailer, como PoC, que envia un correo al usuario tras su registro. 

---

## 🎯 **Objetivos**

Tu misión consiste en completar los siguientes objetivos:

1. **Protección de las tareas por usuario**: Actualmente, cualquier usuario puede ver el detalle de una tarea, incluso si no le pertenece. Deberás corregir esto para asegurarte de que **solo el propietario** de una tarea pueda verla.

2. **Restringir la edición de tareas**: Actualmente, cualquier usuario puede editar las tareas de otros. Corrige esta funcionalidad para que solo los propietarios puedan editar sus propias tareas.

3. **Autenticación con JWT**: La autenticación mediante JWT funciona, pero no se verifica adecuadamente en algunos endpoints. Asegúrate de que todas las rutas sensibles estén correctamente protegidas y requieran un **token JWT** válido.

4. **Mejorar el manejo de errores**: Debes asegurarte de que, cuando se intente acceder o editar una tarea sin los permisos necesarios, el sistema devuelva el error adecuado (p. ej., **403 Forbidden**). Explora también otros errores que puedan ocurrir por casos extremos.

5. **Mejorar logs y mensajes de error**: Añade mensajes de error y logs más descriptivos para facilitar la depuración y el mantenimiento del código.

6. **Auditoría general de seguridad**: Realiza una auditoría general del código y busca cualquier otro posible fallo de seguridad o funcional que debas corregir.

> IMPORTANTE: No tomes estos objetivos como los únicos a cumplir. Todas las mejoras que puedas aportar para asegurar la seguridad y el correcto funcionamiento de la aplicación serán bienvenidas.
---

## 🚀 **Cómo probarlo**

Sigue estos pasos para levantar el proyecto y probarlo:

1. **Instala las dependencias**  
   Asegúrate de tener instaladas todas las dependencias necesarias ejecutando:
   ```bash
   yarn install
   ```

2. **Inicializa la base de datos**
   Una vez que hayas instalado las dependencias ejecuta el comando para inicializar la base de datos:
   ```bash
   yarn migrations:run
   ```

3. **Ejecuta el hasheo de las contraseñas en base de datos**
   ```bash
   yarn ts-node --files scripts/hash-user-passwords.ts
   ```

4. **Levanta el servidor de RabbitMQ (asume que tienes docker instalado y activado)**
   ```bash
   docker run -d --hostname rabbit --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   ```
   Si ya tenías el contenedor: `docker start rabbit`

5. **Arranca el servidor**  
   Inicia el proyecto con:
   ```bash
   yarn start
   ```

6. **Lanza peticiones en test.http**  
   Ya puedes empezar a lanzar peticiones predeifinidad del archivo `test.http`. Asume que tienes la extensión de VSCode REST Client. No olvides cambiar el puerto y el nuevo token, una vez obtenidos.

---

¡Listo! Ahora puedes empezar a trabajar en los errores y enviar tu contribución para asegurar que la aplicación funcione correctamente y sin vulnerabilidades.
