//
// Charts global ==================================
//

const ThemeCharts = (function() {
  //
  // Variables
  //

  // Toggle
  const $toggle = $('[data-toggle="chart"]');

  // Fonts
  const fonts = {
    base: 'Cerebri Sans',
  };

  // Colors
  const colors = {
    gray: {
      300: '#E3EBF6',
      600: '#95AAC9',
      700: '#6E84A3',
      800: '#152E4D',
      900: '#283E59',
    },
    primary: {
      100: '#D2DDEC',
      300: '#A6C5F7',
      700: '#2C7BE5',
    },
    black: '#12263F',
    white: '#FFFFFF',
    transparent: 'transparent',
  };

  //
  // Methods
  //

  // Chart.js global options
  function chartOptions() {
    // Options
    const options = {
      defaults: {
        global: {
          responsive: true,
          maintainAspectRatio: false,
          defaultColor: colorScheme == 'dark' ? colors.gray[700] : colors.gray[600],
          defaultFontColor: colorScheme == 'dark' ? colors.gray[700] : colors.gray[600],
          defaultFontFamily: fonts.base,
          defaultFontSize: 13,
          layout: {
            padding: 0,
          },
          legend: {
            display: false,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 16,
            },
          },
          elements: {
            point: {
              radius: 0,
              backgroundColor: colors.primary[700],
            },
            line: {
              tension: 0.4,
              borderWidth: 3,
              borderColor: colors.primary[700],
              backgroundColor: colors.transparent,
              borderCapStyle: 'rounded',
            },
            rectangle: {
              backgroundColor: colors.primary[700],
            },
            arc: {
              backgroundColor: colors.primary[700],
              borderColor: colorScheme == 'dark' ? colors.gray[800] : colors.white,
              borderWidth: 4,
            },
          },
          tooltips: {
            enabled: false,
            mode: 'index',
            intersect: false,
            custom(model) {
              // Get tooltip
              let $tooltip = $('#chart-tooltip');

              // Create tooltip on first render
              if (!$tooltip.length) {
                $tooltip = $(
                  '<div id="chart-tooltip" class="popover bs-popover-top" role="tooltip"></div>'
                );

                // Append to body
                $('body').append($tooltip);
              }

              // Hide if no tooltip
              if (model.opacity === 0) {
                $tooltip.css('display', 'none');
                return;
              }

              function getBody(bodyItem) {
                return bodyItem.lines;
              }

              // Fill with content
              if (model.body) {
                const titleLines = model.title || [];
                const bodyLines = model.body.map(getBody);
                let html = '';

                // Add arrow
                html += '<div class="arrow"></div>';

                // Add header
                titleLines.forEach((title) => {
                  html += '<h3 class="popover-header text-center">' + title + '</h3>';
                });

                // Add body
                bodyLines.forEach((body, i) => {
                  const colors = model.labelColors[i];
                  const styles = 'background-color: ' + colors.backgroundColor;
                  const indicator =
                    '<span class="popover-body-indicator" style="' + styles + '"></span>';
                  const align =
                    bodyLines.length > 1 ? 'justify-content-left' : 'justify-content-center';
                  html +=
                    '<div class="popover-body d-flex align-items-center ' +
                    align +
                    '">' +
                    indicator +
                    body +
                    '</div>';
                });

                $tooltip.html(html);
              }

              // Get tooltip position
              const $canvas = $(this._chart.canvas);

              const canvasWidth = $canvas.outerWidth();
              const canvasHeight = $canvas.outerHeight();

              const canvasTop = $canvas.offset().top;
              const canvasLeft = $canvas.offset().left;

              const tooltipWidth = $tooltip.outerWidth();
              const tooltipHeight = $tooltip.outerHeight();

              const top = canvasTop + model.caretY - tooltipHeight - 16;
              const left = canvasLeft + model.caretX - tooltipWidth / 2;

              // Display tooltip
              $tooltip.css({
                top: top + 'px',
                left: left + 'px',
                display: 'block',
              });
            },
            callbacks: {
              label(item, data) {
                const label = data.datasets[item.datasetIndex].label || '';
                const yLabel = item.yLabel;
                let content = '';

                if (data.datasets.length > 1) {
                  content += '<span class="popover-body-label mr-auto">' + label + '</span>';
                }

                content += '<span class="popover-body-value">' + yLabel + '</span>';
                return content;
              },
            },
          },
        },
        doughnut: {
          cutoutPercentage: 83,
          tooltips: {
            callbacks: {
              title(item, data) {
                const title = data.labels[item[0].index];
                return title;
              },
              label(item, data) {
                const value = data.datasets[0].data[item.index];
                let content = '';

                content += '<span class="popover-body-value">' + value + '</span>';
                return content;
              },
            },
          },
          legendCallback(chart) {
            const data = chart.data;
            let content = '';

            data.labels.forEach((label, index) => {
              const bgColor = data.datasets[0].backgroundColor[index];

              content += '<span class="chart-legend-item">';
              content +=
                '<i class="chart-legend-indicator" style="background-color: ' + bgColor + '"></i>';
              content += label;
              content += '</span>';
            });

            return content;
          },
        },
      },
    };

    // yAxes
    Chart.scaleService.updateScaleDefaults('linear', {
      gridLines: {
        borderDash: [2],
        borderDashOffset: [2],
        color: colorScheme == 'dark' ? colors.gray[900] : colors.gray[300],
        drawBorder: false,
        drawTicks: false,
        lineWidth: 0,
        zeroLineWidth: 0,
        zeroLineColor: colorScheme == 'dark' ? colors.gray[900] : colors.gray[300],
        zeroLineBorderDash: [2],
        zeroLineBorderDashOffset: [2],
      },
      ticks: {
        beginAtZero: true,
        padding: 10,
        callback(value) {
          if (!(value % 10)) {
            return value;
          }
        },
      },
    });

    // xAxes
    Chart.scaleService.updateScaleDefaults('category', {
      gridLines: {
        drawBorder: false,
        drawOnChartArea: false,
        drawTicks: false,
      },
      ticks: {
        padding: 20,
      },
      maxBarThickness: 10,
    });

    return options;
  }

  // Parse global options
  function parseOptions(parent, options) {
    for (const item in options) {
      if (typeof options[item] !== 'object') {
        parent[item] = options[item];
      } else {
        parseOptions(parent[item], options[item]);
      }
    }
  }

  // Push options
  function pushOptions(parent, options) {
    for (var item in options) {
      if (Array.isArray(options[item])) {
        options[item].forEach((data) => {
          parent[item].push(data);
        });
      } else {
        pushOptions(parent[item], options[item]);
      }
    }
  }

  // Pop options
  function popOptions(parent, options) {
    for (var item in options) {
      if (Array.isArray(options[item])) {
        options[item].forEach((data) => {
          parent[item].pop();
        });
      } else {
        popOptions(parent[item], options[item]);
      }
    }
  }

  // Toggle options
  function toggleOptions(elem) {
    const options = elem.data('add');
    const $target = $(elem.data('target'));
    const $chart = $target.data('chart');

    if (elem.is(':checked')) {
      // Add options
      pushOptions($chart, options);

      // Update chart
      $chart.update();
    } else {
      // Remove options
      popOptions($chart, options);

      // Update chart
      $chart.update();
    }
  }

  // Update options
  function updateOptions(elem) {
    const options = elem.data('update');
    const $target = $(elem.data('target'));
    const $chart = $target.data('chart');

    // Parse options
    parseOptions($chart, options);

    // Toggle ticks
    toggleTicks(elem, $chart);

    // Update chart
    $chart.update();
  }

  // Toggle ticks
  function toggleTicks(elem, $chart) {
    if (elem.data('prefix') !== undefined || elem.data('prefix') !== undefined) {
      const prefix = elem.data('prefix') ? elem.data('prefix') : '';
      const suffix = elem.data('suffix') ? elem.data('suffix') : '';

      // Update ticks
      $chart.options.scales.yAxes[0].ticks.callback = function(value) {
        if (!(value % 10)) {
          return prefix + value + suffix;
        }
      };

      // Update tooltips
      $chart.options.tooltips.callbacks.label = function(item, data) {
        const label = data.datasets[item.datasetIndex].label || '';
        const yLabel = item.yLabel;
        let content = '';

        if (data.datasets.length > 1) {
          content += '<span class="popover-body-label mr-auto">' + label + '</span>';
        }

        content += '<span class="popover-body-value">' + prefix + yLabel + suffix + '</span>';
        return content;
      };
    }
  }

  //
  // Events
  //

  // Parse global options
  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  // Toggle options
  $toggle.on({
    change() {
      const $this = $(this);

      if ($this.is('[data-add]')) {
        toggleOptions($this);
      }
    },
    click() {
      const $this = $(this);

      if ($this.is('[data-update]')) {
        updateOptions($this);
      }
    },
  });

  //
  // Return
  //

  return {
    colors,
    fonts,
    colorScheme,
  };
})();
