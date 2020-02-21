let $ = (id) => document.getElementById(id);

let formula = $('formula');
let JsFormula = $('formulaJs');

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

formula.addEventListener('input', function () {
  JsFormula.value = this.value.toLowerCase()
      .replace(/y1=/g, '')
      .replace(/tanh/g, 'Math.tanh')
      .replace(/,/g, '.');
});

doButton.addEventListener('click', function () {
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
    ]
  }, '*');
});