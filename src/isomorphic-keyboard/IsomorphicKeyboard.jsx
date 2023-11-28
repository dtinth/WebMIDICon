import React, { useEffect, useRef, useState } from 'react'
import { computed } from 'mobx'
import { createSelector } from 'reselect'
import { observer } from 'mobx-react'
import styled from 'react-emotion'
import { TouchAbsorber } from '../core/TouchAbsorber'
import { NoteHueConnector } from '../core/NoteHueConnector'

const IsomorphicKeyboardCircle = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  box-sizing: border-box;
  border: 3px solid #8b8685;
  border-radius: 100%;
`

const types = {
  jammer: (width, height) => {
    const keyDistance = Math.sqrt(width * width + height * height) / 14
    const keySize = keyDistance * 0.5
    const xOffset = keyDistance / 2
    const yOffset = keyDistance * Math.sqrt(3)
    return {
      keySize,
      x: (column) => keyDistance / 2 + column * xOffset,
      y: (column, row) =>
        height - keyDistance / 2 + (column / 2 - row) * yOffset,
      note: (column, row) => column * -5 + row * 12,
    }
  },
  bcba: (width, height) => {
    const keyDistance = height / 4.33
    const keySize = keyDistance * 0.5
    const xOffset = keyDistance / 2
    const yOffset = keyDistance * Math.sqrt(3)
    return {
      keySize,
      x: (column) => keyDistance / 2 + column * xOffset,
      y: (column, row) =>
        height - keyDistance / 2 + (column / 2 - row) * yOffset,
      note: (column, row) => column * 1 + row * 1 + 7,
    }
  },
  ccba: (width, height) => {
    const keyDistance = height / 4.33
    const keySize = keyDistance * 0.5
    const xOffset = keyDistance / 2
    const yOffset = keyDistance * Math.sqrt(3)
    return {
      keySize,
      x: (column) => keyDistance / 2 + column * xOffset,
      y: (column, row) =>
        height - keyDistance / 2 + (column / 2 - row) * yOffset,
      note: (column, row) => column * 2 + row * -1,
    }
  },
  harmonic: (width, height) => {
    const keyDistance = Math.sqrt(width * width + height * height) / 14
    const keySize = keyDistance * 0.5
    const xOffset = (keyDistance * Math.sqrt(3)) / 2
    const yOffset = keyDistance
    return {
      keySize,
      x: (column) => keyDistance / 2 + column * xOffset,
      y: (column, row) =>
        height - keyDistance / 2 + (column / 2 - row) * yOffset,
      note: (column, row) => row * 7 - column * 3,
    }
  },
}

const INVALID = { keys: [], keySize: 0 }

function generateKeys(type, width, height) {
  if (!width || !height) return INVALID
  const typedefFactory = types[type]
  if (!typedefFactory) return INVALID
  const { x, y, note, keySize } = typedefFactory(width, height)
  const keys = []
  for (let i = 0; x(i) <= width; i++) {
    for (let j = 0; y(i, j) >= 0; j++) {
      const cx = x(i)
      const cy = y(i, j)
      const noteValue = note(i, j)
      if (cx < 0) continue
      if (cy > height) continue
      keys.push({ key: `${i}:${j}`, x: cx, y: cy, noteValue: noteValue })
    }
  }
  return { keys, keySize }
}

export const IsomorphicKeyboard = (props) => {
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);
  const containerRef = useRef(null);

  const handleContainerRef = (container) => {
    containerRef.current = container;
  };

  const handleSizeChange = () => {
    if (containerRef.current) {
      setWidth(containerRef.current.offsetWidth);
      setHeight(containerRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      window.requestAnimationFrame(() => {
        handleSizeChange();
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const selectKeys = createSelector(
    () => props.type,
    () => width,
    () => height,
    generateKeys
  );

  const selectKeyElements = createSelector(
    selectKeys,
    () => props.store,
    ({ keys, keySize }, store) => {
      return keys.map((key) => {
        return (
          <Circle
            data-key={key.key}
            store={store}
            key={key.key}
            size={keySize}
            noteValue={key.noteValue}
            left={key.x}
            top={key.y}
          />
        );
      });
    }
  );

  const getSelectorState = () => ({
    props: props,
    state: { width, height },
  });

  const renderKeys = () => {
    return selectKeyElements(getSelectorState());
  };

  const updateTouches = (e) => {
    e.preventDefault();
    const container = containerRef.current;
    if (!container) return;

    const bound = container.getBoundingClientRect();
    const bx = bound.left;
    const by = bound.top;
    const activated = new Set();
    const { keys } = selectKeys(getSelectorState());

    [...e.touches].forEach((touch) => {
      const rankedKeys = keys
        .map(({ noteValue, x, y }) => ({
          noteValue,
          distance: Math.sqrt(
            Math.pow(touch.clientX - (bx + x), 2) +
              Math.pow(touch.clientY - (by + y), 2)
          ),
        }))
        .sort((a, b) => a.distance - b.distance);
      activated.add(rankedKeys[0].noteValue);
    });

    props.store.handleTouches([...activated]);
  };

  return (
    <TouchAbsorber>
      <div
        ref={handleContainerRef}
        onTouchStart={updateTouches}
        onTouchMove={updateTouches}
        onTouchEnd={updateTouches}
        style={{
          position: 'absolute',
          overflow: 'hidden',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        }}
      >
        {renderKeys()}
      </div>
    </TouchAbsorber>
  );
};

const Circle = observer(
  class Circle extends React.Component {
    constructor(props) {
      super(props)
      this.isTouched = computed(() =>
        this.props.store.activeNotes.has(this.props.noteValue)
      )
    }
    render() {
      const { size, noteValue, left, top } = this.props
      const transpose = this.props.store.transpose
      const trueNoteValue = transpose + noteValue
      const opacity = this.isTouched.get() ? 1 : 0
      return (
        <div
          data-key={this.props['data-key']}
          style={{
            position: 'absolute',
            left: left - size / 2,
            top: top - size / 2,
            width: size,
            height: size,
          }}
        >
          <NoteHueConnector note={trueNoteValue}>
            {(hue) => (
              <>
                <IsomorphicKeyboardCircle
                  style={{
                    borderColor: `hsl(${hue},50%,72%)`,
                  }}
                />
                <IsomorphicKeyboardCircle
                  className="is-active"
                  style={{
                    borderColor: 'white',
                    background: `hsl(${hue},50%,72%)`,
                    opacity,
                  }}
                />
              </>
            )}
          </NoteHueConnector>
        </div>
      )
    }
  }
)

export default IsomorphicKeyboard
