window.addEventListener('load', () => {
  $('.accordion')
    .accordion({
      selector: {
        trigger: '.title .icon ',
      },
      exclusive: false,
    });

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
    });

  $('.maptype button')
    .on('click', e => {
      document.querySelectorAll('.maptype button')
        .forEach(elm => elm.classList.remove('active'));
      e.target.classList.add('active');
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
    });

  $('.ui.range').range({
    min: 0,
    max: 30,
    start: 10,
    step: 1,
    labelType: 'number',
  });
});