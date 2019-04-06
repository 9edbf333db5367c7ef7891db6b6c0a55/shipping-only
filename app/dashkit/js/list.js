//
// List.js ==================================
//

const Lists = (function() {
  //  //
  // Variables
  //  //

  const $lists = $('[data-toggle="lists"]');
  const $listsSort = $('[data-sort]');

  //
  // Methods
  //

  // Init
  function init($list) {
    new List($list.get(0), getOptions($list));
  }

  // Get options
  function getOptions($list) {
    const options = {
      valueNames: $list.data('lists-values'),
      listClass: $list.data('lists-class') ? $list.data('lists-class') : 'list',
    };

    return options;
  }

  //
  // Events
  //

  // Init
  if ($lists.length) {
    $lists.each(function() {
      init($(this));
    });
  }

  // Sort
  $listsSort.on('click', () => false);
})();
