<main class="auth">
    <h2 class="auth__heading"> <?php echo $titulo;?> </h2>
    <p class="auth__texto">Ecribe tu nueva contraseña</p>

    <?php require_once __DIR__ . '/../templates/alertas.php'; ?>
    <?php if($token_valido): ?>
    <form method="POST" class="formulario">
        <div class="formulario__campo">
            <label for="password" class="formulario__label">Nueva Contraseña</label>
            <input 
            type="password" 
            class="formulario__input" 
            placeholder="Nueva Contraseña" 
            id="password" 
            name="password">
        </div>
        
        <input type="submit" class="formulario__submit" value="Guardar nueva contraseña">
    </form>
    <?php endif; ?>
        <div class="acciones--centrar">
            <a href="/login" class="acciones__enlace">Iniciar Sesión</a>
        </div>
    <div class=acciones>
        <a href="/login" class="acciones__enlace">¿Ya tienes cuenta Iniciar? sesión</a>
        <a href="/registro" class="acciones__enlace">¿Aún no tienes cuenta? Obtener una</a>

    </div>

</main>