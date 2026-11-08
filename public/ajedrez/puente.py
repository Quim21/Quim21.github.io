# Conecta el tablero de la web con el ajedrez original (QuimPerez_Escacs.py) sin reescribir sus reglas.
#
# Cada jugada del tablero se convierte en las dos respuestas que pediría el juego por consola
# ("E7" y luego "E5") y se pasa a la función moviment() del juego, que valida y mueve la pieza.
# Si el juego rechaza la jugada, vuelve a preguntar; en ese momento le respondemos "abandonar"
# para que termine sin tocar el tablero, y descartamos lo que haya escrito a partir de ahí.
import builtins
import io
import json
import sys

sys.path.insert(0, "/ajedrez")
import QuimPerez_Escacs as escacs  # noqa: E402

JUGADORS = ["Blanques", "Negres"]
COLUMNES = "abcdefgh"
REIS = ("[♔]", "[♚]")

torn = 0
acabada = False
missatge = ""


def casella(fila, col):
    """Coordenada en el formato que pide el juego: la fila 0 del tauler es la 1."""
    return f"{COLUMNES[col]}{fila + 1}"


def _consola(respostes, funcio, *args):
    """Ejecuta una función del juego contestando a sus input() con `respostes`.

    Devuelve (resultado, texto escrito, rechazada). Es rechazada si el juego
    pidió más respuestas de las que había.
    """
    pendents = list(respostes)
    sortida = io.StringIO()
    tall = None

    def input_web(_pregunta=""):
        nonlocal tall
        if pendents:
            return pendents.pop(0)
        if tall is None:
            tall = sortida.tell()
        return "abandonar"

    input_original, stdout_original = builtins.input, sys.stdout
    builtins.input, sys.stdout = input_web, sortida
    try:
        resultat = funcio(*args)
    finally:
        builtins.input, sys.stdout = input_original, stdout_original

    text = sortida.getvalue()
    if tall is not None:
        text = text[:tall]
    return resultat, text, tall is not None


def _ultima_linia(text):
    linies = [l for l in text.splitlines() if l.strip()]
    return linies[-1] if linies else ""


def _foto():
    return (
        [fila[:] for fila in escacs.tauler],
        escacs.peces_eliminades_blanques[:],
        escacs.peces_eliminades_negres[:],
    )


def _restaurar(foto):
    tauler, blanques, negres = foto
    escacs.tauler[:] = [fila[:] for fila in tauler]
    escacs.peces_eliminades_blanques[:] = blanques
    escacs.peces_eliminades_negres[:] = negres


def estat():
    return json.dumps(
        {
            "tauler": escacs.tauler,
            "eliminadesBlanques": escacs.peces_eliminades_blanques,
            "eliminadesNegres": escacs.peces_eliminades_negres,
            "torn": torn,
            "acabada": acabada,
            "missatge": missatge,
        },
        ensure_ascii=False,
    )


def nova_partida():
    global torn, acabada, missatge
    escacs.generacio_tauler()
    escacs.peces_eliminades_blanques.clear()
    escacs.peces_eliminades_negres.clear()
    torn = 0
    acabada = False
    missatge = ""
    return estat()


def seleccionar(fila, col):
    """Usa detectar_moviment() del juego. Devuelve {valida, missatge, desti: [[f, c], ...]}."""
    valida, text, _ = _consola([], escacs.detectar_moviment, torn, fila, col)
    desti = []
    if valida and not acabada:
        # Prueba cada casilla con moviment() y deshace la jugada: así las casillas marcadas
        # salen exactamente de las reglas del juego.
        foto = _foto()
        for f in range(escacs.files):
            for c in range(escacs.cols):
                if (f, c) == (fila, col):
                    continue
                resultat, _, rebutjada = _consola([casella(fila, col), casella(f, c)], escacs.moviment, torn, JUGADORS)
                if not rebutjada and resultat != "ABANDONAR":
                    desti.append([f, c])
                _restaurar(foto)
    return json.dumps({"valida": bool(valida), "missatge": _ultima_linia(text), "desti": desti}, ensure_ascii=False)


def moure(fila, col, fila2, col2):
    """Juega una jugada con moviment(). Devuelve {ok, missatge, peca, capturada} y el estado nuevo."""
    global torn, acabada, missatge
    if acabada:
        return json.dumps({"ok": False, "missatge": missatge})

    peca = escacs.tauler[fila][col]
    capturada = escacs.tauler[fila2][col2]
    resultat, text, rebutjada = _consola([casella(fila, col), casella(fila2, col2)], escacs.moviment, torn, JUGADORS)
    if rebutjada or resultat == "ABANDONAR":
        return json.dumps({"ok": False, "missatge": _ultima_linia(text)}, ensure_ascii=False)

    # Mismo mensaje que escribe escacs() después de cada jugada
    missatge = f"El jugador {JUGADORS[torn]} mou la peça a la casella {resultat}"

    # El juego original no detecta el jaque mate; en la web la partida acaba al capturar el rey
    if capturada in REIS:
        acabada = True
        missatge = f"Rei capturat! Guanyen les {JUGADORS[torn]}."
    else:
        torn = escacs.torns(torn)

    return json.dumps({"ok": True, "missatge": missatge, "peca": peca, "capturada": capturada}, ensure_ascii=False)


def abandonar():
    global acabada, missatge
    if not acabada:
        _, text, _ = _consola(["abandonar"], escacs.moviment, torn, JUGADORS)
        missatge = _ultima_linia(text)
        acabada = True
    return estat()
