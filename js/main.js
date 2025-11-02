
// =======================================================
// --- 1. SIMULACIÓN DE BASE DE DATOS ---
// =======================================================
// (En una app real, esto vendría del servidor)

const articlesDB = [
    { id: 1, name: 'Camisa', serviceType: 'seco', price: 15.00, iconClass: 'fa-solid fa-shirt' },
    { id: 2, name: 'Pantalón', serviceType: 'seco', price: 18.00, iconClass: 'fa-solid fa-person-dress' },
    { id: 3, name: 'Blazer', serviceType: 'seco', price: 25.00, iconClass: 'fa-solid fa-user-tie' },
    { id: 4, name: 'Vestido', serviceType: 'seco', price: 30.00, iconClass: 'fa-solid fa-person-dress-simple' },
    { id: 5, name: 'Abrigo', serviceType: 'seco', price: 40.00, iconClass: 'fa-solid fa-vest' },
    { id: 10, name: 'Lavado x Libra', serviceType: 'libra', price: 2.50, iconClass: 'fa-solid fa-basket-shopping' },
    { id: 11, name: 'Planchado x Prenda', serviceType: 'planchado', price: 8.00, iconClass: 'fa-solid fa-right-long' }
];

const stockDB = [
    { id: 'J-001', name: 'Jabón Líquido Neutro' },
    { id: 'P-001', name: 'Perchas de Alambre' },
    { id: 'B-001', name: 'Bolsas Plásticas (Rollo)' }
];

// =======================================================
// --- 2. EJECUTOR PRINCIPAL (Se activa 1 VEZ) ---
// =======================================================
document.addEventListener('DOMContentLoaded', function() {
    
    // --- Lógica Común (Se ejecuta en TODAS las páginas) ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Lógica Específica (Se ejecuta SÓLO si encuentra el ID de esa página) ---
    
    // Lógica para Clientes (clientes.html)
    if (document.getElementById('client-modal')) {
        initClientPage();
    }
    
    // Lógica para Servicios (servicios.html)
    if (document.getElementById('order-modal')) {
        initServicesPage();
    }
    
    // Lógica para Facturación (facturacion.html)
    if (document.getElementById('payment-modal')) {
        initFacturacionPage();
    }
    
    // Lógica para Configuración (configuracion.html)
    if (document.getElementById('article-modal')) {
        initConfiguracionPage();
    }
    
    // Lógica para Fondos (fondos.html)
    if (document.getElementById('movement-modal')) {
        initFondosPage();
    }
    
    // Lógica para Stock (stock.html)
    if (document.getElementById('stock-modal')) {
        initStockPage();
    }
    
    // Lógica para Compras (compras.html)
    if (document.getElementById('purchase-modal')) {
        initComprasPage();
    }
    
    // Lógica para Reportes (reportes.html)
    if (document.querySelector('.btn-generate-report')) {
        initReportesPage();
    }

});


// =======================================================
// --- 3. FUNCIONES DE INICIALIZACIÓN (Una por página) ---
// =======================================================

/**
 * Lógica para la página de Clientes (clientes.html)
 */
function initClientPage() {
    const clientModal = document.getElementById('client-modal');
    const newClientBtn = document.getElementById('new-client-btn');
    const closeModalBtn = document.getElementById('modal-close-btn');
    const cancelModalBtn = document.getElementById('modal-cancel-btn');

    function openModal() {
        document.getElementById('modal-title').innerText = 'Nuevo Cliente';
        document.getElementById('client-form').reset();
        clientModal.style.display = 'flex';
    }

    function closeModal() {
        clientModal.style.display = 'none';
    }

    if (newClientBtn) newClientBtn.addEventListener('click', openModal);
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

    clientModal.addEventListener('click', function(event) {
        if (event.target === clientModal) {
            closeModal();
        }
    });
    
}

/**
 * Lógica para la página de Servicios (servicios.html)
 */
