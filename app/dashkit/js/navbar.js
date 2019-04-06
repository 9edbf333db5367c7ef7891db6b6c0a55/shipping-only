//
// Navbar ==================================
//

const Navbar = (function() {
  //
  // Variables
  //

  const $nav = $('.navbar-nav, .navbar-nav .nav');
  const $navCollapse = $('.navbar-nav .collapse');

  //
  // Methods
  //

  function accordion($this) {
    $this
      .closest($nav)
      .find($navCollapse)
      .not($this)
      .collapse('hide');
  }

  //
  // Events
  //

  $navCollapse.on({
    'show.bs.collapse': function() {
      accordion($(this));
    },
  });
})();
