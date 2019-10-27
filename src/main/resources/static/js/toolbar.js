import moment from 'moment';

export let filterParams = {
  species: [],
  mapType: '',
  fromDate: '',
  toDate: '',
  animationDuration: 10,
};

window.addEventListener('load', () => {
  $('.open-close-button')
    .on('click', () => {
      const closed = document.querySelector('.content').classList.contains('closed');

      document.querySelector('.open-close-button i').classList = closed ? 'icon angle right' : 'icon angle left';

      document.querySelector('.content').classList.toggle('closed', !closed);
    });

  fetch("http://localhost:8080/all-animals")
      .then(result => result.json())
      .then(json => {
          const names = json.map(item =>{
              return { name: item.charAt(0).toUpperCase() + item.slice(1), value: item};
          });
          $('.dropdown.species')
              .dropdown({
                  placeholder: 'Select species',
                  values: names,
                  onAdd: function (value) {
                      filterParams.species.push(value);
                  },
                  onRemove: function (value) {
                      filterParams.species = filterParams.species.filter(spec => spec !== value);
                  },
              });
      });

  $('.checkbox')
      .on('click',  e =>{
          console.log(e)
      })

  $('.maptype button')
    .on('click', e => {
      // document.querySelectorAll('.maptype button')
      //   .forEach(elm => elm.classList.remove('active'));
      // e.target.classList.add('active');
      e.target.classList.toggle('active');

      filterParams.mapType = e.target.dataset.value;
    });

  $('.dropdown.timespan')
    .dropdown({
      placeholder: 'Select timespan',
      values: [{
        name: 'Last 3 months',
        value: 3,
      }, {
        name: 'Last 6 months',
        value: 6,
      }, {
        name: 'Last 12 months',
        value: 12,
      }, {
        name: 'Custom',
        value: 'c',
        selected: true,
        // }, {
        //   name: 'Fixed date',
        //   value: 'f',
      }],
      onChange: function (value) {

        if (value === 'c') {
          filterParams.fromDate = moment(document.querySelector('.fromDate').value).format('YYYY-MM-DD');
          filterParams.toDate = moment(document.querySelector('.toDate').value).format('YYYY-MM-DD');
        } else {
          filterParams.fromDate = moment().subtract(value, 'month').format('YYYY-MM-DD');
          filterParams.toDate = moment().format('YYYY-MM-DD');
        }

        document.querySelector('.custom-timespan').classList.toggle('active', value === 'c');
        document.querySelector('.fixed-timespan').classList.toggle('active', value === 'f');
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

  // $('#apply-button')
  //   .on('click', () => {
  //     console.log(filterParams);
  //     fetch('http://localhost:8080/movement')
  //       .then(res => res.json())
  //       .then(data => drawLines(data))
  //       .catch(console.error);
  //   });

  $('[data-value="lines"]').click();
});
