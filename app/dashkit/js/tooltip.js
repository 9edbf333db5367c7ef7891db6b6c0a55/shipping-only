//
// Tooltips ==================================
//

const Tooltip = (function() {
  //
  // Variables
  //

  const $tooltip = $('[data-toggle="tooltip"]');

  //
  // Methods
  //

  function init() {
    $tooltip.tooltip();
  }

  //
  // Events
  //

  if ($tooltip.length) {
    init();
  }
})();
