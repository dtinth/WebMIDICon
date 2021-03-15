import React from 'react'

export class TouchAbsorber extends React.Component {
  componentDidMount() {
    this.listener = e => {
      e.preventDefault()
    }
    this.el.addEventListener('touchstart', this.listener, { passive: false })
    this.el.addEventListener('touchmove', this.listener, { passive: false })
    this.el.addEventListener('touchend', this.listener, { passive: false })
  }
  render() {
    return <div ref={el => (this.el = el)}>{this.props.children}</div>
  }
}
