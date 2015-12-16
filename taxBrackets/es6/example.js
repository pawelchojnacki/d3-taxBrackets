let taxSystem = [
  {
    limit: 1000,
    taxValue: 0,
    constant: 0
  },
  {
    limit: 5000,
    taxValue: 22,
    constant: 0
  },
  {
    limit: 10000,
    taxValue: 33,
    constant: 0
  },
  {
    limit: 20833,
    taxValue: 44,
    constant: 0
  },
  {
    limit: 41667,
    taxValue: 55,
    constant: 0
  },
  {
    limit: -1, /* inf */
    taxValue: 75,
    constant: 0
  }
];

// initGraph(16000);
let tbInstance = new TaxBrackets(taxSystem);
tbInstance.initGraph(16000);

$('#salary').on('keyup', function (event) {
  if (event.keyCode !== 13) {
    return;
  }
  let value = $('#salary').val();
  tbInstance.initGraph(value);
})

