function log() {
  // Much better logging
  for (var i = 0; i < arguments.length; i++) {
    let arg = arguments[i];
    // Stringify and ident objects
    if (typeof arg === 'object') {
      arg = JSON.stringify(arg, null, 2);
    }
    // Log to console
    console.log(arg);
  }
}

export default {log};
