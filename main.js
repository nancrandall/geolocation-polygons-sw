import { geolocationInit } from './geolocation'

document.onreadystatechange = function () {
  if (document.readyState === 'complete') {
    geolocationInit();
  }
};

