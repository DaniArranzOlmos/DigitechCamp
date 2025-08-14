<main class="devwebcamp">
    <h2 class="devwebcamp__heading"><?php echo $titulo; ?></h2>
    <p class="devwebcamp__descripcion">Conoce la conferencia más importante de Europa</p>

    <div class="devwebcamp__grid">
        <div <?php aos_animacion(); ?> class="devwebcamp__imagen">
            <picture>
                <source srcset="build/img/sobre_digitechcamp.avif" type="image/avif">
                <source srcset="build/img/sobre_digitechcamp.webp" type="image/webp">
                <img loading="lazy" width="200" height="300" src="build/img/sobre_digitechcamp.jpg" alt="Imagen DigitechCamp">
            </picture>
        </div>

        <div  class="devwebcamp__contenido">
            <p <?php aos_animacion(); ?> class="devwebcamp__texto">Digitech Camp es un evento formativo centrado en el mundo del desarrollo web y la programación, pensado para estudiantes, profesionales y entusiastas de la tecnología. Reúne a expertos del sector que comparten sus conocimientos a través de ponencias, talleres y demostraciones prácticas.</p>
            
            <p <?php aos_animacion(); ?> class="devwebcamp__texto">El evento consiste en dos jornadas intensivas dedicadas al aprendizaje y la inspiración en el mundo del desarrollo. Durante estos dos días, profesores y expertos en programación presentarán los distintos lenguajes que se abordarán, mostrando tanto sus fundamentos como sus aplicaciones prácticas. El objetivo es que los asistentes descubran el potencial de cada tecnología y comprendan hasta dónde pueden llegar con ellas en proyectos reales.</p>
        </div>
    </div>
</main>