/* ==========================================================
   Be Clean — Script unificado y optimizado
   Control global de roles, tabs, modales y módulos
   ========================================================== */

// ===== Configuración global =====
window.fxRate = 7.75; // Tipo de cambio base (Q → USD)

// ===== UTILIDADES GENERALES =====
function abrirModal(modal) {
  if (modal) modal.classList.add("open");
}
function cerrarModal(modal) {
  if (modal) modal.classList.remove("open");
}
function setTexto(el, valorQ) {
  if (!el) return;
  el.textContent = `Q ${valorQ.toFixed(2)} · US$ ${(valorQ / window.fxRate).toFixed(2)}`;
}
function sumarColumna(selector) {
  const celdas = document.querySelectorAll(selector);
  let total = 0;
  celdas.forEach((td) => {
    const texto = td.textContent || "";
    const match = texto.match(/Q\s*([\d.,]+)/);
    if (match) total += parseFloat(match[1].replace(",", "")) || 0;
  });
  return total;
}

// ===== MANEJO DE ROLES (Dueño / Empleado) =====
function configurarRoles() {
  const roleSelect = document.querySelector("#roleSelect");
  const badge = document.querySelector("#roleBadge");

  if (!roleSelect || !badge) return;

  function actualizarRol() {
    const rol = roleSelect.value;
    document.body.classList.toggle("role-employee", rol === "employee");
    badge.textContent = `Rol: ${rol === "owner" ? "Dueño" : "Empleado"}`;
  }

  roleSelect.addEventListener("change", actualizarRol);
  actualizarRol();
}

// ===== TABS (pestañas genéricas) =====
function configurarTabs(contenedorId) {
  const cont = document.querySelector(contenedorId);
  if (!cont) return;

  const tabBtns = cont.querySelectorAll(".tab-btn");
  const panes = document.querySelectorAll(".tab-pane");

  const activar = (id) => {
    tabBtns.forEach((b) => {
      b.classList.toggle("btn-primary", b.dataset.tab === id);
      b.classList.toggle("btn-outline", b.dataset.tab !== id);
    });
    panes.forEach((p) => (p.style.display = p.id === id ? "" : "none"));
  };

  tabBtns.forEach((b) => b.addEventListener("click", () => activar(b.dataset.tab)));
  activar(tabBtns[0]?.dataset.tab || "");
}

// ===== MODALES (abrir/cerrar por data attributes) =====
function configurarModales() {
  document.querySelectorAll("[data-close]").forEach((btn) =>
    btn.addEventListener("click", (e) => cerrarModal(e.target.closest(".modal")))
  );
  document.querySelectorAll(".modal").forEach((m) =>
    m.addEventListener("click", (e) => {
      if (e.target === m) cerrarModal(m);
    })
  );

  // Abrir modales con data-open
  document.querySelectorAll("[data-open]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const modal = document.getElementById(btn.dataset.open);
      if (modal) modal.classList.add("open");
    })
  );
}

// ===== INDICADORES AUTOMÁTICOS =====
function actualizarIndicadores(selectorMap) {
  for (const [id, valor] of Object.entries(selectorMap)) {
    const el = document.querySelector(id);
    setTexto(el, valor);
  }
}

// ====== MÓDULOS (detección por página) ======
function detectarModulo() {
  const page = location.pathname.split("/").pop();

  if (page.includes("facturacion")) initFacturacion?.();
  else if (page.includes("fondos")) initFondos?.();
  else if (page.includes("stock")) initStock?.();
  else if (page.includes("rrhh")) initRRHH?.();
  else if (page.includes("reportes")) initReportes?.();
  else if (page.includes("dashboard")) initDashboard?.();
  else if (page.includes("clientes")) initClientes?.();
  else if (page.includes("servicios")) initServicios?.();
  else if (page.includes("configuracion")) initConfiguracion?.();
}

// ==========================================================
// ===============  INICIALIZACIÓN GLOBAL  ==================
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  configurarRoles();
  configurarModales();

  if (document.querySelector("#tabsFinanzas")) configurarTabs("#tabsFinanzas");
  if (document.querySelector("#tabsFondos")) configurarTabs("#tabsFondos");
  if (document.querySelector("#tabsReportes")) configurarTabs("#tabsReportes");

  detectarModulo();
});

/* ==========================================================
   FUNCIONES DE MÓDULOS (Simulaciones)
   ========================================================== */

/* ----- DASHBOARD ----- */
function initDashboard() {
  const fx = window.fxRate;
  const ingresosEl = document.querySelector("#dashIngresos");
  const gastosEl = document.querySelector("#dashGastos");
  const rentEl = document.querySelector("#dashRentabilidad");
  const cajaEl = document.querySelector("#dashCaja");
  const charts = document.querySelectorAll(".chart-placeholder");

  function actualizar() {
    const ingresos = 22000 + Math.random() * 1000;
    const gastos = 12000 + Math.random() * 800;
    const rent = ((ingresos - gastos) / ingresos) * 100;
    const caja = 14500 + Math.random() * 500;

    setTexto(ingresosEl, ingresos);
    setTexto(gastosEl, gastos);
    rentEl.textContent = rent.toFixed(1) + "%";
    setTexto(cajaEl, caja);
  }

  setInterval(() => {
    charts.forEach((c) => (c.textContent = "[ 📊 Datos actualizados ]"));
    actualizar();
  }, 4000);

  actualizar();
}

/* ----- REPORTES ----- */
function initReportes() {
  function actualizar() {
    const ingresos = 22500 + Math.random() * 800;
    const gastos = 12050 + Math.random() * 600;
    const neto = ingresos - gastos;
    const margen = ((ingresos - gastos * 0.8) / ingresos) * 100;
    const equilibrio = gastos * 0.9;
    const caja = 14500 + Math.random() * 400;

    actualizarIndicadores({
      "#repIngresos": ingresos,
      "#repGastos": gastos,
      "#repResultado": neto,
      "#repEquilibrio": equilibrio,
      "#repCaja": caja,
    });
    const m = document.querySelector("#repMargen");
    if (m) m.textContent = margen.toFixed(1) + "%";
  }

  setInterval(actualizar, 3000);
  actualizar();
}

/* ----- STOCK ----- */
function initStock() {
  const btnEntrada = document.querySelector("#btnEntrada");
  const modalEntrada = document.querySelector("#modalEntrada");
  btnEntrada?.addEventListener("click", () => abrirModal(modalEntrada));
}

/* ----- FACTURACIÓN ----- */
function initFacturacion() {
  const fx = window.fxRate;
  const cantInput = document.querySelector("#factCant");
  const puInput = document.querySelector("#factPU");
  const totalQ = document.querySelector("#factTotalQ");
  const totalUSD = document.querySelector("#factTotalUSD");

  function actualizarTotalFactura() {
    const cant = parseFloat(cantInput?.value || 0);
    const pu = parseFloat(puInput?.value || 0);
    const total = cant * pu;
    totalQ.value = `Q ${total.toFixed(2)}`;
    totalUSD.value = `US$ ${(total / fx).toFixed(2)}`;
  }
  cantInput?.addEventListener("input", actualizarTotalFactura);
  puInput?.addEventListener("input", actualizarTotalFactura);
}

