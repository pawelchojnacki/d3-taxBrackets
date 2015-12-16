'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TaxBrackets = (function () {
  function TaxBrackets(taxSystem, config) {
    _classCallCheck(this, TaxBrackets);

    this.config = {
      outerWidth: config && config.outerWidth ? config.outerWidth : 1000,
      outerHeight: config && config.outerHeight ? config.outerHeight : 100,
      boxMargin: config && config.boxMargin ? config.boxMargin : { top: 0, right: 25, bottom: 0, left: 25 },
      barMargin: config && config.barMargin ? config.barMargin : 2
    };
    this.config.innerWidth = this.config.outerWidth - this.config.boxMargin.left - this.config.boxMargin.right;
    this.config.innerHeight = this.config.outerHeight - this.config.boxMargin.top - this.config.boxMargin.bottom;
    this.taxSystem = taxSystem;
  }

  _createClass(TaxBrackets, [{
    key: 'processData',
    value: function processData(salary) {
      // this is just a proof of concept, very ugly code
      var graphData = [],
          lastLimit = 0,
          segmentLength = undefined,
          taxBrackets = this.taxSystem;
      for (var i = 0; i < taxBrackets.length; i++) {
        if (salary > lastLimit) {
          var start = undefined,
              end = undefined,
              percent = undefined,
              taxLength = undefined;
          start = graphData[graphData.length - 1] ? graphData[graphData.length - 1].end : 0;
          end = salary < taxBrackets[i].limit ? salary : taxBrackets[i].limit;
          // TODO: Refactor
          if (end < 0) {
            end = salary;
          };
          percent = taxBrackets[i].taxValue;
          taxLength = Math.floor((end - start) * percent / 100);
          graphData.push({ start: start, end: end, percent: percent, taxLength: taxLength });
          lastLimit = taxBrackets[i].limit;
        }
      }
      return graphData;
    }
  }, {
    key: 'renderGraph',
    value: function renderGraph(graphData) {
      // create graphConfig object and unpack
      var c = this.config;

      var xScale = d3.scale.linear().rangeRound([0, c.innerWidth])
      // be ready to change to logscale with big values
      .domain([0, graphData[graphData.length - 1].end]);

      var svg = d3.select('#taxBrackets').append('svg').attr('width', c.outerWidth).attr('height', c.outerHeight);

      var innerFrame = svg.append('g').attr('transform', 'translate(' + c.boxMargin.left + ',' + c.boxMargin.top + ')');

      var salaryRects = innerFrame.selectAll('.salary').data(graphData);
      salaryRects /* enter phase */
      .enter().append('rect');
      salaryRects /* update phase */
      .attr('class', 'salary').attr('x', function (d) {
        return xScale(d.start);
      }).attr('y', 50).attr('width', function (d) {
        return xScale(d.end - d.start) - c.barMargin;
      }).attr('height', 25);
      salaryRects /* exit phase */
      .exit().remove();
      var taxRects = innerFrame.selectAll('.tax').data(graphData);
      taxRects.enter().append('rect');
      taxRects.attr('class', 'tax').attr('x', function (d) {
        return xScale(d.start);
      }).attr('y', 25).attr('width', function (d) {
        return xScale(d.taxLength);
      }).attr('height', 25);
      taxRects.exit().remove();
      var percentLegend = innerFrame.selectAll('.percent').data(graphData);
      percentLegend.enter().append('text');
      percentLegend.attr('class', 'percent').attr('x', function (d) {
        return xScale(d.start + (d.end - d.start) / 2);
      }).attr('y', 20).text(function (d) {
        return d.percent + '%';
      }).style("text-anchor", "middle");
      percentLegend.exit().remove();
      var bracketLegend = innerFrame.selectAll('.bracket-limit').data(graphData);
      bracketLegend.enter().append('text');
      bracketLegend.attr('class', 'bracket-limit').attr('x', function (d) {
        return xScale(d.end);
      }).attr('y', 90).text(function (d) {
        return d.end + ' PLN';
      }).style("text-anchor", "end");
    }
  }, {
    key: 'initGraph',
    value: function initGraph(salary) {
      var graphData = this.processData(salary);
      this.renderGraph(graphData);
    }
  }]);

  return TaxBrackets;
})();