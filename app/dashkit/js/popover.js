//
// Popovers ==================================
//

const Popover = (function() {
  //
  // Variables
  //

  const $popover = $('[data-toggle="popover"]');

  //
  // Methods
  //

  function init() {
    $popover.popover();
  }

  //
  // Events
  //

  if ($popover.length) {
    init();
  }
})();
