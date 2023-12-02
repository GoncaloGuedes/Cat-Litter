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

const formatDate = message => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  const date = new Date(message.date);
  return date.toLocaleDateString(undefined, options);
};

const formatTime = message => {
  const options = {hour: '2-digit', minute: '2-digit'};
  const time = new Date(message.date);
  return time.toLocaleTimeString(undefined, options);
};

export {log, formatDate, formatTime};