function initServicesPage() {
    const orderModal = document.getElementById('order-modal');
    const newOrderBtn = document.getElementById('new-order-btn');
    const closeOrderModalBtn = document.getElementById('order-modal-close-btn');
    const cancelOrderModalBtn = document.getElementById('order-modal-cancel-btn');
    const saveOrderBtn = document.getElementById('order-modal-save-btn');
    const serviceTypeSelect = document.getElementById('order-service-type');
    const itemSelector = document.querySelector('.item-selector');
    const orderItemList = document.getElementById('order-item-list');
    const orderTotalPriceEl = document.getElementById('order-total-price');
    const orderForm = document.getElementById('order-form');

    function buildIconPanel(selectedServiceType) {
        if (!itemSelector) return;
        itemSelector.innerHTML = ''; 
        const articlesToShow = articlesDB.filter(article => article.serviceType === selectedServiceType);

        if (articlesToShow.length === 0) {
            itemSelector.innerHTML = '<p>No hay artículos definidos para este tipo de servicio.</p>';
            return;
        }

        articlesToShow.forEach(article => {
            const buttonHTML = `
                <button type="button" class="item-button" 
                        data-id="${article.id}" 
                        data-name="${article.name}" 
                        data-price="${article.price}">
                    <i class="${article.iconClass}"></i>
                    <span>${article.name}</span>
                </button>
            `;
            itemSelector.insertAdjacentHTML('beforeend', buttonHTML);
        });
    }

    function openOrderModal() {
        orderForm.reset();
        orderItemList.innerHTML = ''; 
        updateOrderTotal(); 
        const initialServiceType = serviceTypeSelect.value;
        buildIconPanel(initialServiceType);
        orderModal.style.display = 'flex';
    }

    function closeOrderModal() {
        orderModal.style.display = 'none';
    }
    
    function updateOrderTotal() {
        let total = 0;
        const items = orderItemList.querySelectorAll('.order-item');
        items.forEach(item => {
            const price = parseFloat(item.dataset.price || 0);
            total += price;
        });
        orderTotalPriceEl.textContent = `Q ${total.toFixed(2)}`;
    }

    function addItemToCart(event) {
        const button = event.target.closest('.item-button');
        if (!button) return;
        const id = button.dataset.id;
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price || 0);
        const iconClass = button.querySelector('i').className; 
        const li = document.createElement('li');
        li.className = 'order-item';
        li.dataset.price = price; 
        li.dataset.id = id;       
        li.innerHTML = `
            <div class="item-info">
                <span class="item-name"><i class="${iconClass}"></i> ${name}</span>
                <span class="item-price">Q ${price.toFixed(2)}</span>
            </div>
            <div class="item-fields">
                <input type="text" placeholder="Etiqueta N°" name="prenda_etiqueta_${id}" required>
                <input type="text" placeholder="Observaciones (ej: mancha)" name="prenda_obs_${id}">
            </div>
            <button type="button" class="btn-remove-item" title="Quitar">&times;</button>
        `;
        orderItemList.appendChild(li);
        updateOrderTotal();
    }

    function removeItemFromCart(event) {
        if (event.target.classList.contains('btn-remove-item')) {
            event.target.closest('.order-item').remove();
            updateOrderTotal();
        }
    }
    
    function saveOrder(event) {
        event.preventDefault(); 
        const orderData = {
            clienteId: document.getElementById('order-client').value,
            tipoServicio: document.getElementById('order-service-type').value,
            peso: document.getElementById('order-weight').value,
            frecuencia: document.getElementById('order-frequency').value,
            logistica: document.getElementById('order-logistics').value,
            horarioPreferido: document.getElementById('order-preferred-time').value,
            obsServicio: document.getElementById('order-notes').value,
            prendas: []
        };
        const items = orderItemList.querySelectorAll('.order-item');
        items.forEach(item => {
            orderData.prendas.push({
                articuloId: item.dataset.id,
                nombre: item.querySelector('.item-name').textContent.trim(),
                precio: parseFloat(item.dataset.price),
                etiqueta: item.querySelector('input[placeholder="Etiqueta N°"]').value,
                observaciones: item.querySelector('input[placeholder="Observaciones (ej: mancha)"]').value,
                estado: 'Recibida'
            });
        });
        console.log('--- ORDEN A GUARDAR ---', orderData);
        alert(`Orden guardada (simulado). Total de prendas: ${orderData.prendas.length}`);
        closeOrderModal();
    }

    // Asignación de Eventos
    if (newOrderBtn) newOrderBtn.addEventListener('click', openOrderModal);
    if (closeOrderModalBtn) closeOrderModalBtn.addEventListener('click', closeOrderModal);
    if (cancelOrderModalBtn) cancelOrderModalBtn.addEventListener('click', closeOrderModal);
    if (saveOrderBtn) saveOrderBtn.addEventListener('click', saveOrder);
    if (itemSelector) itemSelector.addEventListener('click', addItemToCart);
    if (orderItemList) orderItemList.addEventListener('click', removeItemFromCart);
    if (serviceTypeSelect) {
        serviceTypeSelect.addEventListener('change', function() {
            buildIconPanel(this.value);
        });
    }
    orderModal.addEventListener('click', function(event) {
        if (event.target === orderModal) {
            closeOrderModal();
        }
    });
}

