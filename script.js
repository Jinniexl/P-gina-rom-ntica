
document.addEventListener("DOMContentLoaded", () => {
    // ==========================================
    // 1. ELEMENTOS DE LA PÁGINA
    // ==========================================

    const pantallas = document.querySelectorAll(
        "#inicio, #introduccion, #canciones, #playlist"
    );

    const botonSi = document.getElementById("boton-si");
    const botonNo = document.getElementById("boton-no");
    const botonContinuar = document.getElementById("boton-continuar");
    const botonPlaylist = document.getElementById("boton-playlist");
    const botonVolverInicio = document.getElementById("boton-volver-inicio");

    const reaccionNo = document.getElementById("reaccion-no");
    const gatito = document.getElementById("imagen-gatito");
    const mensajeBoton = document.getElementById("mensaje-boton");

    const fondoModal = document.getElementById("fondo-modal");
    const tituloModal = document.getElementById("titulo-modal");
    const textoModal = document.getElementById("texto-modal");
    const cerrarModal = document.getElementById("cerrar-modal");
    const botonCerrarModal = document.getElementById("boton-cerrar-modal");

    const explosion = document.getElementById("explosion-gatito");
    const imagenExplosion = document.getElementById("imagen-explosion");
    const sonidoExplosion = document.getElementById("sonido-explosion");
    const cerrarExplosion = document.getElementById("cerrar-explosion");

    let intentosNo = 0;
    let elementoAnteriorModal = null;

    // ==========================================
    // 2. CAMBIAR ENTRE PANTALLAS
    // ==========================================

    function mostrarPantalla(id) {
        const destino = document.getElementById(id);

        if (!destino || !Array.from(pantallas).includes(destino)) {
            console.error("No se encontró la pantalla:", id);
            return;
        }

        pantallas.forEach((pantalla) => {
            pantalla.classList.remove("activa");
            pantalla.hidden = true;
        });

        destino.hidden = false;
        destino.classList.add("activa");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    // ==========================================
    // 3. BOTÓN SÍ: ABRIR LA INTRODUCCIÓN
    // ==========================================

    if (botonSi) {
        botonSi.addEventListener("click", () => {
            mostrarPantalla("introduccion");
        });
    }

    // ==========================================
    // 4. BOTÓN NO: GATITOS Y SORPRESA
    // ==========================================

    const mensajesNo = [
        "¿No? ¿Estás seguro? ♡",
        "Piénsalo otra vez...",
        "Ese gatito está decepcionado contigo.",
        "Última oportunidad :("
    ];

    const gatos = [
        "assets/gato1.jfif",
        "assets/gato2.jfif",
        "assets/gato3.jfif",
        "assets/gato4.jfif"
    ];

    // Precargar los gatitos para evitar pausas al cambiar de imagen.
gatos.forEach((ruta) => {
    const imagen = new Image();
    imagen.src = ruta;
});

    function cerrarEfectoExplosion() {
        if (explosion) {
            explosion.hidden = true;
            explosion.classList.remove("explosion-activa");
        }

        if (sonidoExplosion) {
            sonidoExplosion.pause();
            sonidoExplosion.currentTime = 0;
        }
    }

    if (cerrarExplosion) {
        cerrarExplosion.addEventListener("click", cerrarEfectoExplosion);
    }

    if (botonNo && botonSi && reaccionNo && gatito && mensajeBoton) {
        botonNo.addEventListener("click", () => {
            // Después de los cuatro mensajes, aparece la sorpresa.
            if (intentosNo >= mensajesNo.length) {
                if (explosion && imagenExplosion) {
                    explosion.hidden = false;

                    // Reinicia el GIF utilizando la ruta del HTML.
                    imagenExplosion.src = "assets/boom.gif";

                    if (sonidoExplosion) {
                        sonidoExplosion.currentTime = 0;

                        const reproduccion = sonidoExplosion.play();

                        if (reproduccion) {
                            reproduccion.catch(() => {
                                // El navegador puede bloquear el audio.
                            });
                        }
                    }
                }

                return;
            }

            // Mostrar el gatito y su mensaje.
            reaccionNo.hidden = false;
            gatito.src = gatos[intentosNo];
            gatito.alt = "Gatito de la reacción " + (intentosNo + 1);
            mensajeBoton.textContent = mensajesNo[intentosNo];

            // Reiniciar la animación del gatito.
            gatito.style.animation = "none";
            void gatito.offsetWidth;
            gatito.style.animation = "aparecer 0.3s ease both";

            intentosNo++;

            // El botón Sí parpadea cada vez más rápido.
            const velocidad = Math.max(
                0.15,
                0.8 - (intentosNo - 1) * 0.1
            );

            botonSi.style.setProperty(
                "--velocidad-parpadeo",
                `${velocidad}s`
            );

            botonSi.classList.add("parpadeo-si");
        });
    }

    // ==========================================
    // 5. CONTINUAR HACIA LAS CANCIONES
    // ==========================================

    if (botonContinuar) {
        botonContinuar.addEventListener("click", () => {
            mostrarPantalla("canciones");
        });
    }

    // ==========================================
    // 6. ABRIR LOS MENSAJES DE LAS CANCIONES
    // ==========================================

    function abrirModal(idMensaje, botonOrigen) {
        const mensaje = document.getElementById(idMensaje);

        if (!mensaje || !fondoModal || !tituloModal || !textoModal) {
            console.error("No se encontró el mensaje:", idMensaje);
            return;
        }

        elementoAnteriorModal = botonOrigen;

        const titulo = mensaje.querySelector("h2, h3, strong");
        const parrafos = mensaje.querySelectorAll("p");

        tituloModal.textContent = titulo
            ? titulo.textContent.trim()
            : "¿Por qué esta canción?";

        if (parrafos.length > 0) {
            textoModal.textContent = Array.from(parrafos)
                .map((parrafo) => parrafo.textContent.trim())
                .filter(Boolean)
                .join("\n\n");
        } else {
            textoModal.textContent = mensaje.textContent.trim();
        }

        fondoModal.hidden = false;
        document.body.classList.add("modal-abierto");

        if (cerrarModal) {
            cerrarModal.focus();
        }
    }

    document.querySelectorAll(".boton-mensaje").forEach((boton) => {
        boton.addEventListener("click", () => {
            const idMensaje = boton.dataset.mensaje;

            if (idMensaje) {
                abrirModal(idMensaje, boton);
            }
        });
    });

    // ==========================================
    // 7. CERRAR EL MODAL
    // ==========================================

    function cerrarVentanaModal() {
        if (!fondoModal) {
            return;
        }

        fondoModal.hidden = true;
        document.body.classList.remove("modal-abierto");

        if (
            elementoAnteriorModal &&
            document.contains(elementoAnteriorModal)
        ) {
            elementoAnteriorModal.focus();
        }

        elementoAnteriorModal = null;
    }

    if (cerrarModal) {
        cerrarModal.addEventListener("click", cerrarVentanaModal);
    }

    if (botonCerrarModal) {
        botonCerrarModal.addEventListener("click", cerrarVentanaModal);
    }

    if (fondoModal) {
        fondoModal.addEventListener("click", (evento) => {
            if (evento.target === fondoModal) {
                cerrarVentanaModal();
            }
        });
    }

    // ==========================================
    // 8. ABRIR LA PLAYLIST FINAL
    // ==========================================

    if (botonPlaylist) {
        botonPlaylist.addEventListener("click", () => {
            mostrarPantalla("playlist");
        });
    }

    // ==========================================
    // 9. VOLVER A EMPEZAR
    // ==========================================

    if (botonVolverInicio) {
        botonVolverInicio.addEventListener("click", () => {
            intentosNo = 0;

            if (reaccionNo) {
                reaccionNo.hidden = true;
            }

            if (gatito) {
                gatito.style.removeProperty("animation");
            }

            if (mensajeBoton) {
                mensajeBoton.textContent = "";
            }

            if (botonSi) {
                botonSi.classList.remove("parpadeo-si");
                botonSi.style.removeProperty("--velocidad-parpadeo");
            }

            cerrarVentanaModal();
            cerrarEfectoExplosion();
            mostrarPantalla("inicio");
        });
    }

    // ==========================================
    // 10. CERRAR VENTANAS CON ESCAPE
    // ==========================================

    document.addEventListener("keydown", (evento) => {
        if (evento.key !== "Escape") {
            return;
        }

        if (fondoModal && !fondoModal.hidden) {
            cerrarVentanaModal();
        }

        if (explosion && !explosion.hidden) {
            cerrarEfectoExplosion();
        }
    });

});


const botonLeerCarta = document.getElementById("boton-leer-carta");
const fondoModalCarta = document.getElementById("fondo-modal-carta");
const modalCarta = document.getElementById("modal-carta");
const botonCerrarCarta = document.getElementById("boton-cerrar-carta");
const cerrarCarta = document.getElementById("cerrar-carta");


function abrirCarta() {
    fondoModalCarta.hidden = false;
    document.body.style.overflow = "hidden";
    cerrarCarta.focus();

    lanzarCorazones(); // ♡ ¡Aquí aparece la animación!
}

function cerrarCartaModal() {
    fondoModalCarta.hidden = true;
    document.body.style.overflow = "";
    botonLeerCarta.focus();
}

botonLeerCarta.addEventListener("click", abrirCarta);
botonCerrarCarta.addEventListener("click", cerrarCartaModal);
cerrarCarta.addEventListener("click", cerrarCartaModal);

fondoModalCarta.addEventListener("click", (evento) => {
    if (evento.target === fondoModalCarta) {
        cerrarCartaModal();
    }
});

document.addEventListener("keydown", (evento) => {
    if (
        evento.key === "Escape" &&
        !fondoModalCarta.hidden
    ) {
        cerrarCartaModal();
    }
});


function lanzarCorazones() {
    // Evitar que se acumulen animaciones
    const lluviaAnterior = document.querySelector(".lluvia-corazones");
    if (lluviaAnterior) lluviaAnterior.remove();

    // Respetar la preferencia de movimiento reducido
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    const lluvia = document.createElement("div");
    lluvia.className = "lluvia-corazones";
    lluvia.setAttribute("aria-hidden", "true");

    const colores = ["#E8B7C8", "#A85D76", "#C9A45C", "#F3A6BD"];

    for (let i = 0; i < 14; i++) {
        const corazon = document.createElement("span");
        corazon.className = "corazon-flotante";
        corazon.textContent = Math.random() > 0.25 ? "♥" : "♡";

        corazon.style.setProperty(
            "--posicion-x",
            `${8 + Math.random() * 84}%`
        );
        corazon.style.setProperty(
            "--color-corazon",
            colores[Math.floor(Math.random() * colores.length)]
        );
        corazon.style.setProperty(
            "--tamano-corazon",
            `${12 + Math.random() * 17}px`
        );
        corazon.style.setProperty(
            "--duracion",
            `${1.5 + Math.random() * 1.2}s`
        );
        corazon.style.setProperty(
            "--retraso",
            `${Math.random() * 0.45}s`
        );
        corazon.style.setProperty(
            "--movimiento-x",
            `${-65 + Math.random() * 130}px`
        );

        lluvia.appendChild(corazon);
    }

    document.body.appendChild(lluvia);

    // Limpiar el efecto cuando termine
    setTimeout(() => lluvia.remove(), 3500);
}