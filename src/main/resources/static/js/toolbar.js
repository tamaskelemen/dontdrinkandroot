let filterParams = {
  species: [],
  mapType: '',
  timespan: '',
  animationDuration: 10,
};

window.test = filterParams;

window.addEventListener('load', () => {
  $('.dropdown.species')
    .dropdown({
      placeholder: 'Select species',
      values: [{
        name: 'Stock',
        value: '3',
        // selected: true,
      }, {
        name: 'Deer',
        value: '6',
      }, {
        name: 'Frog',
        value: '12',
      }],
      onAdd: function (value) {
        filterParams.species.push(value);
      },
      onRemove: function (value) {
        filterParams.species = filterParams.species.filter(spec => spec !== value);
      },
    });

  $('.maptype button')
    .on('click', e => {
      document.querySelectorAll('.maptype button')
        .forEach(elm => elm.classList.remove('active'));
      e.target.classList.add('active');

      filterParams.mapType = e.target.dataset.value;
    });

  $('.dropdown.timespan')
    .dropdown({
      placeholder: 'Select timespan',
      values: [{
        name: 'Last 3 months',
        value: '3',
        selected: true,
      }, {
        name: 'Last 6 months',
        value: '6',
      }, {
        name: 'Last 12 months',
        value: '12',
      }, {
        name: 'Custom',
        value: 'c',
      }],
      onChange: function (value) {
        filterParams.timespan = value;

        document.querySelector('.custom-timespan').classList.toggle('active', value === 'c');
      },
    });

  $('.ui.range').ionRangeSlider({
    grid: true,
    min: 2,
    max: 30,
    step: 1,
    from: filterParams.animationDuration,
    prettify: val => `${val}s`,
    onChange: (a, b, c) => {
      filterParams.animationDuration = a.from;
    },
  });

  $('#apply-button')
    .on('click', () => {

    });

  $('[data-value="lines"]').click();
});