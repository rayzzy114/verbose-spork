// MRAID stub for single-file playable
(function() {
  if (typeof window.mraid !== 'undefined') return;

  window.mraid = {
    getState: function() { return 'default'; },
    addEventListener: function(event, handler) {
      if (event === 'ready') setTimeout(handler, 0);
    },
    removeEventListener: function() {},
    open: function(url) {
      if (url) window.open(url, '_blank');
    },
    close: function() {},
    useCustomClose: function() {},
    expand: function() {},
    isViewable: function() { return true; }
  };
})();
