//
// Highlight.js ==================================
//

const Highlight = (function() {
  //
  // Variables
  //

  const $highlight = $('.highlight');

  //
  // Methods
  //

  function init(i, block) {
    hljs.highlightBlock(block);
  }

  //
  // Events
  //

  $highlight.each((i, block) => {
    init(i, block);
  });
})();
