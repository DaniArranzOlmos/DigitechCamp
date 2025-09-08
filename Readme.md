# 🎓 DigitechCamp - Feria Tecnológica (TFG)

**DigitechCamp** es un proyecto desarrollado como **Trabajo Fin de Grado (TFG)**. Se trata de una feria tecnológica enfocada en **desarrollo de software y ciberseguridad**, pensada para el instituto como un espacio de innovación, aprendizaje y networking.

El objetivo principal fue **diseñar y desarrollar una aplicación web funcional** que gestionase el evento, desde la publicación de conferencias y workshops hasta la compra de entradas online.

---

## 🌐 Estructura del proyecto

El sistema está dividido en dos partes principales:

### 🔹 Parte pública
- Visualización de las **conferencias** y **workshops** programados.  
- Compra de entradas con distintos precios y categorías.  
- Pasarela de pago integrada con **PayPal Developer** (modo sandbox).  
- Registro de usuarios y **confirmación de alta mediante correo electrónico** (enviado a través de **Mailtrap** en modo desarrollo).  
- Interfaz sencilla e intuitiva para los asistentes.  

### 🔹 Parte privada (administración)
- Gestión de **ponencias y workshops**.  
- Administración de **ponentes** (altas, modificaciones y bajas).  
- Control de **entradas vendidas**.  
- Gestión de **usuarios y administradores**.  
- Configuración general del evento.  

---

## ✨ Experiencia del usuario

En **DigitechCamp** quisimos que la experiencia del usuario fuera **clara, segura y completa**. Algunas de las funcionalidades clave para los asistentes son:

- 📝 **Registro de usuarios**: cualquier persona puede crear su cuenta de manera sencilla.  
- 📧 **Confirmación de registro por correo**: al registrarse, se envía un correo electrónico de confirmación. En modo desarrollo, se utiliza **Mailtrap** para simular el envío de forma segura.  
- 🎟️ **Compra de entradas online**: integración con **PayPal Developer** para pagos rápidos y seguros.  
- 📅 **Agenda de conferencias y workshops**: el usuario puede ver fácilmente los horarios y temáticas de las ponencias.  
- 💻 **Interfaz intuitiva y responsive**: todo pensado para que navegar por la feria sea fácil y agradable.  

> 💡 **Tip para desarrolladores:** Para que los correos se envíen a tu propia bandeja, reemplaza las credenciales de emailHost por las de tu cuenta de Mailtrap o cualquier otro proveedor SMTP que prefieras.  

---

## 🚀 Funcionalidades destacadas
- 📅 **Agenda dinámica**: listado de conferencias y workshops.  
- 🎟️ **Compra de entradas online**: integración con PayPal.  
- 📧 **Confirmación de registro por correo electrónico** mediante Mailtrap.  
- 👨‍💻 **Gestión de ponentes, usuarios y administradores**.  
- 🛠️ **Panel de administración** para mantener el evento actualizado.  
- 💾 **Base de datos en MySQL** para almacenar información de ponentes, entradas y usuarios.  

---

## 🛠️ Tecnologías utilizadas
- **PHP** → Lógica del lado del servidor.  
- **MySQL** → Base de datos relacional.  
- **JavaScript (JS)** → Funcionalidad dinámica en la interfaz.  
- **HTML5 & CSS3** → Estructura y estilos del sitio web.  
- **PayPal Developer** → Pasarela de pago para la compra de entradas.  
- **Mailtrap** → Emulación de envío de correos electrónicos.  

---

## 📂 Estructura del proyecto
- **/Controllers** → Lógica de negocio (manejo de peticiones).  
- **/Models** → Conexión a la base de datos y consultas.  
- **/Views** → Interfaz de usuario y plantillas.  
- **/Db** → Script de conexión a MySQL y configuración.  
- **/screenshots** → Capturas de pantalla del proyecto.  

---

## 📸 Capturas de pantalla
*(Ejemplo de cómo añadir imágenes cuando las subas a /screenshots en tu repo)*  

- **Página principal**  
  ![Home](./screenshots/home.png)  

- **Agenda de conferencias**  
  ![Agenda](./screenshots/agenda.png)  

- **Compra de entradas**  
  ![Entradas](./screenshots/entradas.png)  

- **Confirmación de correo en Mailtrap**  
  ![Correo](./screenshots/mailtrap.png)  

- **Panel de administración**  
  ![Admin](./screenshots/admin.png)  

---

## 📧 Configuración de Mailtrap
Este proyecto utiliza [**Mailtrap**](https://mailtrap.io/) para emular el envío de correos electrónicos en un entorno de desarrollo.  

- Al registrarse un usuario, se envía un correo de confirmación que llega a la bandeja de Mailtrap.  
- Para habilitar esta función, debes crear una cuenta en Mailtrap y reemplazar las credenciales de emailHost en la configuración del proyecto por las tuyas propias.  

Ejemplo de configuración (PHP):  

```php
$mail->Host = 'sandbox.smtp.mailtrap.io';
$mail->Username = 'TU_USERNAME';
$mail->Password = 'TU_PASSWORD';
⚙️ Instalación y ejecución
Para instalar y ejecutar DigitechCamp en tu entorno local:

Clonar el repositorio:

bash
Copiar código
git clone https://github.com/DaniArranzOlmos/DigitechCamp.git
Iniciar programa
En una terminal ejecuta:

bash
Copiar código
npm install
npm run dev
En otra terminal:

bash
Copiar código
composer install
cd public/
php -S localhost:3000
arduino
Copiar código
