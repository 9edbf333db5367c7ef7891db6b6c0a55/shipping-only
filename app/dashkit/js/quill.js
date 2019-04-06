//
// Quill.js ==================================
//

var Quill = (function() {
  //
  // Variables
  //

  const $quill = $('[data-toggle="quill"]');

  //
  // Methods
  //

  function init($this) {
    // Get placeholder
    const placeholder = $this.data('quill-placeholder');

    // Init editor
    const quill = new Quill($this.get(0), {
      modules: {
        toolbar: [
          ['bold', 'italic'],
          ['link', 'blockquote', 'code', 'image'],
          [{ list: 'ordered' }, { list: 'bullet' }],
        ],
      },
      placeholder,
      theme: 'snow',
    });
  }

  //
  // Events
  //

  if ($quill.length) {
    $quill.each(function() {
      init($(this));
    });
  }
})();
