import './multiSelect.less'
import React from 'react'
import R from 'ramda'

const optionClick = (currentValues, onChange, option) => (evt) => {
  evt.stopPropagation()
  if (R.contains(option, currentValues)) {
    onChange(R.reject(R.equals(option), currentValues))
  } else {
    onChange([...currentValues, option])
  }
}

const outsideClick = that => evt => {
  if (!that.refs.multiSelect.contains(evt.target)) {
    that.setState({open: false})
  }
}

export default class MultiSelect extends React.Component {
  constructor (props) {
    super(props)
    this.state = {open: false}
    this.outsideClick = outsideClick(this)
    window.addEventListener('click', this.outsideClick)
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.outsideClick)
  }

  toggleOpen () {
    this.setState({open: !this.state.open})
  }

  localizeOption (option) {
    return this.props.i18n.t(this.props.localizationPrefix + '.' + option)
  }

  render () {
    const values = this.props.values || []
    return <div
      ref="multiSelect"
      onClick={this.toggleOpen.bind(this)}
      className={`multi-select ${this.state.open ? 'has-focus' : ''}`}>
      <div className="multi-select__closed-content">
        {
          R.isEmpty(values)
            ? <span className="multi-select__placeholder">{this.props.i18n.t('multiSelect.placeHolderWhenEmpty')}</span>
            : R.pipe(
            R.map(option => this.localizeOption(option)),
            R.join(', ')
          )(values)
        }
      </div>
      <div className="multi-select__opened-content-anchor">
        {
          this.state.open
            ? <div className="multi-select__opened">
              {
                R.map(
                  option =>
                    <div className="multi-select__opened-item"
                         key={option}
                         onClick={optionClick(values, this.props.onChange, option)}>
                      <input type="checkbox"
                             readOnly="true"
                             name={option}
                             value={option}
                             checked={R.contains(option, values)}/>
                      <label className="multi-select__opened-item-label">{this.localizeOption(option)}</label>
                    </div>,
                    this.props.options
                  )
              }
              </div>
          : null
        }
      </div>
    </div>
  }
}
