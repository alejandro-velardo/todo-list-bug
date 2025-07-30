
# 📝 ¿ Qué se ha cambiado ? 🔒

Tras un repaso del proyecto, se han podido hacer diversos cambios en diversos sentidos:

#### **Protección**
Se han protegido los endpoints de `GET /tasks`, `GET /task/:id`, `PUT /task/:id` (se ha cambiado la lógica del endpoint y el tipo de POST a PUT - más convencional) mediante el uso de guards de Nest.

Ahora el endpoint `GET /tasks` solo devuelve las contraseñas del usuario validado.
`GET /task/:id`, `PUT /task/:id` solo permiten consultar y hacer cambios al usuario si tiene un token valido.

 
#### **Autenticación con JWT**
Se reemplazó la constante jwtConstants.secret por una lectura desde ConfigService para evitar hardcodeo y facilitar la configuración por entorno. Se ha borrado el archivo constants.ts.


#### **Mejorar el manejo de errores**
Se han añadido nuevos tipos de excepciones a la capa de servicios y se han añadido archivos con DTOs para validar los cuerpos de las solicitudes HTTP, con mensajes de error predeterminado según el tipo de fallo.

También se han añadido otro tipo de logs ante errores y se ha usado el tipo de error adecuado en cada caso.

#### **Auditoría general de seguridad**
Se han retirado variables sensibles del codigo del proyecto guardandolas usando ConfigService. Se ha añadaido un script para hashear todas las contraseñas de base de datos usando bcrypt, y se ha cambiado el metodo de crear un usuario para no guardar una contraseña en texto plano en base de datos -  más seguro.
Se ha forzado el uso de contraseñas más seguras (16 carácteres, mayus/minus y chars. especiales) para el registro.

#### **Otros**
Se han cambiado los tests , cuando ha sido necesario, para que pasaran una vez implementados estos cambios. Se ha añadido un archivo test.http para probar la API. 

#### **Bonus PoC**
Se ha implementadoun microservicio usando RabbitMQ y Nodemailer, como PoC, que envia un correo al usuario tras su registro. 


## 🚀 **Cómo probarlo**

Sigue estos pasos para levantar el proyecto y probarlo:

0. **Clona el repositorio**
    ```bash
   git clone https://github.com/alejandro-velardo/todo-list-bug.git
    ```
1. **Cambia a la rama debug-refactor**
    ```bash
   git checkout debug-refactor
    ```
2. **Instala las dependencias**  
   Asegúrate de tener instaladas todas las dependencias necesarias ejecutando:
   ```bash
   yarn install
   ```

3. **Inicializa la base de datos**
   Una vez que hayas instalado las dependencias ejecuta el comando para inicializar la base de datos:
   ```bash
   yarn migrations:run
   ```

4. **Ejecuta el hasheo de las contraseñas en base de datos**
   ```bash
   yarn ts-node --files scripts/hash-user-passwords.ts
   ```
5. **Creau un archivo `.env` con las variables `PORT` y `SECRET`, y si qse quiere usar el microservicio de notificaciones al registrar usuario `MAILER_PASS`, `MAILER_USER` (si no no funcionará)**


6. **Levanta el servidor de RabbitMQ (asume que tienes docker instalado y activado)**
   ```bash
   docker run -d --hostname rabbit --name rabbit -p 5672:5672 -p 15672:15672 rabbitmq:3-management
   ```
   Si ya tenías el contenedor: `docker start rabbit`

7. **Arranca el servidor**  
   Inicia el proyecto con:
   ```bash
   yarn start
   ```

8. **Lanza peticiones en test.http**  
   Ya puedes empezar a lanzar peticiones predeifinidad del archivo `test.http`. Asume que tienes la extensión de VSCode REST Client.
