/**
 * CARPINTECH - Interactive JavaScript
 * - Phone screen mockup switcher (6 real app views)
 * - Interactive 3D Furniture Modeler Simulator (Canvas 3D isometric renderer with rotation, material swap, piece counter)
 * - WhatsApp direct message builder
 * - Lightbox modal for HD app screenshots
 * - FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
  initAppScreenSwitcher();
  init3DSimulator();
  initWhatsAppForm();
  initLightbox();
  initFaqAccordion();
});

/* ==========================================================================
   1. SCREEN SWITCHER (MOCKUP INTERACTIVO DE LA APP)
   ========================================================================== */
const appScreensData = {
  'inicio': {
    title: 'Panel Principal del Taller',
    subtitle: 'Control total de tu taller, operarios y métricas clave en un solo vistazo.',
    img: './assets/app-screens/01-inicio-taller.jpeg',
    badge: 'ID Taller CARP-3847',
    highlights: ['2 miembros de equipo activos', 'Gestión rápida de pedidos y plantillas', 'Acceso directo a producción y reportes']
  },
  '3d': {
    title: 'Modelador 3D Táctil con Despiece',
    subtitle: 'Diseña cualquier mueble en 3D directo desde tu celular sin programas complejos.',
    img: './assets/app-screens/02-modelador-3d.jpeg',
    badge: 'Despiece exacto de 13 piezas',
    highlights: ['Medidas en milímetros o centímetros', 'Rotación orbital 360° en pantalla táctil', 'Exportación automática a lista de corte']
  },
  'produccion': {
    title: 'Seguimiento de Producción en Vivo',
    subtitle: 'Sigue cada etapa de armado y asigna trabajos a tus maestros carpinteros.',
    img: './assets/app-screens/03-produccion.jpeg',
    badge: 'Corte • Armado • Acabado',
    highlights: ['Asignación por operario (Maestro Simei Calle)', 'Progreso visual en porcentaje (100% Entregado)', 'Botón de visualización 3D para el operario']
  },
  'pedidos': {
    title: 'Gestión de Pedidos y Cotizaciones',
    subtitle: 'Convierte presupuestos en ventas al instante con precios en moneda local.',
    img: './assets/app-screens/04-pedidos.jpeg',
    badge: 'Integración WhatsApp Directa',
    highlights: ['Registro de montos (Ej. Bs 5,000)', 'Filtro por cliente y estado de entrega', 'Botón directo de chat para notificar al cliente']
  },
  'reportes': {
    title: 'Finanzas y Reportes de Ganancias',
    subtitle: 'Monitorea tus ingresos, cuentas por cobrar y abonos en tiempo real.',
    img: './assets/app-screens/05-reportes.jpeg',
    badge: 'Resumen Económico en Vivo',
    highlights: ['Ventas totales y porcentaje recaudado (60%)', 'Control estricto de abonos y saldos pendientes', 'Botón de registro instantáneo de pagos']
  },
  'clientes': {
    title: 'Directorio Inteligente de Clientes',
    subtitle: 'Historial de proyectos, teléfonos y comunicación directa sin intermediarios.',
    img: './assets/app-screens/06-clientes.jpeg',
    badge: 'Acción rápida en un toque',
    highlights: ['Llamada directa o mensaje de WhatsApp', 'Búsqueda instantánea por nombre o apellido', 'Asociación a proyectos anteriores']
  }
};

function initAppScreenSwitcher() {
  const tabs = document.querySelectorAll('.app-screen-tab-btn');
  const screenImg = document.getElementById('phoneMockupImg');
  const screenTitle = document.getElementById('activeScreenTitle');
  const screenDesc = document.getElementById('activeScreenDesc');
  const screenBadge = document.getElementById('activeScreenBadge');
  const screenList = document.getElementById('activeScreenHighlights');

  if (!tabs.length || !screenImg) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const screenKey = tab.dataset.screen;
      const data = appScreensData[screenKey];
      if (!data) return;

      // Animación suave de transición de imagen
      screenImg.style.opacity = '0';
      screenImg.style.transform = 'scale(0.96)';

      setTimeout(() => {
        screenImg.src = data.img;
        screenImg.alt = data.title;
        screenImg.style.opacity = '1';
        screenImg.style.transform = 'scale(1)';

        if (screenTitle) screenTitle.textContent = data.title;
        if (screenDesc) screenDesc.textContent = data.subtitle;
        if (screenBadge) screenBadge.textContent = data.badge;

        if (screenList) {
          screenList.innerHTML = data.highlights
            .map(item => `<li><span style="color:var(--caramel-accent); font-weight:bold;">✓</span> ${item}</li>`)
            .join('');
        }
      }, 200);
    });
  });
}

