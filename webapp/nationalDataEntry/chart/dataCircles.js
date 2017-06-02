import React from 'react'
import * as d3 from 'd3'
import R from 'ramda'

const renderPoints = ({xScale, yScale}) => (d, index) => {

  const circleProps = {
    cx: xScale(d.year),
    cy: yScale(d.value),
    r: d.type === 'odp' ? 4 : 6,
    key: index
  }

  return (circleProps.cx && circleProps.cy)
    ? <circle {...circleProps}
              fill={d.type === 'fra' ? '#FFF' : d.type === 'odp' ? '#189aa7' : 'none' }
              stroke={d.type === 'fra' ? '#333333' : 'none'  }
              strokeWidth={d.type === 'fra' ? 1.5 : 0 }/>
    : null
}

const renderTrend = ({xScale, yScale, data}) => d3.line()
  .x((d) => xScale(d.year))
  .y((d) => yScale(d.value))
  .curve(d3.curveLinear)
  (data)

const renderOdpLines = ({xScale, yScale}) => (d, index) => {
  const lineProps = {
    x1: xScale(d.year),
    y1: yScale(0),
    x2: xScale(d.year),
    y2: yScale(d.value)
  }

  return <g key={index}>
    <foreignObject width="200" y={lineProps.y2 - 22} x={lineProps.x2 - 100} style={{textAlign: 'center'}}>
      <text dy={lineProps.y2} dx={lineProps.x2} style={{fill: '#333333', fontSize: '12px', fontWeight: '500', backgroundColor: '#ffffff'}}>{d.value}</text>
    </foreignObject>
    <line {...lineProps} strokeWidth="1" stroke="rgba(0, 0, 0, 0.3)"></line>
  </g>
}

const renderLabel = ({data, label, xScale, yScale}) => {
  if (data.length >= 2) {
    const textProps = {
      x: xScale(data[0].year) + 50,
      y: yScale(d3.max(data, d => d.value)) - 20
    }

    return <text {...textProps} style={{fill: '#666666', fontSize: '12px', fontFamily: 'HelveticaNeue'}}>{label}</text>
  }
}

const DataCircles = (props) => {
  const odps = R.filter(v => v.type === 'odp', props.data)

  return <g>
    { renderLabel({...props, data: R.filter(v => v.type !== 'placeholder', props.data)}) }
    <path d={renderTrend(props)}
          style={{
            fill: 'none',
            stroke: 'rgba(0,0,0,.2',
            strokeWidth: 2,
            shapeRendering: 'geometricPrecision',
            strokeDasharray: '5,4'
          }}></path>
    <path d={renderTrend({...props, data: odps})} style={{
      fill: 'none',
      stroke: 'rgba(24,154,167,.5)',
      strokeWidth: 2,
      shapeRendering: 'geometricPrecision'
    }}></path>
    { odps.map(renderOdpLines(props)) }
    { props.data.map(renderPoints(props)) }
  </g>

}

export default DataCircles