/* ----- FONDOS ----- */
function initFondos() {
  const fx = window.fxRate;
  const movQ = document.querySelector("#movQ");
  const movUSD = document.querySelector("#movUSD");
  if (movQ && movUSD)
    movQ.addEventListener("input", () => {
      const q = parseFloat(movQ.value || 0);
      movUSD.value = `US$ ${(q / fx).toFixed(2)}`;
    });
}

/* ----- RRHH ----- */
function initRRHH() {
  console.log("RRHH cargado");
}

/* ==========================================================
   MÓDULO CLIENTES
   ========================================================== */
function initClientes() {
  const form = document.querySelector("#formCliente");
  const tabla = document.querySelector(".table tbody");
  const modal = document.querySelector("#modalCliente");
  const btnGuardar = document.querySelector("#guardarCliente");

  if (!form || !tabla || !btnGuardar) return;

  btnGuardar.addEventListener("click", (e) => {
    e.preventDefault();

    const nombre = form.querySelector("#clienteNombre").value.trim();
    const telefono = form.querySelector("#clienteTelefono").value.trim();
    const email = form.querySelector("#clienteEmail").value.trim();
    const grupo = form.querySelector("#clienteGrupo").value;

    if (!nombre || !telefono) {
      alert("Por favor complete los campos obligatorios: Nombre y Teléfono.");
      return;
    }

    const nuevoID = tabla.querySelectorAll("tr").length + 1;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${nuevoID}</td>
      <td>${nombre}</td>
      <td>${telefono}</td>
      <td>${email || "-"}</td>
      <td>${grupo}</td>
      <td>
        <button class="btn-icon" title="Ver"><i class="fa-solid fa-eye"></i></button>
        <button class="btn-icon" title="Editar"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-icon" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tabla.appendChild(tr);

    form.reset();
    modal.classList.remove("open");
    alert(`Cliente "${nombre}" agregado correctamente.`);
  });
}

/* ==========================================================
   MÓDULO SERVICIOS
   ========================================================== */
function initServicios() {
  const form = document.querySelector("#formOrden");
  const tabla = document.querySelector("#tablaServicios");
  const modal = document.querySelector("#modalOrden");
  const btnGuardar = document.querySelector("#guardarOrden");

  if (!form || !tabla || !btnGuardar) return;

  btnGuardar.addEventListener("click", (e) => {
    e.preventDefault();

    const cliente = form.querySelector("#ordenCliente").value.trim();
    const fecha = form.querySelector("#ordenEntrega").value;
    const estado = form.querySelector("#ordenEstado").value;
    const total = parseFloat(form.querySelector("#ordenTotal").value || 0);

    if (!cliente || !fecha) {
      alert("Por favor complete los campos obligatorios: Cliente y Fecha de entrega.");
      return;
    }

    const nuevoID = tabla.querySelectorAll("tr").length + 1000;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${nuevoID}</td>
      <td>${cliente}</td>
      <td>${new Date(fecha).toLocaleDateString("es-GT")}</td>
      <td><span class="badge ${
        estado === "Lista p/ Entrega"
          ? "state-lista"
          : estado === "Entregada"
          ? "state-entregada"
          : "state-proceso"
      }">${estado}</span></td>
      <td>Q ${total.toFixed(2)}</td>
      <td>
        <button class="btn-icon" title="Ver"><i class="fa-solid fa-eye"></i></button>
        <button class="btn-icon" title="Editar"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-icon" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tabla.appendChild(tr);

    form.reset();
    modal.classList.remove("open");
    alert(`Orden #${nuevoID} agregada correctamente.`);
  });
}

/* ==========================================================
   MÓDULO CONFIGURACIÓN
   ========================================================== */
function initConfiguracion() {
  if (document.querySelector("#tabsConfig")) configurarTabs("#tabsConfig");

  const fxInput = document.querySelector("#exchangeRate");
  if (fxInput) {
    fxInput.addEventListener("input", () => {
      const v = parseFloat(fxInput.value || 0);
      if (v > 0) window.fxRate = v;
    });
  }

  const svcQ = document.querySelector("#svcQ");
  const svcUSD = document.querySelector("#svcUSD");
  if (svcQ && svcUSD) {
    svcQ.addEventListener("input", () => {
      const q = parseFloat(svcQ.value || 0);
      svcUSD.value = `US$ ${(q / window.fxRate).toFixed(2)}`;
    });
  }

  const btnGuardarServicio = document.querySelector("#guardarServicio");
  const tablaServicios = document.querySelector("#tablaServiciosConfig");
  const modalServicio = document.querySelector("#modalServicio");

  btnGuardarServicio?.addEventListener("click", () => {
    const cat = document.querySelector("#svcCat").value.trim();
    const nombre = document.querySelector("#svcNombre").value.trim();
    const q = parseFloat(document.querySelector("#svcQ").value || "0");
    if (!cat || !nombre || !q) return alert("Completá Categoría, Servicio y Precio (Q).");

    const usd = (q / window.fxRate).toFixed(2);
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${cat}</td><td>${nombre}</td><td>Q ${q.toFixed(2)}</td><td>US$ ${usd}</td><td><button class="btn btn-outline"><i class="fa-solid fa-pen"></i></button></td>`;
    tablaServicios?.appendChild(tr);

    document.querySelector("#svcCat").value = "";
    document.querySelector("#svcNombre").value = "";
    document.querySelector("#svcQ").value = "";
    document.querySelector("#svcUSD").value = "US$ 0.00";
    modalServicio?.classList.remove("open");
  });

  const btnGuardarGF = document.querySelector("#guardarGastoFijo");
  const tablaGF = document.querySelector("#tablaGastosFijos");
  const modalGF = document.querySelector("#modalGastoFijo");

  btnGuardarGF?.addEventListener("click", () => {
    const concepto = document.querySelector("#gfConcepto").value.trim();
    const q = parseFloat(document.querySelector("#gfQ").value || "0");
    const dia = parseInt(document.querySelector("#gfDia").value || "0", 10);

    if (!concepto || !q || !dia) return alert("Completá Concepto, Monto y Día de pago.");

    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${concepto}</td><td>Q ${q.toFixed(2)}</td><td>GTQ</td><td>${dia}</td><td><button class="btn btn-outline"><i class="fa-solid fa-pen"></i></button></td>`;
    tablaGF?.appendChild(tr);

    document.querySelector("#gfConcepto").value = "";
    document.querySelector("#gfQ").value = "";
    document.querySelector("#gfDia").value = "";
    modalGF?.classList.remove("open");
  });
}

