//
// Demo ==================================
// Demo code to toggle layout options
//

const Demo = (function() {
  //
  // Variables
  //

  const form = document.querySelector('#demoForm');
  const topnav = document.querySelector('#topnav');
  const topbar = document.querySelector('#topbar');
  const sidebar = document.querySelector('#sidebar');
  const sidebarUser = document.querySelector('#sidebarUser');
  const containers = document.querySelectorAll('[class^="container"]');
  const stylesheets = document.querySelectorAll('#stylesheetLight, #stylesheetDark');
  const stylesheetLight = document.querySelector('#stylesheetLight');
  const stylesheetDark = document.querySelector('#stylesheetDark');
  const navPosition = localStorage.getItem('dashkitNavPosition')
    ? localStorage.getItem('dashkitNavPosition')
    : 'sidenav';
  const sidebarColor = localStorage.getItem('dashkitSidebarColor')
    ? localStorage.getItem('dashkitSidebarColor')
    : 'default';

  //
  // Methods
  //

  function toggleColorScheme(colorScheme) {
    if (colorScheme == 'light') {
      stylesheetLight.disabled = false;
      stylesheetDark.disabled = true;
    } else if (colorScheme == 'dark') {
      stylesheetLight.disabled = true;
      stylesheetDark.disabled = false;
    }
  }

  function toggleNavPosition(navPosition) {
    if (topnav && topbar && sidebar && sidebarUser) {
      if (navPosition == 'topnav') {
        hideNode(topbar);
        hideNode(sidebar);

        for (var i = 0; i < containers.length; i++) {
          containers[i].classList.remove('container-fluid');
          containers[i].classList.add('container');
        }
      } else if (navPosition == 'combo') {
        hideNode(topnav);
        hideNode(sidebarUser);

        for (var i = 0; i < containers.length; i++) {
          containers[i].classList.remove('container');
          containers[i].classList.add('container-fluid');
        }
      } else if (navPosition == 'sidenav') {
        hideNode(topnav);
        hideNode(topbar);

        for (var i = 0; i < containers.length; i++) {
          containers[i].classList.remove('container');
          containers[i].classList.add('container-fluid');
        }
      }
    }

    function hideNode(node) {
      node.setAttribute('style', 'display: none !important');
    }
  }

  function toggleSidebarColor(sidebarColor) {
    if (sidebar) {
      if (sidebarColor == 'default') {
        sidebar.classList.remove('navbar-dark', 'bg-vibrant');
        sidebar.classList.add('navbar-light');
      } else if (sidebarColor == 'vibrant') {
        sidebar.classList.remove('navbar-light');
        sidebar.classList.add('navbar-dark', 'bg-vibrant');
      }
    }
  }

  function toggleFormControls(form, colorScheme, navPosition, sidebarColor) {
    $(form)
      .find('[name="colorScheme"][value="' + colorScheme + '"]')
      .closest('.btn')
      .button('toggle');
    $(form)
      .find('[name="navPosition"][value="' + navPosition + '"]')
      .closest('.btn')
      .button('toggle');
    $(form)
      .find('[name="sidebarColor"][value="' + sidebarColor + '"]')
      .closest('.btn')
      .button('toggle');
  }

  function submitForm(form) {
    const colorScheme = form.querySelector('[name="colorScheme"]:checked').value;
    const navPosition = form.querySelector('[name="navPosition"]:checked').value;
    const sidebarColor = form.querySelector('[name="sidebarColor"]:checked').value;

    // Save data to localStorage
    localStorage.setItem('dashkitColorScheme', colorScheme);
    localStorage.setItem('dashkitNavPosition', navPosition);
    localStorage.setItem('dashkitSidebarColor', sidebarColor);

    // Reload page
    location.reload();
  }

  //
  // Event
  //

  // Document loaded
  document.addEventListener('DOMContentLoaded', () => {
    // Toggle color scheme
    toggleColorScheme(colorScheme);

    // Toggle nav position
    toggleNavPosition(navPosition);

    // Toggle sidebar color
    toggleSidebarColor(sidebarColor);

    // Toggle form controls
    toggleFormControls(form, colorScheme, navPosition, sidebarColor);

    // Enable body
    document.body.style.display = 'block';
  });

  // Form submitted
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Apply changes
      submitForm(form);
    });
  }
})();
