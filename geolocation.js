// global variables
const domSelector = 'geolocation';
const domSelectorInitialized = domSelector + '--initialized';

// pattern class
class Geolocation {
  constructor(el, options) {
    if (typeof el === 'object' && el !== null) {
      this.el = el;
    } else {
      return;
    }
    this.options = options || {};
    if (typeof el.dataset.ref === "undefined") {
      this.ref = Object.keys(Geolocation.ref).length;
      el.dataset.ref = this.ref;
      Geolocation.ref[this.ref] = this;
      this.init();
    } else {
      // eslint-disable-next-line consistent-return
      return Geolocation.ref[el.dataset.ref];
    }
  }

  this() {
    return this;
  }

  init() {
    this.defineGlobals();
    this.getRegion();
    this.addEventListeners();
    this.el.classList.add(domSelectorInitialized);
  }

  defineGlobals() {
    this.eventListenersActive = false;
    this.locationDataString = this.el.getAttribute('data-location-object') || null;
    this.locationDataObj = this.locationDataString ? JSON.parse(this.locationDataString) : null;
    this.regions = this.locationDataObj.regions.name;
    this.currentRegion = 'california'; // default
    this.elements = {
      // button: this.el.querySelector('.' + domSelector + '__button'),
      status: this.el.querySelector('.' + domSelector + '__status'),
      link: this.el.querySelector('.' + domSelector + '__link')
    }
  }

  getRegion() {
    console.log(this.locationDataObj);
    console.log(this.regions);
    console.log(this.regions.name);
    console.log(this.currentRegion);
    var filteredRegionArray = this.regions.map(region => {
      return region === this.currentRegion ? region : false;
    });
    console.log(filteredRegionArray);
    if (this.urlContainsString('california')) {
      console.log('region exists in url');
    } else {
      console.log('region does not exist in url');
    }
    if (this.supportsStorage()) {
      console.log('localStorage is supported');
      this.displayViaSessionStorage();
    } else {
      console.log('localStorage is not supported');
    }
  }

  urlContainsString(regionString) {
    return window.location.href.indexOf(regionString) > -1 ? true : false;
  }

  displayViaSessionStorage() {
    let sessionStorageData = sessionStorage.getItem(`location-data`);
    if (sessionStorageData) {
      console.log('location data is saved in localStorage');
    } else {
      console.log('location data is not saved in localStorage');
      this.geolocationFind();
    }
  }

  addEventListeners() {
    if (!this.eventListenersActive) {
      const self = this.this();
      // this.elements.button.addEventListener('click', function(e) {
      //   e.preventDefault();
      //   self.geolocationFind()
      // });
      this.eventListenersActive = true;
    }
  }

  geolocationFind() {
    const self = this.this();
    this.elements.link.href = '';
    this.elements.link.textContent = '';

    function success(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;

      self.elements.status.textContent = '';
      self.elements.link.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
      self.elements.link.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;
      console.log('location coordinates found');
    }

    function error() {
      self.elements.status.textContent = 'Unable to retrieve your location';
    }

    if(!navigator.geolocation) {
      self.elements.status.textContent = 'Geolocation is not supported by your browser';
    } else {
      self.elements.status.textContent = 'Locating…';
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }

  supportsStorage() {
    if (typeof(Storage) !== 'undefined') {
      return true
    } else {
      return false
    }
  }

}
Geolocation.ref = {};

// pattern factory class
class GeolocationFactory {
  constructor(parentSelector) {
    this.initAll(parentSelector);
  }

  this() {
    return this;
  }

  initAll(parentSelector) {
    const self = this.this();
    let domScope;
    if (parentSelector === undefined || parentSelector === '') {
      // if parent selector is undefined or empty, use document as DOM scope
      domScope = document;
    } else if (document.querySelector(parentSelector)) {
      // if parent selector exists, use it as DOM scope
      domScope = document.querySelector(parentSelector);
    } else if (document.querySelector(parentSelector) === null) {
      // if parent selector does not exist on page, do nothing
      return;
    }
    const els = domScope.querySelectorAll('.' + domSelector + ':not(.' + domSelectorInitialized + ')');
    if (els.length) {
      els.forEach(function(el) {
        self.init(el);
      });
    }
  }

  init(el) {
    return new Geolocation(el);
  }

  get(ref) {
    // get existing counter object instance by ref number or selector
    if (isNaN(ref)) {
      // if ref is not a number, get element by query selector and then get it's ref numbder
      const patternEl = document.querySelector(ref);
      if (patternEl) {
        ref = patternEl.dataset.ref;
      }
    }
    return Geolocation.ref[ref];
  }

}

const geolocationInit = (parentSelector) => {
  const $elem = window.$elem = window.$elem || {};
  $elem.PL = $elem.PL || {};
  $elem.PL.Geolocation = new GeolocationFactory(parentSelector);
};

export {
  geolocationInit
};