/**
 * Lógica para la página de Facturación (facturacion.html)
 */
function initFacturacionPage() {
    const paymentModal = document.getElementById('payment-modal');
    const closePaymentModalBtn = document.getElementById('payment-modal-close-btn');
    const cancelPaymentModalBtn = document.getElementById('payment-modal-cancel-btn');
    const savePaymentBtn = document.getElementById('payment-modal-save-btn');
    const paymentForm = document.getElementById('payment-form');
    const paymentAmountInput = document.getElementById('payment-amount');
    const paymentInvoiceIdEl = document.getElementById('payment-invoice-id');

    function openPaymentModal(invoiceId, totalAmount) {
        paymentForm.reset();
        paymentInvoiceIdEl.textContent = invoiceId;
        paymentAmountInput.value = totalAmount; 
        paymentModal.style.display = 'flex';
    }

    function closePaymentModal() {
        paymentModal.style.display = 'none';
    }

    function savePayment(event) {
        event.preventDefault();
        const paymentData = {
            invoiceId: paymentInvoiceIdEl.textContent,
            amount: paymentAmountInput.value,
            method: document.getElementById('payment-method').value,
            details: document.getElementById('payment-detail').value
        };
        if (paymentData.method === "") {
            alert('Por favor, seleccione un medio de cobro.');
            return;
        }
        console.log('--- COBRO A GUARDAR ---', paymentData);
        alert(`Cobro de Q ${paymentData.amount} registrado para ${paymentData.invoiceId}.`);
        closePaymentModal();
    }

    if (closePaymentModalBtn) closePaymentModalBtn.addEventListener('click', closePaymentModal);
    if (cancelPaymentModalBtn) cancelPaymentModalBtn.addEventListener('click', closePaymentModal);
    if (savePaymentBtn) savePaymentBtn.addEventListener('click', savePayment);

    paymentModal.addEventListener('click', function(event) {
        if (event.target === paymentModal) {
            closePaymentModal();
        }
    });
    
    document.querySelectorAll('.btn-payment').forEach(button => {
        button.addEventListener('click', function() {
            const row = this.closest('tr');
            const invoiceId = row.querySelector('td:first-child').textContent;
            const totalAmount = row.querySelector('td[data-total]').dataset.total;
            openPaymentModal(invoiceId, totalAmount);
        });
    });

    const newInvoiceBtn = document.getElementById('new-invoice-btn');
    if (newInvoiceBtn) {
        newInvoiceBtn.addEventListener('click', function() {
            alert('PRÓXIMO PASO: Abrir modal para facturar una Orden de Servicio.');
        });
    }
}

/**
 * Lógica para la página de Configuración (configuracion.html)
 */