/* ==========================================================
   SERVICIOS — Gestión de categorías y prendas
   ========================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const fx = window.fxRate || 7.75;
  const categorias = {
    ejecutiva: {
      nombre: "Ropa Ejecutiva",
      prendas: [
        { nombre: "Camisa", precio: 15 },
        { nombre: "Pantalón", precio: 18 },
        { nombre: "Saco / Blazer", precio: 25 },
        { nombre: "Traje completo", precio: 40 },
        { nombre: "Falda corta", precio: 12 },
        { nombre: "Vestido casual", precio: 20 },
        { nombre: "Suéter liviano", precio: 10 },
        { nombre: "Chaleco sencillo", precio: 10 },
        { nombre: "Chaleco enguatado", precio: 15 },
      ],
    },
    cama: {
      nombre: "Ropa de cama y baño",
      prendas: [
        { nombre: "Sábana individual", precio: 20 },
        { nombre: "Sábana queen", precio: 25 },
        { nombre: "Sábana king", precio: 30 },
        { nombre: "Fundas almohada", precio: 8 },
        { nombre: "Juego completo", precio: 45 },
        { nombre: "Toalla pequeña", precio: 8 },
        { nombre: "Toalla mediana", precio: 12 },
        { nombre: "Toalla grande", precio: 15 },
      ],
    },
    edredones: {
      nombre: "Edredones",
      prendas: [
        { nombre: "Edredón imperial", precio: 40 },
        { nombre: "Edredón queen", precio: 45 },
        { nombre: "Edredón king", precio: 50 },
        { nombre: "Edredón plumas ligero", precio: 55 },
        { nombre: "Edredón plumas grueso", precio: 65 },
      ],
    },
    almohadas: {
      nombre: "Almohadas y cojines",
      prendas: [
        { nombre: "Almohada pequeña", precio: 10 },
        { nombre: "Almohada grande", precio: 12 },
        { nombre: "Cojín pequeño", precio: 8 },
      ],
    },
    abrigo: {
      nombre: "Ropa de abrigo",
      prendas: [
        { nombre: "Chumpa sencilla", precio: 20 },
        { nombre: "Chumpa enguatada", precio: 25 },
        { nombre: "Abrigo corto", precio: 30 },
        { nombre: "Abrigo largo", precio: 40 },
        { nombre: "Hoodie / Suéter grueso", precio: 18 },
      ],
    },
    institucional: {
      nombre: "Ropa institucional",
      prendas: [
        { nombre: "Bata médica", precio: 15 },
        { nombre: "Uniforme completo", precio: 25 },
        { nombre: "Delantal / mandil", precio: 10 },
      ],
    },
    especial: {
      nombre: "Prendas especiales",
      prendas: [
        { nombre: "Vestido corto liso", precio: 30 },
        { nombre: "Vestido con adornos", precio: 45 },
        { nombre: "Vestido largo / gala", precio: 55 },
        { nombre: "Vestido novia sencillo", precio: 70 },
        { nombre: "Vestido novia adornado", precio: 90 },
        { nombre: "Vestido nena sencillo", precio: 25 },
      ],
    },
  };

  const categoryCards = document.querySelectorAll(".category-card");
  const itemsContainer = document.getElementById("items-container");
  const itemsTitle = document.getElementById("items-title");
  const itemsList = document.getElementById("items-list");
  const summary = document.getElementById("order-summary");
  const totalQ = document.getElementById("total-quetzal");
  const totalUSD = document.getElementById("total-usd");

  let prendasAgregadas = [];

  categoryCards.forEach((card) => {
    card.addEventListener("click", () => {
      const catKey = card.dataset.category;
      const categoria = categorias[catKey];
      if (!categoria) return;

      itemsContainer.style.display = "block";
      itemsTitle.textContent = categoria.nombre;
      itemsList.innerHTML = "";

      categoria.prendas.forEach((item) => {
        const div = document.createElement("div");
        div.classList.add("item-card");
        div.innerHTML = `
          <span>${item.nombre}</span>
          <strong>Q ${item.precio.toFixed(2)}</strong>
          <button class="btn btn-sm btn-add">Agregar</button>
        `;
        div.querySelector(".btn-add").addEventListener("click", () => {
          prendasAgregadas.push(item);
          actualizarResumen();
        });
        itemsList.appendChild(div);
      });
    });
  });

  function actualizarResumen() {
    summary.innerHTML = "";
    let total = 0;

    prendasAgregadas.forEach((p, i) => {
      total += p.precio;
      const row = document.createElement("div");
      row.classList.add("summary-item");
      row.innerHTML = `
        <span>${p.nombre}</span>
        <span>Q ${p.precio.toFixed(2)}</span>
        <button class="btn-icon btn-remove" title="Eliminar">&times;</button>
      `;
      row.querySelector(".btn-remove").addEventListener("click", () => {
        prendasAgregadas.splice(i, 1);
        actualizarResumen();
      });
      summary.appendChild(row);
    });

    totalQ.textContent = `Q ${total.toFixed(2)}`;
    totalUSD.textContent = `US$ ${(total / fx).toFixed(2)}`;
  }
});

/* ==========================================================
  SERVICIOS — Drawer + Servicios Generales + Categorías/Prendas
   ========================================================== */