/* ==========================================================================
   2. SIMULADOR 3D INTERACTIVO (CANVAS ISOMÉTRICO 3D CON ROTACIÓN)
   ========================================================================== */
function init3DSimulator() {
  const canvas = document.getElementById('carpentryCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = canvas.parentElement.clientWidth || 600;
  let height = canvas.height = canvas.parentElement.clientHeight || 380;

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
    drawFurniture();
  });

  // Estado del modelo
  let angleX = 0.45;
  let angleY = 0.65;
  let isDragging = false;
  let startX = 0, startY = 0;
  let scale = 1.2;

  // Material seleccionado
  let currentMaterial = 'oak'; // oak, walnut, graphite, pine
  const materialsConfig = {
    oak: { top: '#d4a366', front: '#b78248', side: '#9c6b35', name: 'Roble Miel Cálido' },
    walnut: { top: '#5c3a21', front: '#452a16', side: '#321d0d', name: 'Nogal Americano' },
    graphite: { top: '#3b3d40', front: '#2b2c2e', side: '#1f2022', name: 'Melamina Grafito Mate' },
    pine: { top: '#e6c89c', front: '#cca874', side: '#ad8752', name: 'Pino Natural Nórdico' }
  };

  // Dimensiones configurables
  let deskWidth = 140; // cm
  let deskDepth = 60;  // cm
  let deskHeight = 75; // cm

  // Elementos de UI
  const widthSlider = document.getElementById('sliderWidth');
  const depthSlider = document.getElementById('sliderDepth');
  const heightSlider = document.getElementById('sliderHeight');

  const widthVal = document.getElementById('valWidth');
  const depthVal = document.getElementById('valDepth');
  const heightVal = document.getElementById('valHeight');
  const piecesCountDisplay = document.getElementById('totalPiecesDisplay');
  const areaDisplay = document.getElementById('totalAreaDisplay');

  function updateMetrics() {
    if (widthSlider && widthVal) {
      deskWidth = parseInt(widthSlider.value);
      widthVal.textContent = `${deskWidth} cm`;
    }
    if (depthSlider && depthVal) {
      deskDepth = parseInt(depthSlider.value);
      depthVal.textContent = `${deskDepth} cm`;
    }
    if (heightSlider && heightVal) {
      deskHeight = parseInt(heightSlider.value);
      heightVal.textContent = `${deskHeight} cm`;
    }

    // Cálculo dinámico de piezas del escritorio L como en la app Carpintech
    const basePieces = 13;
    const estimatedBoards = ((deskWidth * deskDepth * 2 + deskHeight * deskDepth * 4) / 10000).toFixed(2);
    
    if (piecesCountDisplay) piecesCountDisplay.textContent = `${basePieces} piezas`;
    if (areaDisplay) areaDisplay.textContent = `${estimatedBoards} m² melamina`;

    drawFurniture();
  }

  if (widthSlider) widthSlider.addEventListener('input', updateMetrics);
  if (depthSlider) depthSlider.addEventListener('input', updateMetrics);
  if (heightSlider) heightSlider.addEventListener('input', updateMetrics);

  // Material Swatches
  const swatchBtns = document.querySelectorAll('.swatch-btn');
  swatchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      swatchBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMaterial = btn.dataset.material || 'oak';
      drawFurniture();
    });
  });

  // Mouse / Touch Rotation
  canvas.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    angleY += dx * 0.008;
    angleX = Math.max(-0.2, Math.min(1.2, angleX + dy * 0.008));
    startX = e.clientX;
    startY = e.clientY;
    drawFurniture();
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }
  });

  canvas.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - startX;
    const dy = e.touches[0].clientY - startY;
    angleY += dx * 0.008;
    angleX = Math.max(-0.2, Math.min(1.2, angleX + dy * 0.008));
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    drawFurniture();
  });

  canvas.addEventListener('touchend', () => { isDragging = false; });

  // Controles de zoom y rotación
  const zoomInBtn = document.getElementById('btnZoomIn');
  const zoomOutBtn = document.getElementById('btnZoomOut');
  const resetBtn = document.getElementById('btnResetView');

  if (zoomInBtn) zoomInBtn.addEventListener('click', () => { scale = Math.min(2.0, scale + 0.15); drawFurniture(); });
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => { scale = Math.max(0.6, scale - 0.15); drawFurniture(); });
  if (resetBtn) resetBtn.addEventListener('click', () => { angleX = 0.45; angleY = 0.65; scale = 1.2; drawFurniture(); });

  // Proyección 3D a 2D
  function project(x, y, z) {
    const cx = Math.cos(angleY), sx = Math.sin(angleY);
    const cy = Math.cos(angleX), sy = Math.sin(angleX);

    // Rotar en Y
    const x1 = x * cx - z * sx;
    const z1 = x * sx + z * cx;

    // Rotar en X
    const y2 = y * cy - z1 * sy;
    const z2 = y * sy + z1 * cy;

    const fov = 500;
    const projScale = (fov / (fov + z2 + 250)) * scale;

    return {
      x: width / 2 + x1 * projScale,
      y: height / 2 + y2 * projScale,
      z: z2
    };
  }

  // Dibujar prisma rectangular 3D con sombreado
  function drawBox(ox, oy, oz, sx, sy, sz, colorMat, isMetalLeg = false) {
    const vertices = [
      project(ox, oy, oz),
      project(ox + sx, oy, oz),
      project(ox + sx, oy + sy, oz),
      project(ox, oy + sy, oz),
      project(ox, oy, oz + sz),
      project(ox + sx, oy, oz + sz),
      project(ox + sx, oy + sy, oz + sz),
      project(ox, oy + sy, oz + sz)
    ];

    const faces = [
      { indices: [0, 1, 2, 3], norm: [0, 0, -1], color: isMetalLeg ? '#222' : colorMat.front },
      { indices: [4, 5, 6, 7], norm: [0, 0, 1],  color: isMetalLeg ? '#333' : colorMat.front },
      { indices: [0, 1, 5, 4], norm: [0, -1, 0], color: isMetalLeg ? '#444' : colorMat.top },
      { indices: [2, 3, 7, 6], norm: [0, 1, 0],  color: isMetalLeg ? '#151515' : colorMat.side },
      { indices: [1, 2, 6, 5], norm: [1, 0, 0],  color: isMetalLeg ? '#2a2a2a' : colorMat.side },
      { indices: [0, 3, 7, 4], norm: [-1, 0, 0], color: isMetalLeg ? '#1a1a1a' : colorMat.side }
    ];

    faces.forEach(face => {
      const v0 = vertices[face.indices[0]];
      const v1 = vertices[face.indices[1]];
      const v2 = vertices[face.indices[2]];
      
      // Backface culling en espacio 2D
      const cross = (v1.x - v0.x) * (v2.y - v0.y) - (v1.y - v0.y) * (v2.x - v0.x);
      if (cross > 0) {
        ctx.beginPath();
        ctx.moveTo(v0.x, v0.y);
        for (let i = 1; i < face.indices.length; i++) {
          const vi = vertices[face.indices[i]];
          ctx.lineTo(vi.x, vi.y);
        }
        ctx.closePath();
        ctx.fillStyle = face.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });
  }

  function drawFurniture() {
    ctx.clearRect(0, 0, width, height);

    // Rejilla de taller en el fondo (como en la captura 02-modelador-3d.jpeg)
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    const gridStep = 30;
    for (let gx = -180; gx <= 180; gx += gridStep) {
      const p1 = project(gx, 70, -180);
      const p2 = project(gx, 70, 180);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    for (let gz = -180; gz <= 180; gz += gridStep) {
      const p1 = project(-180, 70, gz);
      const p2 = project(180, 70, gz);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    ctx.restore();

    const mat = materialsConfig[currentMaterial];

    // Escalar medidas proporcionales a pantalla
    const w = deskWidth * 0.9;
    const d = deskDepth * 0.9;
    const h = deskHeight * 0.8;
    const boardThick = 7;
    const legThick = 6;

    // 1. Tablero principal
    drawBox(-w / 2, -h / 2, -d / 2, w, boardThick, d, mat);

    // 2. Tablero en 'L' lateral
    const extW = w * 0.45;
    const extD = d * 1.1;
    drawBox(w / 2 - extW, -h / 2 + boardThick, d / 2, extW, boardThick, extD, mat);

    // 3. Patas metálicas tubulares modernas (como en la imagen 02-modelador-3d)
    const legHeight = h - boardThick;
    drawBox(-w / 2 + 10, -h / 2 + boardThick, -d / 2 + 8, legThick, legHeight, legThick, mat, true);
    drawBox(-w / 2 + 10, -h / 2 + boardThick, d / 2 - 14, legThick, legHeight, legThick, mat, true);
    drawBox(w / 2 - 16, -h / 2 + boardThick, -d / 2 + 8, legThick, legHeight, legThick, mat, true);
    
    // Pata soporte ala L
    drawBox(w / 2 - 16, -h / 2 + boardThick, d / 2 + extD - 14, legThick, legHeight, legThick, mat, true);

    // 4. Repisa o alzada de pantalla gamer (en madera cálida)
    const shelfMat = materialsConfig.oak;
    drawBox(-w / 2 + 20, -h / 2 - 14, -d / 2 + 6, w * 0.65, 4, 18, shelfMat);
    // Soportes de la repisa
    drawBox(-w / 2 + 25, -h / 2 - 10, -d / 2 + 10, 4, 10, 8, mat, true);
    drawBox(-w / 2 + w * 0.65 + 10, -h / 2 - 10, -d / 2 + 10, 4, 10, 8, mat, true);

    // Cotas y dimensiones flotantes en estilo Carpintech
    ctx.save();
    ctx.font = 'bold 11px Plus Jakarta Sans, sans-serif';
    ctx.fillStyle = '#c48e53';
    const topPt = project(0, -h / 2 - 25, 0);
    ctx.textAlign = 'center';
    ctx.fillText(`${deskWidth} cm (Ancho) × ${deskDepth} cm (Prof.)`, topPt.x, topPt.y);
    ctx.restore();
  }

  // Inicializar métricas y dibujar
  updateMetrics();
}

/* ==========================================================================
   3. GENERADOR DE MENSAJE Y ENLACE DE WHATSAPP DIRECTO
   ========================================================================== */
function initWhatsAppForm() {
  const form = document.getElementById('whatsappDirectForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('clientName')?.value.trim() || 'Colega Carpintero';
    const workshop = document.getElementById('clientWorkshop')?.value.trim() || 'Taller Independiente';
    const interest = document.getElementById('clientInterest')?.value || 'Prueba gratis de 14 días';
    const note = document.getElementById('clientNote')?.value.trim() || '';

    const message = `¡Hola equipo de Carpintech! 🪵📐\n\nMi nombre es *${name}* del taller *${workshop}*.\nEstoy interesado en: *${interest}*.\n${note ? `Consulta adicional: "${note}"\n` : ''}\nQuisiera activar mi demo y recibir asesoría para implementar Carpintech en mi taller. ¡Muchas gracias!`;

    // Número de contacto configurado
    const phone = '59175136136'; // Formato internacional
    const encodedMsg = encodeURIComponent(message);
    const waUrl = `https://wa.me/${phone}?text=${encodedMsg}`;

    window.open(waUrl, '_blank');
  });
}

/* ==========================================================================
   4. LIGHTBOX MODAL PARA VER CAPTURAS EN ALTA DEFINICIÓN
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('imageLightboxModal');
  const modalImg = document.getElementById('lightboxActiveImg');
  const closeBtn = document.getElementById('lightboxCloseBtn');

  if (!modal || !modalImg) return;

  const zoomTriggers = document.querySelectorAll('.zoomable-screen');
  zoomTriggers.forEach(el => {
    el.addEventListener('click', () => {
      const targetSrc = el.getAttribute('data-full-img') || el.src;
      modalImg.src = targetSrc;
      modal.classList.add('active');
    });
  });

  const closeModal = () => modal.classList.remove('active');

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });
}

/* ==========================================================================
   5. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-accordion-item');
  items.forEach(item => {
    const header = item.querySelector('.faq-accordion-header');
    if (!header) return;
    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ==========================================================================
   6. MODAL INTERACTIVO PLAY STORE & SIMULADOR DE INSTALACIÓN
   ========================================================================== */
function openPlayStoreModal() {
  const modal = document.getElementById('playStoreModal');
  if (modal) {
    modal.classList.add('active');
  }
}

function closePlayStoreModal() {
  const modal = document.getElementById('playStoreModal');
  if (modal) {
    modal.classList.remove('active');
  }
}

function simulateInstallApp() {
  const btn = document.getElementById('btnPlayInstall');
  const btnTxt = document.getElementById('installBtnText');
  const bar = document.getElementById('downloadSimBar');
  const fill = document.getElementById('downloadSimFill');
  const statusTxt = document.getElementById('downloadStatusTxt');

  if (!btn || !bar || !fill || !statusTxt) return;

  btn.disabled = true;
  btn.style.opacity = '0.7';
  bar.style.display = 'block';
  statusTxt.style.display = 'block';
  btnTxt.textContent = 'Descargando...';

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 18) + 12;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = '100%';
      statusTxt.textContent = '¡Descarga completada! Instalando...';

      setTimeout(() => {
        statusTxt.textContent = '✅ ¡Carpintech 3D instalado con éxito!';
        btnTxt.textContent = 'Abrir App';
        btn.disabled = false;
        btn.style.opacity = '1';
        btn.onclick = () => {
          alert('¡Carpintech 3D está listo para usar en tu celular! Puedes explorar los módulos en esta página.');
          closePlayStoreModal();
        };
      }, 900);
    } else {
      fill.style.width = `${progress}%`;
      statusTxt.textContent = `Descargando: ${progress}% (28.4 MB)`;
    }
  }, 250);
}

// Cerrar modal al presionar Escape o hacer clic fuera
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePlayStoreModal();
});

const playModal = document.getElementById('playStoreModal');
if (playModal) {
  playModal.addEventListener('click', (e) => {
    if (e.target === playModal) closePlayStoreModal();
  });
}