function initConfiguracionPage() {
    // --- Lógica para el modal de Artículos ---
    const articleModal = document.getElementById('article-modal');
    const newArticleBtn = document.getElementById('new-article-btn');
    const closeArticleModalBtn = document.getElementById('article-modal-close-btn');
    const cancelArticleModalBtn = document.getElementById('article-modal-cancel-btn');
    const importPricesBtn = document.getElementById('import-prices-btn');

    function openArticleModal() {
        document.getElementById('article-modal-title').innerText = 'Nuevo Artículo/Servicio';
        document.getElementById('article-form').reset();
        articleModal.style.display = 'flex';
    }

    function closeArticleModal() {
        articleModal.style.display = 'none';
    }

    if (newArticleBtn) newArticleBtn.addEventListener('click', openArticleModal);
    if (closeArticleModalBtn) closeArticleModalBtn.addEventListener('click', closeArticleModal);
    if (cancelArticleModalBtn) cancelArticleModalBtn.addEventListener('click', closeArticleModal);
    
    if (importPricesBtn) {
        importPricesBtn.addEventListener('click', function() {
            alert('PRÓXIMO PASO: Abrir el importador de Excel/CSV.');
        });
    }

    articleModal.addEventListener('click', function(event) {
        if (event.target === articleModal) {
            closeArticleModal();
        }
    });

    // --- Lógica para Empresa y Contraseña ---
    const companyForm = document.getElementById('company-form');
    const passwordForm = document.getElementById('password-form');

    if (companyForm) {
        const saveCompanyBtn = document.getElementById('save-company-btn');
        saveCompanyBtn.addEventListener('click', function(event) {
            event.preventDefault();
            const companyData = {
                name: document.getElementById('company-name').value,
                doc: document.getElementById('company-doc').value,
                phone: document.getElementById('company-phone').value,
                address: document.getElementById('company-address').value
            };
            console.log("--- DATOS DE EMPRESA A GUARDAR ---", companyData);
            alert('Datos de la empresa guardados (simulado).');
        });
    }

    if (passwordForm) {
        const savePasswordBtn = document.getElementById('save-password-btn');
        savePasswordBtn.addEventListener('click', function(event) {
            event.preventDefault();
            const passCurrent = document.getElementById('pass-current').value;
            const passNew = document.getElementById('pass-new').value;
            const passConfirm = document.getElementById('pass-confirm').value;
            if (!passCurrent || !passNew || !passConfirm) {
                alert('Por favor, complete todos los campos.');
                return;
            }
            if (passNew !== passConfirm) {
                alert('La nueva contraseña y la confirmación no coinciden.');
                return;
            }
            console.log("--- CAMBIANDO CONTRASEÑA ---");
            alert('Contraseña cambiada (simulado).');
            passwordForm.reset();
        });
    }
}

/**
 * Lógica para la página de Fondos (fondos.html)
 */
function initFondosPage() {
    const movementModal = document.getElementById('movement-modal');
    const newMovementBtn = document.getElementById('new-movement-btn');
    const closeMovementModalBtn = document.getElementById('movement-modal-close-btn');
    const cancelMovementModalBtn = document.getElementById('movement-modal-cancel-btn');
    const saveMovementBtn = document.getElementById('movement-modal-save-btn');
    const movementForm = document.getElementById('movement-form');

    function openMovementModal() {
        movementForm.reset();
        movementModal.style.display = 'flex';
    }

    function closeMovementModal() {
        movementModal.style.display = 'none';
    }

    function saveMovement(event) {
        event.preventDefault();
        const movementData = {
            tipo: document.getElementById('movement-type').value,
            medio: document.getElementById('movement-medio').value,
            importe: document.getElementById('movement-amount').value,
            detalle: document.getElementById('movement-detail').value
        };
        if (!movementData.importe || parseFloat(movementData.importe) <= 0) {
            alert('Por favor, ingrese un importe válido.'); return;
        }
        if (!movementData.detalle) {
            alert('Por favor, ingrese un detalle o concepto.'); return;
        }
        console.log('--- MOVIMIENTO MANUAL A GUARDAR ---', movementData);
        alert(`Movimiento de ${movementData.tipo.toUpperCase()} por Q ${movementData.importe} guardado.`);
        closeMovementModal();
    }

    if (newMovementBtn) newMovementBtn.addEventListener('click', openMovementModal);
    if (closeMovementModalBtn) closeMovementModalBtn.addEventListener('click', closeMovementModal);
    if (cancelMovementModalBtn) cancelMovementModalBtn.addEventListener('click', closeMovementModal);
    if (saveMovementBtn) saveMovementBtn.addEventListener('click', saveMovement);

    movementModal.addEventListener('click', function(event) {
        if (event.target === movementModal) {
            closeMovementModal();
        }
    });
}

