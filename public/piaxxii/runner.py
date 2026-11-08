# Ejecuta "La nau PiaXXII" en el navegador (Pyodide) sin modificar el código del juego.
#
# El juego usa input(), que en el navegador no puede quedarse esperando. Por eso cada vez que el
# jugador escribe algo, la partida se vuelve a ejecutar desde el principio con la misma semilla
# aleatoria y todas las respuestas anteriores. Como el resultado es determinista, la salida es la
# misma de antes más lo nuevo. Cuando el juego pide una respuesta que todavía no existe,
# se detiene y la web espera a que el jugador escriba.
import builtins
import importlib
import io
import random
import sys

sys.path.insert(0, "/game")


class EsperandoEntrada(Exception):
    pass


historial = []
semilla = random.randrange(2**32)


def nueva_partida():
    global semilla
    historial.clear()
    semilla = random.randrange(2**32)


def ejecutar(entrada=None):
    """Ejecuta la partida con todas las respuestas dadas. Devuelve (texto, terminada)."""
    # Desde JavaScript "sin entrada" puede llegar como None o como null de JS (JsNull)
    if isinstance(entrada, str):
        historial.append(entrada)

    salida = io.StringIO()
    usadas = 0

    def input_web(pregunta=""):
        nonlocal usadas
        salida.write(pregunta)
        if usadas < len(historial):
            respuesta = historial[usadas]
            usadas += 1
            salida.write(respuesta + "\n")
            return respuesta
        raise EsperandoEntrada()

    # Módulos del juego recién cargados: ningún estado de una ejecución pasa a la siguiente
    for nombre in list(sys.modules):
        modulo = sys.modules[nombre]
        if getattr(modulo, "__file__", "") and modulo.__file__.startswith("/game/"):
            del sys.modules[nombre]

    random.seed(semilla)
    input_original, stdout_original = builtins.input, sys.stdout
    builtins.input, sys.stdout = input_web, salida
    terminada = False
    try:
        importlib.import_module("main").main()
        terminada = True
    except EsperandoEntrada:
        pass
    finally:
        builtins.input, sys.stdout = input_original, stdout_original

    return salida.getvalue(), terminada
