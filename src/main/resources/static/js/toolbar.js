window.addEventListener('load', () => {
  $('.accordion')
    .accordion({
      selector: {
        trigger: '.title .icon',
      },
      exclusive: false,
    });

  $('.dropdown')
    .dropdown({
      clearable: true,
    });

  $('.ui.range').range({
    min: 0,
    max: 30,
    start: 10,
    step: 1,
    labelType: 'number'
  });
});