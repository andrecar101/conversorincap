// Función para obtener opciones dinámicas del gráfico de líneas
const getOptionChart1 = (dates = [], rates = []) => {
    return {
      title: {
        text: 'CONVERSION DE LOS ULTIMOS 30 DIAS',
        left: '0%',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: dates, // Fechas obtenidas
        boundaryGap: false,
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value}',
        },
      },
      series: [
        {
          name: 'Tasa de Conversión',
          type: 'line',
          data: rates, // Tasas obtenidas
        },
      ],
    };
  };
  
  // Función para calcular el porcentaje de cambio entre el primer y el último valor (truncado a dos decimales)
  const calculatePercentageChange = (rates) => {
    const firstRate = rates[0];  // Primer valor (día 1)
    const lastRate = rates[rates.length - 1];  // Último valor (día 30)
  
    // Calcular el porcentaje de cambio
    const percentageChange = ((lastRate - firstRate) / firstRate) * 100;
  
    // Truncar el porcentaje a dos decimales
    const truncatedPercentage = Math.trunc(percentageChange * 100) / 100;
  
    return truncatedPercentage;
  };
  
  // Función para obtener opciones para el gráfico gauge
  const getOptionGauge = (percentage) => {
    return {
      series: [
        {
          type: 'gauge',
          progress: {
            show: true,
            width: 18,
          },
          axisLine: {
            lineStyle: {
              width: 18,
            },
          },
          axisTick: {
            show: false,
          },
          splitLine: {
            length: 15,
            lineStyle: {
              width: 2,
              color: '#999',
            },
          },
          axisLabel: {
            distance: 25,
            color: '#999',
            fontSize: 20,
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 25,
            itemStyle: {
              borderWidth: 10,
            },
          },
          title: {
            show: false,
          },
          detail: {
            valueAnimation: true,
            fontSize: 80,
            offsetCenter: [0, '70%'],
            formatter: `{value}%`, // Agregar el signo de porcentaje
          },
          data: [
            {
              value: percentage,  // Aquí se asigna el porcentaje calculado
            },
          ],
        },
      ],
    };
  };
  
  // Función para inicializar los gráficos
  const initCharts = () => {
    const chart1 = echarts.init(document.getElementById('chart1'));
    const chart2 = echarts.init(document.getElementById('chart2'));
  
    // Inicialización con datos vacíos para el gráfico de líneas
    chart1.setOption(getOptionChart1([], []));
    // Inicialización con datos vacíos para el gráfico gauge
    chart2.setOption(getOptionGauge(0));
  
    // Escuchar eventos de conversión para actualizar los gráficos
    const form = document.getElementById('currency-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
  
      const from = document.getElementById('from-currency').value;
      const to = document.getElementById('to-currency').value;
  
      // Obtener la fecha actual y calcular los últimos 30 días
      const today = new Date();
      const lastWeek = new Date(today);
      lastWeek.setDate(today.getDate() - 30);
  
      const startDate = lastWeek.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];
  
      // Llamada a la API para obtener datos históricos
      const apiUrl = `https://api.frankfurter.app/${startDate}..${endDate}?from=${from}&to=${to}`;
      fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Error al obtener datos del gráfico.');
          }
          return response.json();
        })
        .then((data) => {
          const dates = Object.keys(data.rates);
          const rates = dates.map((date) => data.rates[date][to]);
  
          // Actualizar el gráfico de líneas
          chart1.setOption(getOptionChart1(dates, rates));
  
          // Calcular el porcentaje de cambio entre el primer y el último valor
          const percentageChange = calculatePercentageChange(rates);
  
          // Actualizar el gráfico gauge con el porcentaje de cambio
          chart2.setOption(getOptionGauge(percentageChange));
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    });
  
    // Redimensionar los gráficos automáticamente cuando cambie el tamaño de la ventana
    window.addEventListener('resize', () => {
      chart1.resize();
      chart2.resize();
    });
  };
  
  // Inicializar gráficos al cargar la página
  window.addEventListener('load', () => {
    initCharts();
  });
  

