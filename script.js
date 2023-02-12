// console.log(d3)

let url='https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
let request = new XMLHttpRequest()
let storeData
let arrayValues = []

let barheightScale
let barplacementScale
let xAxisScale
let yAxisScale

let height = 800
let width = 1000
let padding = 50
let svg = d3.select('svg')

let drawBoard = () => {
    svg.attr('height', height)
    svg.attr('width', width)
}

let makeScales = function() {
    barheightScale = d3.scaleLinear()
                        .domain([0, d3.max(arrayValues, (x) => {
                            return x[1]
                        })])
                        .range([0, height-padding-padding])
    barplacementScale = d3.scaleLinear()
                        .domain([0, arrayValues.length - 1])
                        .range([padding, width-padding])

    let arrayOfDates = arrayValues.map((x) => {
        return new Date(x[0])
       
    })
//    console.log(arrayOfDates)
    xAxisScale = d3.scaleTime()
                    .domain([d3.min(arrayOfDates), d3.max(arrayOfDates)])
                    .range([padding, width-padding])
    yAxisScale = d3.scaleLinear()
                    .domain([0, d3.max(arrayValues, (x) => {
                        return x[1]
                    })])
                    .range([height-padding, padding])
    

}

let makeBars = () => {
    svg.selectAll('rect')
        .data(arrayValues)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (2 * padding)) / arrayValues.length)
        .attr('data-date', (x) => {
            return x[0]
        })
        .attr('data-gdp', (x) => {
            return x[1]
        })
        .attr('height', (x) => {
            return barheightScale(x[1])
        })

        .attr('x', (x, index) => {
            return barplacementScale(index)
        })
        .attr('y', (x) => {
            return (height - padding) - barheightScale(x[1])
        })
        .on('mouseover', (x) => {
            tooltip.transition()
                .style('visibility', 'visible')
            tooltip.text(x[0])
            document.querySelector('#tooltip')
                    .setAttribute('data-date', x[0])
        })
        .on('mouseout', (x) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
                    
        tooltip = d3.select('.tipsy')
                    .append('div')
                    .attr('id', 'tooltip')
                    .style('visibility', 'hidden')
                    .style('height', 'auto')
                    .style('width', 'auto')

}

let makeAxes = function() {
    let xAxis = d3.axisBottom(xAxisScale)
    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0,' + (height-padding) +')')
    let yAxis = d3.axisLeft(yAxisScale)
    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ',0)')
    


}

request.open('GET', url, true)
request.onload = function() {
 //   console.log(request.responseText)
    storeData = JSON.parse(request.responseText)
    arrayValues = storeData.data
   // console.log(arrayValues)
    drawBoard()
    makeScales()
    makeBars()
    makeAxes()
}
request.send()

