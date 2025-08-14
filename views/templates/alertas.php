<?php foreach ($alertas as $key => $alerta): ?>
    <?php foreach ($alerta as $mensaje): ?>
        <div class="alerta alerta__<?php echo $key; ?>">
            <?php echo htmlspecialchars($mensaje); ?>
        </div>
    <?php endforeach; ?>
<?php endforeach; ?>