/**
 * Lógica para la página de Stock (stock.html)
 */
function initStockPage() {
    const stockModal = document.getElementById('stock-modal');
    const newStockBtn = document.getElementById('new-stock-btn');
    const closeStockModalBtn = document.getElementById('stock-modal-close-btn');
    const cancelStockModalBtn = document.getElementById('stock-modal-cancel-btn');
    const saveStockBtn = document.getElementById('stock-modal-save-btn');
    const stockForm = document.getElementById('stock-form');

    function openStockModal() {
        stockForm.reset();
        document.getElementById('stock-modal-title').innerText = 'Nuevo Insumo';
        stockModal.style.display = 'flex';
    }

    function closeStockModal() {
        stockModal.style.display = 'none';
    }

    function saveStock(event) {
        event.preventDefault();
        const stockData = {
            codigo: document.getElementById('stock-codigo').value,
            articulo: document.getElementById('stock-articulo').value,
            grupo: document.getElementById('stock-grupo').value
        };
        if (stockData.articulo === "") {
            alert('Por favor, ingrese un nombre para el artículo.');
            return;
        }
        console.log('--- INSUMO A GUARDAR ---', stockData);
        alert(`Insumo "${stockData.articulo}" guardado.`);
        closeStockModal();
    }

    if (newStockBtn) newStockBtn.addEventListener('click', openStockModal);
    if (closeStockModalBtn) closeStockModalBtn.addEventListener('click', closeStockModal);
    if (cancelStockModalBtn) cancelStockModalBtn.addEventListener('click', closeStockModal);
    if (saveStockBtn) saveStockBtn.addEventListener('click', saveStock);

    stockModal.addEventListener('click', function(event) {
        if (event.target === stockModal) {
            closeStockModal();
        }
    });
    
    // Lógica para botones de editar
    document.querySelectorAll('#stock-modal .btn-edit').forEach(button => {
        button.addEventListener('click', () => {
            // Lógica para rellenar el modal
            document.getElementById('stock-modal-title').innerText = 'Editar Insumo';
            stockModal.style.display = 'flex';
        });
    });
}

/**
 * Lógica para la página de Compras (compras.html)
 */
