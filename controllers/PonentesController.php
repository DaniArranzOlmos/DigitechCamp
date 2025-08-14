<?php

namespace Controllers;
use Classes\Paginacion;
use Model\Ponente;
use MVC\Router;
use Intervention\Image\ImageManagerStatic as Image;

class PonentesController {
    public static function index(Router $router) {
        $pagina_actual = $_GET['page'];
        $pagina_actual = filter_var($pagina_actual, FILTER_VALIDATE_INT);
        if (!$pagina_actual || $pagina_actual < 1) {
            header('Location: /admin/ponentes?page=1');
        }

        $registros_por_pagina = 10;
        $total=Ponente::total();
        $paginacion = new Paginacion($pagina_actual, $registros_por_pagina, $total);
        if ($paginacion->total_paginas() < $paginacion->pagina_actual) {
            header('Location: /admin/ponentes?page=1');
        }        
        $ponentes = Ponente::paginar($registros_por_pagina, $paginacion->offset());

        if(!is_admin()) {
            header('Location: login');
        }

        $router->render('admin/ponentes/index', [
            'titulo' => 'Ponentes /Conferencistas', 
            'ponentes' => $ponentes,
            'paginacion' => $paginacion->paginacion(),
        ]);
    }

    public static function crear(Router $router) {
        $alertas = [];
        $ponente = new Ponente;

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if(!is_admin()) {
                header('Location: ../login');
            }

            // Procesar imagen
            if (!empty($_FILES['imagen']['tmp_name'])) {
                $carpeta_imagenes = '../public/img/speakers';
                if (!is_dir($carpeta_imagenes)) {
                    mkdir($carpeta_imagenes, 0755, true);
                }

                // Crear dos versiones (PNG y WebP)
                $imagen_original = Image::make($_FILES['imagen']['tmp_name'])->fit(800, 800);
                $imagen_png = clone $imagen_original;
                $imagen_webp = clone $imagen_original;

                $imagen_png = $imagen_png->encode('png', 80);
                $imagen_webp = $imagen_webp->encode('webp', 80);

                $nombre_imagen = md5(uniqid(rand(), true));

                $_POST['imagen'] = $nombre_imagen;
            }

            $_POST['redes'] = json_encode($_POST['redes'] ?? [], JSON_UNESCAPED_SLASHES);

            $_POST['tags'] = $_POST['tags'] ?? '';

            // Sincronizar y validar
            $ponente->sincronizar($_POST);
            $alertas = $ponente->validar();

            if (empty($alertas)) {
                if (isset($imagen_png) && isset($imagen_webp)) {
                    $imagen_png->save($carpeta_imagenes . '/' . $nombre_imagen . '.png');
                    $imagen_webp->save($carpeta_imagenes . '/' . $nombre_imagen . '.webp');
                }

                $resultado = $ponente->guardar();
                if ($resultado) {
                    header('Location: /admin/ponentes');
                }
            }
        }

        $router->render('admin/ponentes/crear', [
            'titulo' => 'Registrar Ponente',
            'alertas' => $alertas,
            'ponente' => $ponente
        ]);
    }

    public static function editar(Router $router) {
        $alertas = [];

        $id = $_GET['id'];
        error_log('ID recibido en editar(): ' . $_GET['id']);

        $id = filter_var($id, FILTER_VALIDATE_INT);
        if (!$id) {
            header('Location: /admin/ponentes');
        }

        $ponente = Ponente::find($id);
        if (!$ponente) {
            header('Location: /admin/ponentes');
        }

        $ponente->imagen_actual = $ponente->imagen;

        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            if(!is_admin()) {
                header('Location: login');
            }
            // Procesar imagen
            if (!empty($_FILES['imagen']['tmp_name'])) {
                $carpeta_imagenes = '../public/img/speakers';
                if (!is_dir($carpeta_imagenes)) {
                    mkdir($carpeta_imagenes, 0755, true);
                }

                
                $imagen_png = Image::make($_FILES['imagen']['tmp_name'])->fit(800, 800)->encode('png', 80);
                $imagen_webp = Image::make($_FILES['imagen']['tmp_name'])->fit(800, 800)->encode('webp', 80);                

                $nombre_imagen = md5(uniqid(rand(), true));

                $_POST['imagen'] = $nombre_imagen;
            } else {
                $_POST['imagen'] = $ponente->imagen_actual;
            }
            $_POST['redes'] = json_encode($_POST['redes'] ?? [], JSON_UNESCAPED_SLASHES);
            $ponente->sincronizar($_POST);
            $alertas = $ponente->validar();

            if (empty($alertas)) {
                if ($nombre_imagen) {
                    $imagen_png->save($carpeta_imagenes . '/' . $nombre_imagen . '.png');
                    $imagen_webp->save($carpeta_imagenes . '/' . $nombre_imagen . '.webp');
                }
                $resultado = $ponente->guardar();
                if ($resultado) {
                    header('Location: /admin/ponentes');
                }
            }
        }


        $router->render('admin/ponentes/editar', [
            'titulo' => 'Actualizar Ponente',
            'alertas' => $alertas,
            'ponente' => $ponente, 
            'redes' => json_decode($ponente->redes, true)
        ]);
    }

    public static function eliminar(Router $router) {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = $_POST['id'];
            $ponente = Ponente::find($id);
            if ($ponente) {
                $ponente->eliminar();
                header('Location: /admin/ponentes');
            }
        }
    }

}
?>
