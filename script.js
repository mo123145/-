document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const salesForm = document.getElementById('salesForm');
    const salesTableBody = document.querySelector('#salesTable tbody');
    const grandTotalElement = document.getElementById('grandTotal');
    const clearAllBtn = document.getElementById('clearAll');

    // State
    let sales = JSON.parse(localStorage.getItem('salesRecords')) || [];

    // Initial Render
    renderTable();

    // Event Listeners
    salesForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addSale();
    });

    clearAllBtn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من حذف جميع السجلات؟')) {
            sales = [];
            saveAndRender();
        }
    });

    // Functions
    function addSale() {
        const nameInput = document.getElementById('productName');
        const priceInput = document.getElementById('productPrice');
        const qtyInput = document.getElementById('productQty');

        const name = nameInput.value.trim();
        const price = parseFloat(priceInput.value);
        const qty = parseInt(qtyInput.value);

        if (!name || isNaN(price) || isNaN(qty) || price < 0 || qty < 1) {
            alert('الرجاء إدخال بيانات صحيحة');
            return;
        }

        const newSale = {
            id: Date.now(),
            name,
            price,
            qty,
            total: price * qty,
            date: new Date().toISOString()
        };

        sales.unshift(newSale); // Add to top
        saveAndRender();

        // Reset Form
        salesForm.reset();
        nameInput.focus();
    }

    function deleteSale(id) {
        if (confirm('حذف هذا السجل؟')) {
            sales = sales.filter(sale => sale.id !== id);
            saveAndRender();
        }
    }

    function saveAndRender() {
        localStorage.setItem('salesRecords', JSON.stringify(sales));
        renderTable();
    }

    function renderTable() {
        salesTableBody.innerHTML = '';
        let grandTotal = 0;

        if (sales.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `<td colspan="6" style="text-align:center; color: var(--text-secondary); padding: 2rem;">لا توجد سجلات مبيعات حتى الآن</td>`;
            salesTableBody.appendChild(row);
        } else {
            sales.forEach(sale => {
                grandTotal += sale.total;
                const row = document.createElement('tr');
                
                const dateObj = new Date(sale.date);
                const dateString = dateObj.toLocaleDateString('ar-EG');
                const timeString = dateObj.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

                row.innerHTML = `
                    <td><strong>${sale.name}</strong></td>
                    <td>${formatCurrency(sale.price)}</td>
                    <td><span style="background: #e0e7ff; color: #4338ca; padding: 2px 8px; border-radius: 4px; font-weight: bold;">${sale.qty}</span></td>
                    <td style="color: var(--success-color); font-weight: bold;">${formatCurrency(sale.total)}</td>
                    <td style="font-size: 0.9em; color: var(--text-secondary);">
                        <div>${dateString}</div>
                        <div>${timeString}</div>
                    </td>
                    <td>
                        <button class="btn-delete" onclick="window.deleteSaleHandler(${sale.id})">
                            🗑
                        </button>
                    </td>
                `;
                salesTableBody.appendChild(row);
            });
        }

        grandTotalElement.textContent = grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function formatCurrency(amount) {
        return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // Expose delete handler to window scope for inline onclick
    window.deleteSaleHandler = deleteSale;
});
