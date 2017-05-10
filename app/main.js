
import * as d3 from "d3";

const url = 'http://www.google.com/finance/historical?q=NASDAQ%3AGOOG&ei=vmgRWYiINNCMUv6lsDg&output=csv'
const parsetTime=d3.utcParse("%d-%b-%Y")
const svg = d3.select("svg"),
    margin = {top: 100, right: 10, bottom: 20, left: 40},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom


const draw = (data)=>{
  const x = d3.scaleTime()
            .domain([data[0].date,data[data.length - 1].date])
            .range([0, width])
  const y = d3.scaleLinear()
            .domain([d3.min(data,d=>d.close), d3.max(data,d=>d.close)])
            .range([height, 0])

  svg.append("g")
  .call(d3.axisBottom(x))
  .attr("transform", `translate(${margin.left},${height-margin.bottom})`)
  svg.append("g")
  .call(d3.axisLeft(y))
    .attr("transform", `translate(${margin.left}, 0)`)
  var path=d3.line()
              .x(d=>x(d.date))
              .y(d=>y(d.close))
              (data)

  console.log(path)
  svg
  .append("path")
    .attr("d", path)
    .attr("stroke","steelblue")
    .attr("stroke-width", "1.5")
    .attr("fill", "none")
    .attr("transform", `translate(${margin.left},-${margin.bottom})`)

}

fetch(url)
  .then(r=>r.text())
  .then(data=>d3.csvParse(data, d=>({close:+d.Close, date:parsetTime(d.Date)})))
  .then(data=>data.reverse())
  .then(draw)
