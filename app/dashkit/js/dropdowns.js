//
// Dropdowns ==================================
//

const Dropdowns = (function() {
  //
  // Variables
  //

  const $dropdown = $('.dropup, .dropright, .dropdown, .dropleft');
  const $dropdownMenu = $('.dropdown-menu');
  const $dropdownSubmenu = $('.dropdown-menu .dropdown-menu');
  const $dropdownSubmenuToggle = $('.dropdown-menu .dropdown-toggle');

  //
  // Methods
  //

  // Toggle submenu
  function toggleSubmenu(toggle) {
    const $siblingDropdown = toggle.closest($dropdown).siblings($dropdown);
    const $siblingSubmenu = $siblingDropdown.find($dropdownMenu);

    // Hide sibling submenus
    $siblingSubmenu.removeClass('show');

    // Show / hide current submenu
    toggle.next($dropdownSubmenu).toggleClass('show');
  }

  // Hide submenu
  function hideSubmenu(dropdown) {
    const $submenu = dropdown.find($dropdownSubmenu);

    // Check if there is a submenu
    if ($submenu.length) {
      $submenu.removeClass('show');
    }
  }

  //
  // Events
  //

  // Toggle submenu
  $dropdownSubmenuToggle.on('click', function() {
    toggleSubmenu($(this));

    return false;
  });

  // Hide submenu
  $dropdown.on('hide.bs.dropdown', function() {
    hideSubmenu($(this));
  });
})();
