//
// Dropzone.js  ==================================
//

const Dropzones = (function() {
  //
  // Variables
  //

  const $dropzone = $('[data-toggle="dropzone"]');
  const $dropzonePreview = $('.dz-preview');

  //
  // Methods
  //

  function init($this) {
    const multiple = $this.data('dropzone-multiple') !== undefined;
    const preview = $this.find($dropzonePreview);
    let currentFile;

    // Init options
    const options = {
      url: $this.data('dropzone-url'),
      thumbnailWidth: null,
      thumbnailHeight: null,
      previewsContainer: preview.get(0),
      previewTemplate: preview.html(),
      maxFiles: !multiple ? 1 : null,
      acceptedFiles: !multiple ? 'image/*' : null,
      init() {
        this.on('addedfile', function(file) {
          if (!multiple && currentFile) {
            this.removeFile(currentFile);
          }
          currentFile = file;
        });
      },
    };

    // Clear preview html
    preview.html('');

    // Init dropzone
    $this.dropzone(options);
  }

  function globalOptions() {
    Dropzone.autoDiscover = false;
  }

  //
  // Events
  //

  if ($dropzone.length) {
    // Set global options
    globalOptions();

    // Init dropzones
    $dropzone.each(function() {
      init($(this));
    });
  }
})();
