document.addEventListener('DOMContentLoaded', () => {
    const fromCurrency = document.getElementById('from-currency');
    const toCurrency = document.getElementById('to-currency');

    // Evento para cambiar opciones disponibles
    fromCurrency.addEventListener('change', () => {
        sincronizarOpciones(fromCurrency, toCurrency);
    });

    toCurrency.addEventListener('change', () => {
        sincronizarOpciones(toCurrency, fromCurrency);
    });

    // Sincroniza las opciones entre los selectores
    function sincronizarOpciones(select1, select2) {
        const selectedValue = select1.value;

        // Itera sobre las opciones del segundo select y habilita/deshabilita según corresponda
        Array.from(select2.options).forEach(option => {
            option.disabled = option.value === selectedValue;
        });
    }

    // Inicializa las restricciones al cargar
    sincronizarOpciones(fromCurrency, toCurrency);

    // Lógica de conversión al enviar el formulario
    document.getElementById('currency-form').addEventListener('submit', function (event) {
        event.preventDefault();

        const amount = document.getElementById('amount').value;

        // Validar cantidad
        if (!amount || amount <= 0) {
            alert('Por favor, ingrese una cantidad válida.');
            return;
        }

        // Obtener las monedas seleccionadas
        const from = fromCurrency.value;
        const to = toCurrency.value;

        // API de conversión
        const apiUrl = `https://api.frankfurter.app/latest?amount=${amount}&from=${from}&to=${to}`;

        // Llamada a la API
        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener la conversión.');
                }
                return response.json();
            })
            .then(data => {
                const rate = data.rates[to];
                document.getElementById('conversion-result').innerHTML = `
                    <div class="alert alert-success">
                        ${amount} ${from} = ${rate.toFixed(2)} ${to}
                    </div>
                `;
            })
            .catch(error => {
                document.getElementById('conversion-result').innerHTML = `
                    <div class="alert alert-danger">Error al conectar con la API: ${error.message}</div>
                `;
                console.error('Error:', error);
            });
    });
});