function initComprasPage() {
    const purchaseModal = document.getElementById('purchase-modal');
    const newPurchaseBtn = document.getElementById('new-purchase-btn');
    const closePurchaseModalBtn = document.getElementById('purchase-modal-close-btn');
    const cancelPurchaseModalBtn = document.getElementById('purchase-modal-cancel-btn');
    const savePurchaseBtn = document.getElementById('purchase-modal-save-btn');
    const purchaseForm = document.getElementById('purchase-form');

    function openPurchaseModal() {
        purchaseForm.reset();
        document.getElementById('purchase-item-list').innerHTML = '';
        
        // --- SIMULACIÓN: Llenar el dropdown de insumos ---
        // (Esto se haría una vez, no cada vez que se abre)
        const itemSelect = document.getElementById('purchase-item-select');
        itemSelect.innerHTML = '<option value="">Seleccione un insumo de su stock...</option>'; // Limpiar
        stockDB.forEach(item => {
            const optionHTML = `<option value="${item.id}">${item.name}</option>`;
            itemSelect.insertAdjacentHTML('beforeend', optionHTML);
        });
        
        purchaseModal.style.display = 'flex';
    }

    function closePurchaseModal() {
        purchaseModal.style.display = 'none';
    }

    function savePurchase(event) {
        event.preventDefault();
        const purchaseData = {
            proveedor: document.getElementById('purchase-provider').value,
            nroFactura: document.getElementById('purchase-invoice-id').value,
            fecha: document.getElementById('purchase-date').value,
            total: document.getElementById('purchase-total').value,
            medioPago: document.getElementById('purchase-payment-method').value,
            estadoPago: document.getElementById('purchase-payment-status').value,
            insumos: []
        };
        document.querySelectorAll('#purchase-item-list .purchase-item').forEach(item => {
            purchaseData.insumos.push({
                id: item.dataset.id,
                nombre: item.dataset.name,
                cantidad: item.dataset.qty
            });
        });
        if (!purchaseData.total || parseFloat(purchaseData.total) <= 0) {
            alert('Por favor, ingrese un Total de factura válido.');
            return;
        }
        console.log('--- COMPRA A GUARDAR ---', purchaseData);
        let alertMsg = `Compra de ${purchaseData.proveedor} por Q ${purchaseData.total} guardada.`;
        if (purchaseData.insumos.length > 0) {
            alertMsg += `\nSTOCK ACTUALIZADO (Simulado).`;
        }
        if (purchaseData.estadoPago === 'pagada') {
            alertMsg += `\nFONDOS ACTUALIZADOS (Simulado): Salida de ${purchaseData.medioPago}.`;
        }
        alert(alertMsg);
        closePurchaseModal();
    }

    if (newPurchaseBtn) newPurchaseBtn.addEventListener('click', openPurchaseModal);
    if (closePurchaseModalBtn) closePurchaseModalBtn.addEventListener('click', closePurchaseModal);
    if (cancelPurchaseModalBtn) cancelPurchaseModalBtn.addEventListener('click', closePurchaseModal);
    if (savePurchaseBtn) savePurchaseBtn.addEventListener('click', savePurchase);

    purchaseModal.addEventListener('click', function(event) {
        if (event.target === purchaseModal) {
            closePurchaseModal();
        }
    });
    
    const addItemBtn = document.getElementById('purchase-add-item-btn');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', function() {
            const itemSelect = document.getElementById('purchase-item-select');
            const itemQtyInput = document.getElementById('purchase-item-qty');
            const selectedOption = itemSelect.options[itemSelect.selectedIndex];
            const qty = itemQtyInput.value;
            if (selectedOption.value === "" || !qty || qty <= 0) {
                alert('Por favor, seleccione un insumo y una cantidad válida.');
                return;
            }
            const li = document.createElement('li');
            li.className = 'purchase-item';
            li.dataset.id = selectedOption.value;
            li.dataset.name = selectedOption.text;
            li.dataset.qty = qty;
            li.innerHTML = `
                <span>${selectedOption.text}</span>
                <strong>Cant: ${qty}</strong>
                <button type="button" class="btn-remove-item">&times;</button>
            `;
            document.getElementById('purchase-item-list').appendChild(li);
            itemSelect.selectedIndex = 0;
            itemQtyInput.value = '';
        });
    }
    
    const itemList = document.getElementById('purchase-item-list');
    if (itemList) {
        itemList.addEventListener('click', function(event) {
            if (event.target.classList.contains('btn-remove-item')) {
                event.target.closest('.purchase-item').remove();
            }
        });
    }
}

/**
 * Lógica para la página de Reportes (reportes.html)
 */
function initReportesPage() {
    const reportButtons = document.querySelectorAll('.btn-generate-report');
    const dateStartInput = document.getElementById('report-date-start');
    const dateEndInput = document.getElementById('report-date-end');

    reportButtons.forEach(button => {
        button.addEventListener('click', function() {
            const reportType = this.dataset.reportType;
            const fechaInicio = dateStartInput.value;
            const fechaFin = dateEndInput.value;
            let alertMsg = `Generando reporte de "${reportType}"...`;
            
            if (fechaInicio && fechaFin) {
                alertMsg += `\nPara el período: ${fechaInicio} al ${fechaFin}`;
            } else {
                alertMsg += `\nSin filtro de fecha.`;
            }
            alert(alertMsg);
            // Acá iría la lógica de generación de Excel
        });
    });
}