(function(){
  // Abrir/cerrar panel (usa tus data-open / data-close)
  const drawer = document.getElementById('modalOrden');
  document.querySelectorAll('[data-open="modalOrden"]').forEach(btn=>{
    btn.addEventListener('click', ()=> drawer?.classList.add('open'));
  });
  drawer?.addEventListener('click', e=>{
    if (e.target === drawer) drawer.classList.remove('open');
  });
  drawer?.querySelectorAll('[data-close]').forEach(b=>{
    b.addEventListener('click', ()=> drawer.classList.remove('open'));
  });

  if (!location.pathname.includes('servicios.html')) return;

  const fx = Number(window.fxRate || 7.75);

  // Simulación de "precios definidos en Configuración"
  const PRECIOS = {
    // Servicios generales (precio por evento)
    generales: {
      "Lavado Dry Clean": 12,
      "Lavado+Secado (Extranjeros)": 16,
      "Lavado+Secado (Zona 10)": 14,
      "Lavado Preferencial": 18,
      "Lavado+Planchado": 15,
      "Solo Secado": 6,
      "Solo Planchado": 8,

      "Mantelería por peso": 10,
      "Ropa de cama por peso": 9,

      "Cortinas (m²)": 20,
      "Tapete/Alfombra (m²)": 18,
      "Prenda de cuero": 25,
      "Bolsa de cuero": 20,

      "Planchado adicional (prenda)": 5,
      "Lavado exprés 24h": 10,
      "Pretratamiento": 6,
      "Alquiler secadora": 8,

      "Botón": 3,
      "Ruedo": 7,
      "Puntos": 4,
      "Ajuste de manga": 9
    },

    // Prendas por categoría (precio por prenda)
    categorias: {
      ejecutiva: {
        "Camisa": 15, "Pantalón": 18, "Saco / Blazer": 25,
        "Traje completo (saco + pantalón)": 40, "Falda corta sencilla": 12,
        "Vestido casual / oficina": 20, "Suéter liviano sencillo": 10,
        "Chaleco sencillo": 10, "Chaleco enguatado": 15
      },
      cama: {
        "Sábana individual": 20, "Sábana matrimonial / queen": 25, "Sábana King": 30,
        "Fundas de almohada por unidad": 8, "Juego completo (2 sábanas + fundas)": 45,
        "Toalla de mano pequeña": 8, "Toalla mediana": 12, "Toalla grande": 15
      },
      edredones: {
        "Edredón imperial": 40, "Edredón matrimonial": 42, "Edredón queen": 45,
        "Edredón King": 50, "Edredón de plumas (ligero)": 55, "Edredón de plumas (grueso)": 65
      },
      almohadas: {
        "Almohada pequeña estándar": 10, "Almohada grande": 12, "Cojines pequeños": 8
      },
      abrigo: {
        "Chumpa sencilla": 20, "Chumpa enguatada": 25, "Abrigos cortos/livianos": 30,
        "Abrigo largo grueso / plumas": 40, "Suéter grueso / hoodie": 18
      },
      institucional: {
        "Bata médica / laboratorio": 15, "Uniforme completo (2 piezas)": 25, "Delantal / mandil": 10
      },
      especial: {
        "Vestido corto listo": 30, "Vestido corto con adornos liso": 45,
        "Vestido largo / fiesta sin adornos": 55, "Vestido de gala con adornos / pedrería": 80,
        "Vestido primera comunión sencillo": 35, "Vestido novia sencillo sin adornos": 70,
        "Vestido novia con adornos": 90, "Vestido nena sencillo": 25
      }
    }
  };

  // Referencias UI
  const list = document.getElementById('items-list');
  const itemsContainer = document.getElementById('items-container');
  const itemsTitle = document.getElementById('items-title');
  const summary = document.getElementById('order-summary');

  const totalQTop = document.getElementById('total-quetzal');
  const totalUSDTop = document.getElementById('total-usd');
  const totalQFoot = document.getElementById('total-quetzal-footer');
  const totalUSDFoot = document.getElementById('total-usd-footer');

  // Carrito en memoria (líneas: {tipo, nombre, q})
  const carrito = [];

  function fmtQ(q){ return `Q ${q.toFixed(2)}`; }
  function fmtUSD(q){ return `US$ ${(q/fx).toFixed(2)}`; }

  function actualizarTotales(){
    const total = carrito.reduce((acc, it)=> acc + it.q, 0);
    [totalQTop, totalQFoot].forEach(el => { if(el) el.textContent = fmtQ(total); });
    [totalUSDTop, totalUSDFoot].forEach(el => { if(el) el.textContent = fmtUSD(total); });
  }

  function renderResumen(){
    summary.innerHTML = "";
    carrito.forEach((it, idx)=>{
      const row = document.createElement('div');
      row.className = 'summary-item';
      row.innerHTML = `
        <span>${it.nombre}</span>
        <span class="prices">${fmtQ(it.q)} · ${fmtUSD(it.q)}</span>
        <button class="btn-icon" aria-label="Eliminar">&times;</button>
      `;
      row.querySelector('button').addEventListener('click', ()=>{
        carrito.splice(idx,1);
        renderResumen();
        actualizarTotales();
      });
      summary.appendChild(row);
    });
  }

  // 2.a) Agregar servicios generales seleccionados
  const btnAgregarServicios = document.getElementById('btnAgregarServicios');
  btnAgregarServicios?.addEventListener('click', ()=>{
    const picks = [
      document.getElementById('svcLavanderia')?.value || "",
      document.getElementById('svcInstitucional')?.value || "",
      document.getElementById('svcTapiceria')?.value || "",
      document.getElementById('svcAdicional')?.value || "",
      document.getElementById('svcCostureria')?.value || "",
    ].filter(Boolean);

    if (!picks.length) { alert("Seleccioná al menos un servicio general."); return; }

    picks.forEach(nombre=>{
      const q = PRECIOS.generales[nombre] ?? 0;
      carrito.push({ tipo:'servicio', nombre, q });
    });

    // Limpio selects para UX
    ['svcLavanderia','svcInstitucional','svcTapiceria','svcAdicional','svcCostureria']
      .forEach(id=>{ const el=document.getElementById(id); if(el) el.value=""; });

    renderResumen();
    actualizarTotales();
  });

  // 3) Categorías por íconos → muestran lista de prendas
  document.querySelectorAll('.category-card').forEach(card=>{
    card.addEventListener('click', ()=>{
      const key = card.dataset.category;
      const mapa = PRECIOS.categorias[key];
      if (!mapa) return;

      itemsContainer.style.display = 'block';
      itemsTitle.textContent = card.innerText.trim();
      list.innerHTML = "";

      Object.entries(mapa).forEach(([nombre, q])=>{
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
          <div>
            <div><strong>${nombre}</strong></div>
            <div class="item-meta">Precio · <span class="item-prices">${fmtQ(q)} · ${fmtUSD(q)}</span></div>
          </div>
          <div>
            <button type="button" class="btn btn-primary btn-sm">Agregar</button>
          </div>
        `;
        div.querySelector('button').addEventListener('click', ()=>{
          carrito.push({ tipo:'prenda', nombre, q });
          renderResumen();
          actualizarTotales();
        });
        list.appendChild(div);
      });
    });
  });

  // 4) Guardar (simulado) → inserta fila a la tabla
  const btnGuardar = document.getElementById('guardarOrden');
  btnGuardar?.addEventListener('click', (e)=>{
    e.preventDefault();
    const cliente = document.getElementById('ordenCliente')?.value.trim();
    const fecha = document.getElementById('ordenEntrega')?.value;
    const estado = document.getElementById('ordenEstado')?.value || 'En Proceso';

    if (!cliente || !fecha) { alert('Completá Cliente y Fecha de entrega.'); return; }
    const total = carrito.reduce((acc, it)=> acc + it.q, 0);

    const tbody = document.getElementById('tablaServicios');
    const nuevoID = 1000 + tbody.querySelectorAll('tr').length;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>#${nuevoID}</td>
      <td>${cliente}</td>
      <td>${new Date(fecha).toLocaleDateString('es-GT')}</td>
      <td><span class="badge ${
        estado === 'Entregada' ? 'state-entregada' :
        estado === 'Lista p/ Entrega' ? 'state-lista' : 'state-proceso'
      }">${estado}</span></td>
      <td>${fmtQ(total)}</td>
      <td>
        <button class="btn-icon" title="Ver"><i class="fa-solid fa-eye"></i></button>
        <button class="btn-icon" title="Editar"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-icon" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tbody.appendChild(tr);

    // Reset de panel
    carrito.length = 0;
    renderResumen();
    actualizarTotales();
    document.getElementById('formOrden')?.reset();
    drawer.classList.remove('open');
    alert(`Orden #${nuevoID} creada para ${cliente}.`);
  });

  // Sincronizar doble total superior/inferior cada vez que abra
  // (por si cambió fxRate en Configuración)
  document.querySelectorAll('[data-open="modalOrden"]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      actualizarTotales();
    });
  });
})();

/* ==========================================================
   MÓDULO CLIENTES — Be Clean
   ========================================================== */
function initClientes() {
  const form = document.querySelector("#formCliente");
  const tabla = document.querySelector(".table tbody");
  const modal = document.querySelector("#modalCliente");
  const btnGuardar = document.querySelector("#guardarCliente");

  if (!form || !tabla || !btnGuardar) return;

  btnGuardar.addEventListener("click", (e) => {
    e.preventDefault();

    const nombre = form.querySelector("#clienteNombre").value.trim();
    const telefono = form.querySelector("#clienteTelefono").value.trim();
    const email = form.querySelector("#clienteEmail").value.trim();
    const grupo = form.querySelector("#clienteGrupo").value;
    const conocio = form.querySelector("#clienteConocio").value;
    const obs = form.querySelector("#clienteObs").value.trim();

    // === Validaciones básicas ===
    if (!nombre || !telefono) {
      alert("Por favor complete los campos obligatorios: Nombre y Teléfono.");
      return;
    }

    // === Validación especial: “Otro” requiere observaciones ===
    if (conocio === "Otro" && !obs) {
      alert("Por favor especifique cómo nos conoció en Observaciones.");
      form.querySelector("#clienteObs").focus();
      return;
    }

    // === Generar nuevo ID y fila ===
    const nuevoID = tabla.querySelectorAll("tr").length + 1;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${nuevoID}</td>
      <td>${nombre}</td>
      <td>${telefono}</td>
      <td>${email || "-"}</td>
      <td>${grupo}</td>
      <td>
        <button class="btn-icon" title="Ver"><i class="fa-solid fa-eye"></i></button>
        <button class="btn-icon" title="Editar"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-icon" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;

    tabla.appendChild(tr);

    // === Resetear formulario y cerrar modal ===
    form.reset();
    modal.classList.remove("open");

    alert(`Cliente "${nombre}" agregado correctamente.`);
  });
}

// Detectar si estamos en clientes.html
document.addEventListener("DOMContentLoaded", () => {
  if (location.pathname.includes("clientes.html")) {
    initClientes();
  }
});

/* ==========================================================
   MÓDULO RRHH — Be Clean
   ========================================================== */
function initRRHH() {
  const form = document.querySelector("#formEmpleado");
  const tabla = document.querySelector("#tablaEmpleados tbody");
  const modal = document.querySelector("#modalEmpleado");
  const btnGuardar = document.querySelector("#guardarEmpleado");

  if (!form || !tabla || !btnGuardar) return;

  btnGuardar.addEventListener("click", (e) => {
    e.preventDefault();

    const nombre = form.querySelector("#empNombre").value.trim();
    const cargo = form.querySelector("#empCargo").value.trim();
    const fecha = form.querySelector("#empFechaIngreso").value;
    const salario = parseFloat(form.querySelector("#empSalario").value || 0);
    const bonificacion = parseFloat(form.querySelector("#empBonificacion").value || 0);
    const estado = form.querySelector("#empEstado").value;

    if (!nombre || !cargo || !fecha) {
      alert("Por favor complete los campos obligatorios: Nombre, Cargo y Fecha de ingreso.");
      return;
    }

    // Simula cálculo de salario neto (91% del total base + bonificación)
    const total = salario + bonificacion;
    const neto = total * 0.91;

    const nuevoID = tabla.querySelectorAll("tr").length + 1;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${nuevoID}</td>
      <td>${nombre}</td>
      <td>${cargo}</td>
      <td>${new Date(fecha).toLocaleDateString("es-GT")}</td>
      <td>Q ${salario.toFixed(2)} / US$ ${(salario / window.fxRate).toFixed(2)}</td>
      <td>Q ${neto.toFixed(2)} / US$ ${(neto / window.fxRate).toFixed(2)}</td>
      <td><span class="badge ${estado === "Activo" ? "state-lista" : "state-proceso"}">${estado}</span></td>
      <td>
        <button class="btn-icon" title="Ver"><i class="fa-solid fa-eye"></i></button>
        <button class="btn-icon" title="Editar"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-icon" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tabla.appendChild(tr);

    form.reset();
    modal.classList.remove("open");
    alert(`Empleado "${nombre}" agregado correctamente.`);
  });
}

// Detectar si estamos en rrhh.html
document.addEventListener("DOMContentLoaded", () => {
  if (location.pathname.includes("rrhh.html")) {
    initRRHH();
  }
});

/* ==========================================================
   MÓDULO RRHH — Be Clean Services (versión extendida)
   ========================================================== */
function initRRHH() {
  console.log("Módulo RRHH inicializado ✅");

  // Referencias
  const form = document.querySelector("#formEmpleado");
  const tabla = document.querySelector("#tablaEmpleados tbody");
  const modal = document.querySelector("#modalEmpleado");
  const btnGuardar = document.querySelector("#guardarEmpleado");

  const totalEmpleados = document.querySelector("#totalEmpleados");
  const totalSalariosQ = document.querySelector("#totalSalariosQ");
  const totalSalariosUSD = document.querySelector("#totalSalariosUSD");
  const tablaPlanilla = document.querySelector("#tablaPlanilla tbody");

  // Estado interno de empleados (simulación)
  let empleados = [];

  /* ====== FUNCIONES AUXILIARES ====== */

  // Actualiza totales en planilla
  function actualizarPlanilla() {
    let totalQ = 0;
    tablaPlanilla.innerHTML = "";

    empleados.forEach((e) => {
      const neto = e.salario + e.bonificacion;
      totalQ += neto;
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${e.nombre}</td>
        <td>${e.cargo}</td>
        <td>Q ${e.salario.toFixed(2)} / US$ ${(e.salario / window.fxRate).toFixed(2)}</td>
        <td>Q ${e.bonificacion.toFixed(2)} / US$ ${(e.bonificacion / window.fxRate).toFixed(2)}</td>
        <td>Q ${neto.toFixed(2)} / US$ ${(neto / window.fxRate).toFixed(2)}</td>
      `;
      tablaPlanilla.appendChild(tr);
    });

    totalEmpleados.textContent = empleados.length;
    totalSalariosQ.textContent = `Q ${totalQ.toFixed(2)}`;
    totalSalariosUSD.textContent = `US$ ${(totalQ / window.fxRate).toFixed(2)}`;
  }

  // Agrega un nuevo empleado a la tabla principal
  function agregarEmpleadoTabla(e) {
    const tr = document.createElement("tr");
    const neto = e.salario + e.bonificacion;
    const cumple = e.cumple || "-";

    tr.innerHTML = `
      <td>${e.id}</td>
      <td><img src="${e.foto || 'img/avatar_default.png'}" alt="Foto" class="avatar-sm"></td>
      <td>${e.nombre}</td>
      <td>${e.cargo}</td>
      <td><span class="badge ${e.estado === 'Activo' ? 'state-lista' : 'state-proceso'}">${e.estado}</span></td>
      <td>Q ${neto.toFixed(2)} / US$ ${(neto / window.fxRate).toFixed(2)}</td>
      <td>${new Date(e.fechaIngreso).toLocaleDateString("es-GT")}</td>
      <td class="emp-fecha-cumple" data-nombre="${e.nombre}">${cumple !== "-" ? new Date(cumple).toLocaleDateString("es-GT") : "-"}</td>
      <td>
        <button class="btn-icon" title="Ver"><i class="fa-solid fa-eye"></i></button>
        <button class="btn-icon" title="Editar"><i class="fa-solid fa-pen"></i></button>
        <button class="btn-icon" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
      </td>
    `;
    tabla.appendChild(tr);
  }

  // Verifica cumpleaños del día (simulado)
  function verificarCumpleaños() {
    const hoy = new Date();
    const dia = hoy.getDate();
    const mes = hoy.getMonth() + 1;

    empleados.forEach((e) => {
      if (e.cumple) {
        const fecha = new Date(e.cumple);
        if (fecha.getDate() === dia && fecha.getMonth() + 1 === mes) {
          alert(`🎉 Hoy es el cumpleaños de ${e.nombre}!`);
        }
      }
    });
  }

  /* ====== EVENTO GUARDAR EMPLEADO ====== */
  btnGuardar?.addEventListener("click", (ev) => {
    ev.preventDefault();

    const nombre = form.querySelector("#empNombre").value.trim();
    const cargo = form.querySelector("#empCargo").value.trim();
    const fechaIngreso = form.querySelector("#empFechaIngreso").value;
    const cumple = form.querySelector("#empFechaCumple").value;
    const salario = parseFloat(form.querySelector("#empSalario").value || 0);
    const bonificacion = parseFloat(form.querySelector("#empBonificacion").value || 0);
    const estado = form.querySelector("#empEstado").value;
    const notas = form.querySelector("#empNotas").value.trim();

    if (!nombre || !cargo || !fechaIngreso) {
      alert("Por favor complete los campos obligatorios: Nombre, Cargo y Fecha de ingreso.");
      return;
    }

    const nuevoEmpleado = {
      id: empleados.length + 1,
      nombre,
      cargo,
      fechaIngreso,
      cumple,
      salario,
      bonificacion,
      estado,
      notas,
      foto: "", // se podría llenar con FileReader si se quiere
    };

    empleados.push(nuevoEmpleado);
    agregarEmpleadoTabla(nuevoEmpleado);
    actualizarPlanilla();

    form.reset();
    modal.classList.remove("open");
    alert(`Empleado "${nombre}" agregado correctamente.`);
  });

  /* ====== BUSCADOR EN TIEMPO REAL ====== */
  const buscar = document.querySelector("#buscarEmpleado");
  buscar?.addEventListener("input", () => {
    const valor = buscar.value.toLowerCase();
    const filas = tabla.querySelectorAll("tr");
    filas.forEach((fila) => {
      const texto = fila.textContent.toLowerCase();
      fila.style.display = texto.includes(valor) ? "" : "none";
    });
  });

  /* ====== ALERTA AUTOMÁTICA ====== */
  setTimeout(() => verificarCumpleaños(), 2000);
}

/* ===== AUTO-DETECCIÓN ===== */
document.addEventListener("DOMContentLoaded", () => {
  if (location.pathname.includes("rrhh.html")) {
    initRRHH();
  }
});

/* ==========================================================
   MÓDULO RRHH — Be Clean
   ========================================================== */

function initRRHH() {

    console.log("RRHH inicializado");

    /* ----------------------
       1) CONTROL DE TABS
    ------------------------- */

    const tabButtons = document.querySelectorAll("#tabsRRHH .tab-btn");
    const tabPanes = document.querySelectorAll(".tab-pane");

    tabButtons.forEach(btn => {
        btn.addEventListener("click", () => {

            tabButtons.forEach(b => b.classList.remove("btn-primary"));
            btn.classList.add("btn-primary");

            const target = btn.dataset.tab;

            tabPanes.forEach(p => {
                p.style.display = (p.id === target) ? "block" : "none";
            });
        });
    });


    /* ----------------------
       2) MODAL NUEVO EMPLEADO
    ------------------------- */

    const modal = document.querySelector("#modalEmpleado");
    const btnGuardar = document.querySelector("#guardarEmpleado");
    const tabla = document.querySelector("#tablaRRHH");

    btnGuardar.addEventListener("click", (e) => {
        e.preventDefault();

        const nombre = document.querySelector("#empNombre").value.trim();
        const cargo = document.querySelector("#empCargo").value.trim();
        const salario = parseFloat(document.querySelector("#empSalario").value || 0);
        const estado = document.querySelector("#empEstado").value;
        const ingreso = document.querySelector("#empIngreso").value;

        if (!nombre || !cargo || salario <= 0 || !ingreso) {
            alert("Debes completar nombre, cargo, salario y fecha de ingreso.");
            return;
        }

        const nuevoID = tabla.querySelectorAll("tr").length + 1;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${nuevoID}</td>
            <td><i class="fa-solid fa-user"></i></td>
            <td>${nombre}</td>
            <td>${cargo}</td>
            <td>${estado}</td>
            <td>Q ${salario.toFixed(2)} / US$ ${(salario / window.fxRate).toFixed(2)}</td>
            <td>${ingreso}</td>
            <td>-</td>
            <td>
                <button class="btn-icon"><i class="fa-solid fa-eye"></i></button>
                <button class="btn-icon"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-icon"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;

        tabla.appendChild(tr);
        modal.classList.remove("open");
        alert("Empleado agregado correctamente");
    });

}

/* Detectar carga de RRHH */
document.addEventListener("DOMContentLoaded", () => {
    if (location.pathname.includes("rrhh.html")) {
        initRRHH();
    }
});

/* ==========================================================
   FACTURACIÓN COMPLETA — Be Clean Services
   ========================================================== */

function initFacturacionCompleta() {

    console.log("Facturación avanzada cargada correctamente.");

    /* ---------- REFERENCIAS ---------- */
    const tablaFacturas = document.querySelector("#tablaFacturas");
    const tablaCobros = document.querySelector("#tablaCobros");
    const tablaBorradores = document.querySelector("#tablaBorradores");
    const tablaItems = document.querySelector("#tablaItemsFactura");

    const subtotalEl = document.querySelector("#factSubtotal");
    const ivaEl = document.querySelector("#factIVA");
    const totalEl = document.querySelector("#factTotal");

    const btnAgregarItem = document.querySelector("#btnAgregarItem");
    const btnGuardarFactura = document.querySelector("#guardarFactura");

    let items = [];

    /* ---------- RE-CÁLCULO DE TOTALES ---------- */
    function actualizarTotales() {
        let subtotal = 0;
        items.forEach(it => subtotal += it.total);

        const iva = subtotal * 0.12;
        const total = subtotal + iva;

        subtotalEl.textContent = `Q ${subtotal.toFixed(2)} · USD ${(subtotal / window.fxRate).toFixed(2)}`;
        ivaEl.textContent = `Q ${iva.toFixed(2)} · USD ${(iva / window.fxRate).toFixed(2)}`;
        totalEl.textContent = `Q ${total.toFixed(2)} · USD ${(total / window.fxRate).toFixed(2)}`;
    }

    /* ---------- CREAR FILA DE ITEM ---------- */
    function crearFilaItem() {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td><input type="text" class="item-desc" placeholder="Descripción"></td>
            <td><input type="number" class="item-cant" min="1" value="1"></td>
            <td><input type="number" class="item-precio" min="0" step="0.01"></td>
            <td class="item-iva">Q 0.00</td>
            <td class="item-total">Q 0.00</td>
            <td><button class="btn-del-item"><i class="fa-solid fa-trash"></i></button></td>
        `;

        tr.querySelectorAll("input").forEach(inp => {
            inp.addEventListener("input", () => recalcItem(tr));
        });

        tr.querySelector(".btn-del-item").addEventListener("click", () => {
            tr.remove();
            items = items.filter(it => it.tr !== tr);
            actualizarTotales();
        });

        return tr;
    }

    /* ---------- RE-CÁLCULO INDIVIDUAL ---------- */
    function recalcItem(tr) {
        const desc = tr.querySelector(".item-desc").value;
        const cant = parseFloat(tr.querySelector(".item-cant").value || 0);
        const precio = parseFloat(tr.querySelector(".item-precio").value || 0);

        const sub = cant * precio;
        const iva = sub * 0.12;
        const total = sub + iva;

        tr.querySelector(".item-iva").textContent = `Q ${iva.toFixed(2)}`;
        tr.querySelector(".item-total").textContent = `Q ${total.toFixed(2)}`;

        let reg = items.find(it => it.tr === tr);
        if (!reg) {
            reg = { tr };
            items.push(reg);
        }

        reg.descripcion = desc;
        reg.cantidad = cant;
        reg.precio = precio;
        reg.iva = iva;
        reg.total = total;

        actualizarTotales();
    }

    /* ---------- AGREGAR ITEM ---------- */
    btnAgregarItem?.addEventListener("click", () => {
        const tr = crearFilaItem();
        tablaItems.appendChild(tr);
    });

    /* ---------- GUARDAR FACTURA ---------- */
    btnGuardarFactura?.addEventListener("click", (e) => {
        e.preventDefault();

        const cliente = document.querySelector("#factCliente").value;
        const tipo = document.querySelector("#factTipo").value;
        const fecha = document.querySelector("#factFecha").value;

        if (!cliente || !fecha || items.length === 0) {
            alert("Completá cliente, fecha y agregá al menos un ítem.");
            return;
        }

        let subtotal = items.reduce((acc, it) => acc + it.total, 0);
        let total = subtotal;

        const id = tablaFacturas.querySelectorAll("tr").length + 1;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${id}</td>
            <td>${cliente}</td>
            <td>${tipo}</td>
            <td>${fecha}</td>
            <td>Q ${total.toFixed(2)} / USD ${(total / window.fxRate).toFixed(2)}</td>
            <td><span class="badge state-lista">Emitida</span></td>
            <td>
                <button class="btn-icon" data-open="modalCobro" data-factura="${id}" data-total="${total}">
                    <i class="fa-solid fa-money-bill"></i>
                </button>
            </td>
        `;

        tablaFacturas.appendChild(tr);

        alert("Factura registrada correctamente.");

        tablaItems.innerHTML = "";
        items = [];
        actualizarTotales();

        document.querySelector("#modalFactura").classList.remove("open");
    });

    /* ---------- GENERAR COBRO AUTOMÁTICO ---------- */
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-open='modalCobro']");
        if (!btn) return;

        const facturaID = btn.dataset.factura;
        const total = btn.dataset.total;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${facturaID}</td>
            <td>${document.querySelector("#factCliente").value || "-"}</td>
            <td>${new Date().toLocaleDateString("es-GT")}</td>
            <td>Q ${parseFloat(total).toFixed(2)}</td>
            <td>Efectivo</td>
        `;

        tablaCobros.appendChild(tr);
        alert(`Cobro registrado para factura #${facturaID}`);
    });

    /* ---------- BORRADORES DEMO ---------- */
    setTimeout(() => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>#1010</td>
            <td>Hotel Guatemala Plaza</td>
            <td>Q 350.00</td>
            <td><button class="btn btn-primary btn-sm">Convertir</button></td>
        `;
        tablaBorradores.appendChild(tr);
    }, 1200);
}

document.addEventListener("DOMContentLoaded", () => {
    if (location.pathname.includes("facturacion.html")) {
        initTabsFacturacion();
        initFacturacionCompleta();
    }
});

/* ==========================================================
   TABS DE FACTURACIÓN (Comprobantes / Cobros / Borradores)
   ========================================================== */

function initTabsFacturacion() {
    const tabs = document.querySelectorAll("#tabsFacturacion .tab-btn");
    const panes = {
        comprobantes: document.querySelector("#tab-comprobantes"),
        cobros: document.querySelector("#tab-cobros"),
        borradores: document.querySelector("#tab-borradores"),
    };

    if (!tabs.length) return;

    tabs.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.dataset.tab;

            // Activar botón correcto
            tabs.forEach(b => {
                b.classList.remove("btn-primary");
                b.classList.add("btn-outline");
            });
            btn.classList.add("btn-primary");
            btn.classList.remove("btn-outline");

            // Mostrar el panel correcto
            panes.comprobantes.style.display = "none";
            panes.cobros.style.display = "none";
            panes.borradores.style.display = "none";

            document.querySelector("#" + target).style.display = "block";
        });
    });
}

/* ==========================================================
   DASHBOARD EMPLEADOS — DATOS AUTOMÁTICOS
   ========================================================== */

function initDashboardEmpleado() {

  const enProceso = document.querySelector("#d-enproceso");
  const listas = document.querySelector("#d-listas");
  const retrasadas = document.querySelector("#d-retrasadas");
  const pendientes = document.querySelector("#d-pendientes");

  const tabla = document.querySelector("#tablaDia tbody");
  const alertas = document.querySelector("#alertasSistema");
  const movimientos = document.querySelector("#ultimosMov");

  if (!tabla) return;

  const ordenesSim = [
    { orden:"#1001", cliente:"Ana López", tipo:"Lavado", entrega:"Hoy 15:00", estado:"En proceso" },
    { orden:"#1002", cliente:"Hotel Plaza", tipo:"Mantelería", entrega:"Hoy 18:00", estado:"Lista" },
    { orden:"#1003", cliente:"Juan Pérez", tipo:"Planchado", entrega:"Ayer", estado:"Retrasada" }
  ];

  tabla.innerHTML = "";
  ordenesSim.forEach(o => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.orden}</td>
      <td>${o.cliente}</td>
      <td>${o.tipo}</td>
      <td>${o.entrega}</td>
      <td>${o.estado}</td>
      <td><button class="btn btn-outline">Ver</button></td>
    `;
    tabla.appendChild(tr);
  });

  enProceso.textContent = ordenesSim.filter(o => o.estado === "En proceso").length;
  listas.textContent = ordenesSim.filter(o => o.estado === "Lista").length;
  retrasadas.textContent = ordenesSim.filter(o => o.estado === "Retrasada").length;
  pendientes.textContent = 2;

  alertas.innerHTML = `
    <li>⚠️ Stock bajo: Detergente Premium (mínimo 15 / actual 8)</li>
    <li>🚫 Orden #1003 retrasada</li>
    <li>💵 Hay 2 pagos pendientes antes de entrega</li>
  `;

  movimientos.innerHTML = `
    <li>✔ Orden #1012 creada hace 5 min</li>
    <li>✔ Nuevo cliente: Sofía Méndez</li>
    <li>✔ Pago de Q 180 recibido</li>
  `;
}

/* ==========================================================
   DASHBOARD DUEÑO — SIMULACIÓN DE DATOS
   ========================================================== */

function initDashboardOwner() {
  const fx = window.fxRate || 7.75;

  const ingresosEl = document.querySelector("#own-ingresos");
  const gastosEl = document.querySelector("#own-gastos");
  const rentEl = document.querySelector("#own-rentabilidad");
  const cajaEl = document.querySelector("#own-caja");
  const ingresosVarEl = document.querySelector("#own-ingresos-var");
  const gastosVarEl = document.querySelector("#own-gastos-var");
  const cajaAlertEl = document.querySelector("#own-caja-alerta");

  const topServiciosBody = document.querySelector("#own-top-servicios");
  const topClientesBody = document.querySelector("#own-top-clientes");
  const equipoBody = document.querySelector("#own-equipo");
  const stockList = document.querySelector("#own-stock");
  const alertasList = document.querySelector("#own-alertas");

  if (!ingresosEl) return; // por si se carga en otra página

  // Datos simulados (podés luego conectarlos a Django)
  const ingresosMes = 28500;   // Q
  const gastosMes = 18200;     // Q
  const cajaActual = 12400;    // Q
  const ingresosMesPrev = 25000;
  const gastosMesPrev = 17500;

  const rentNet = ((ingresosMes - gastosMes) / ingresosMes) * 100;
  const varIng = ((ingresosMes - ingresosMesPrev) / ingresosMesPrev) * 100;
  const varGas = ((gastosMes - gastosMesPrev) / gastosMesPrev) * 100;

  const formato = q => `Q ${q.toFixed(2)} · US$ ${(q / fx).toFixed(2)}`;

  ingresosEl.textContent = formato(ingresosMes);
  gastosEl.textContent = formato(gastosMes);
  cajaEl.textContent = formato(cajaActual);
  rentEl.textContent = rentNet.toFixed(1) + " %";

  ingresosVarEl.textContent = `vs mes anterior: ${varIng >= 0 ? "+" : ""}${varIng.toFixed(1)}%`;
  gastosVarEl.textContent = `${varGas >= 0 ? "+" : ""}${varGas.toFixed(1)}% vs mes anterior`;

  if (cajaActual < 8000) {
    cajaAlertEl.textContent = "⚠ Caja por debajo del nivel recomendado";
    cajaAlertEl.style.color = "#c0392b";
  } else {
    cajaAlertEl.textContent = "Dentro del rango";
  }

  // Top servicios
  const topServicios = [
    { nombre:"Lavado + Secado", ordenes: 120, ingresos: 12500 },
    { nombre:"Dry Clean", ordenes: 60, ingresos: 7800 },
    { nombre:"Planchado", ordenes: 80, ingresos: 5200 }
  ];

  topServiciosBody.innerHTML = "";
  topServicios.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.nombre}</td>
      <td>${s.ordenes}</td>
      <td>${formato(s.ingresos)}</td>
    `;
    topServiciosBody.appendChild(tr);
  });

  // Top clientes
  const topClientes = [
    { nombre:"Hotel Guatemala Plaza", ordenes: 40, ingresos: 9800 },
    { nombre:"Hotel Aurora", ordenes: 25, ingresos: 6500 },
    { nombre:"Clínica Santa María", ordenes: 18, ingresos: 4300 }
  ];

  topClientesBody.innerHTML = "";
  topClientes.forEach(c => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.nombre}</td>
      <td>${c.ordenes}</td>
      <td>${formato(c.ingresos)}</td>
    `;
    topClientesBody.appendChild(tr);
  });

  // Equipo
  const equipo = [
    { nombre:"Luis", ordenes: 80, retrasos: 2 },
    { nombre:"María", ordenes: 95, retrasos: 1 },
    { nombre:"José", ordenes: 60, retrasos: 4 }
  ];

  equipoBody.innerHTML = "";
  equipo.forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.nombre}</td>
      <td>${e.ordenes}</td>
      <td>${e.retrasos}</td>
    `;
    equipoBody.appendChild(tr);
  });

  // Stock crítico
  const stockCritico = [
    { insumo:"Detergente Premium", actual: 4, minimo: 10 },
    { insumo:"Suavizante", actual: 6, minimo: 12 },
    { insumo:"Ganchos de alambre", actual: 90, minimo: 150 }
  ];

  stockList.innerHTML = "";
  stockCritico.forEach(i => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="label">${i.insumo}</span>
      <span>${i.actual} / min. ${i.minimo}</span>
    `;
    stockList.appendChild(li);
  });

  // Alertas de gestión
  const alertas = [
    "Facturas pendientes superan Q 3,000.",
    "Gasto de energía 20% más alto que el mes anterior.",
    "3 órdenes tuvieron reclamos este mes.",
    "Hay 2 colaboradores con ausencias reiteradas."
  ];

  alertasList.innerHTML = "";
  alertas.forEach(a => {
    const li = document.createElement("li");
    li.textContent = a;
    alertasList.appendChild(li);
  });

  // Simular que los 'gráficos' se actualizan
  const chartVentas = document.querySelector("#chart-ventas");
  const chartCaja = document.querySelector("#chart-caja");
  if (chartVentas && chartCaja) {
    chartVentas.textContent = "[Ventas por día — maqueta dinámica]";
    chartCaja.textContent = "[Flujo de caja — maqueta dinámica]";
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const page = location.pathname.split("/").pop();

  if (page === "dashboard.html") {
    initDashboardEmpleado();
  }

  if (page === "dashboard_admin.html") {
    initDashboardOwner();
  }

  // (y aquí dejás lo que ya tengas para facturación, fondos, etc.)
});
