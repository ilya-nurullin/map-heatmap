let $ = (id) => document.getElementById(id);

let formula = $('formula');
let JsFormula = $('formulaJs');

let cityProps = {
  // [lonFrom, lonTo, latFrom, latTo]
  'ekat': [60.50, 60.8, 56.77, 56.93],
  'perm': [56, 56.4, 57.9, 58.1],
  'nizh': [43.8, 44.2, 56.2, 56.4],
};

let headMapType = () => {
  if ($('HMTypeFirst').checked)
    return 1;
  if ($('HMTypeSecond').checked)
    return 2;
};
let headMapRadius = () => {
  if (headMapType() === 1)
    return parseInt($('HMTypeFirstRadius').value);
  if (headMapType() === 2)
    return parseInt($('HMTypeSecondRadius').value);
};

let longitudeFrom = $('longitudeFrom');
let longitudeTo = $('longitudeTo');
let longitudeStep = $('longitudeStep');

let latitudeFrom = $('latitudeFrom');
let latitudeTo = $('latitudeTo');
let latitudeStep = $('latitudeStep');

let doButton = $('doButton');

function updateHeatmapBoundsSettings(cityName) {
  let [lonFrom, lonTo, latFrom, latTo] = cityProps[cityName];
  longitudeFrom.value = lonFrom;
  longitudeTo.value = lonTo;
  latitudeFrom.value = latFrom;
  latitudeTo.value = latTo;
};

updateHeatmapBoundsSettings('ekat');

document.querySelectorAll('[name="city"]').forEach(function (radio) {
  radio.addEventListener('click', function () {
    updateHeatmapBoundsSettings(this.value);
  });
});

formula.addEventListener('input', function () {
  JsFormula.value = this.value.toLowerCase()
      .replace(/y1=/g, '')
      .replace(/tanh/g, 'Math.tanh')
      .replace(/,/g, '.');
});

doButton.addEventListener('click', function () {
  try {
    eval("window.__f__ = (x1, x2) => " + JsFormula.value);
    window.__f__(parseFloat(latitudeFrom.value), parseFloat(longitudeFrom.value));
  } catch (e) {
    if (e) {
      alert("Ошибка в формуле для JS: "+e.message);
      return;
    }
  }

  opener.postMessage({'event': 'updateHeatMap',
    params: [
      JsFormula.value,
      headMapType(),
      headMapRadius(),
      parseFloat(longitudeFrom.value),
      parseFloat(longitudeTo.value),
      parseFloat(longitudeStep.value),
      parseFloat(latitudeFrom.value),
      parseFloat(latitudeTo.value),
      parseFloat(latitudeStep.value),
      document.querySelector('[name="city"]:checked').value
    ]
  }, '*');

  showSuccessText();
});

function showSuccessText() {
  let successText = document.querySelector('.success.message');
  successText.classList.add("shown");

  setTimeout(function () {
    successText.classList.remove("shown");
  }, 3000);
}