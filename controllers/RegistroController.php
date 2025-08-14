<?php

namespace Controllers;

use Model\Dia;
use Model\Hora;
use MVC\Router;
use Model\Evento;
use Model\Paquete;
use Model\Ponente;
use Model\Usuario;
use Model\Registro;
use Model\Categoria;
use Model\EventosRegistros;
use Model\Regalo;

class RegistroController {

    public static function crear(Router $router) {
        if (!is_auth()) {
            header('Location: /');
            return;
        }

        $registro = Registro::where('usuario_id', $_SESSION['id']);

        if(isset($registro) && ($registro->paquete_id === "3" || $registro->paquete_id === "2" )) {
            header('Location: /boleto?id=' . urlencode($registro->token));
            return;
        }

        if(isset($registro->regalo_id) && $registro->paquete_id === "1") {
            header('Location: /finalizar-registro/conferencias');
            return;
        }

        $router->render('registro/crear', [
            'titulo' => 'Finalizar Registro'
        ]);
    }

    public static function gratis(Router $router) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!is_auth()) {
                header('Location: /login');
                exit;
            }

            $registro = Registro::where('usuario_id', $_SESSION['id']);
            if (isset($registro) && $registro->paquete_id === "3") {
                header('Location: /boleto?id=' . urlencode($registro->token));
                exit;
            }

            $token = substr(md5(uniqid(rand(), true)), 0, 8);

            $datos = [
                'paquete_id' => 3,
                'pago_id' => '',
                'token' => $token,
                'usuario_id' => $_SESSION['id']
            ];

            $registro = new Registro($datos);
            $resultado = $registro->guardar();

            if ($resultado) {
                header('Location: /boleto?id=' . urlencode($registro->token));
                exit;
            }
        }
    }

    public static function boleto(Router $router) {
        $id = $_GET['id'] ?? null;

        // Validar que el ID exista y tenga 8 caracteres
        if (!$id || strlen($id) !== 8) {
            header('Location: /');
            exit;
        }

        $registro = Registro::where('token', $id);
        if (!$registro) {
            header('Location: /');
            exit;
        }

        // Completar datos relacionados
        $registro->usuario = Usuario::find($registro->usuario_id);
        $registro->paquete = Paquete::find($registro->paquete_id);

        $router->render('registro/boleto', [
            'titulo' => 'Asistencia a DigitechCamp',
            'registro' => $registro
        ]);
    }

    public static function pagar(Router $router) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!is_auth()) {
                header('Location: /login');
                exit;
            }

            if (empty($_POST)) {
                echo json_encode([]);
                exit;
            }

            $datos = $_POST;
            $datos['token'] = substr(md5(uniqid(rand(), true)), 0, 8);
            $datos['usuario_id'] = $_SESSION['id'];

            try {
                $registro = new Registro($datos);
                $resultado = $registro->guardar();
                echo json_encode(['resultado' => $resultado]);
            } catch (\Throwable $th) {
                echo json_encode(['resultado' => 'error']);
            }
        }
    }

    public static function conferencias(Router $router) {
        if (!is_auth()) {
            header('Location: /login');
            exit;
        }
    
        $usuario_id = $_SESSION['id'];
        $registro = Registro::where('usuario_id', $usuario_id);
    
        // Redirecciones según paquete comprado
        if ($registro && $registro->paquete_id === "2") {
            header('Location: /boleto?id=' . urlencode($registro->token));
            exit;
        }
    
        if (!$registro || $registro->paquete_id !== "1") {
            header('Location: /');
            exit;
        }
    
        // Si es POST, procesamos el formulario AJAX
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
            // Forzar respuesta JSON
            header('Content-Type: application/json');
    
            $eventos_post = $_POST['eventos'] ?? '';
            $regalo_id = $_POST['regalo_id'] ?? null;
    
            // Validar datos
            if (empty($eventos_post) || !$regalo_id) {
                echo json_encode(['resultado' => false, 'mensaje' => 'Datos incompletos']);
                exit;
            }
    
            $eventos_ids = explode(',', $eventos_post);
    
            if (count($eventos_ids) === 0) {
                echo json_encode(['resultado' => false, 'mensaje' => 'No hay eventos seleccionados']);
                exit;
            }
    
            // Recargamos el registro para evitar problemas
            $registro = Registro::where('usuario_id', $usuario_id);
    
            if (!$registro || $registro->paquete_id !== "1") {
                echo json_encode(['resultado' => false, 'mensaje' => 'Registro inválido']);
                exit;
            }
    
            $eventos_array = [];
            foreach ($eventos_ids as $evento_id) {
                $evento = Evento::find($evento_id);
                if (!$evento || $evento->disponibles === "0") {
                    echo json_encode(['resultado' => false, 'mensaje' => 'Evento no disponible']);
                    exit;
                }
                $eventos_array[] = $evento;
            }
    
            // Disminuir disponibilidad y crear relación registro-evento
            foreach ($eventos_array as $evento) {
                $evento->disponibles = max(0, $evento->disponibles - 1);
                $evento->guardar();
    
                $datos = [
                    'evento_id' => (int)$evento->id,
                    'registro_id' => (int)$registro->id
                ];
    
                $registro_usuario = new EventosRegistros($datos);
                $registro_usuario->guardar();
            }
    
            // Guardar regalo
            $registro->regalo_id = $regalo_id;
            $resultado = $registro->guardar();
    
            if ($resultado) {
                echo json_encode([
                    'resultado' => true,
                    'token' => $registro->token
                ]);
            } else {
                echo json_encode(['resultado' => false, 'mensaje' => 'Error al guardar el regalo']);
            }
            exit;
        }
    
        // Si no es POST, cargamos la vista normalmente
    
        $eventos = Evento::ordenar('hora_id', 'ASC');
        $eventos_formateados = [];
    
        foreach ($eventos as $evento) {
            $evento->categoria = Categoria::find($evento->categoria_id);
            $evento->dia = Dia::find($evento->dia_id);
            $evento->hora = Hora::find($evento->hora_id);
            $evento->ponente = Ponente::find($evento->ponente_id);
    
            if ($evento->dia_id === "1" && $evento->categoria_id === "1") {
                $eventos_formateados['conferencias_v'][] = $evento;
            }
            if ($evento->dia_id === "2" && $evento->categoria_id === "1") {
                $eventos_formateados['conferencias_s'][] = $evento;
            }
            if ($evento->dia_id === "1" && $evento->categoria_id === "2") {
                $eventos_formateados['workshops_v'][] = $evento;
            }
            if ($evento->dia_id === "2" && $evento->categoria_id === "2") {
                $eventos_formateados['workshops_s'][] = $evento;
            }
        }
    
        $regalos = Regalo::all('ASC');
    
        $router->render('registro/conferencias', [
            'titulo' => 'Elige Workshops y Conferencias',
            'eventos' => $eventos_formateados,
            'regalos' => $regalos
        ]);
    }
    
}
