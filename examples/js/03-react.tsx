import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Elevio from '../../src/react';

type State = {
  count: number;
  removeElev: boolean;
  isLoaded: boolean;
  isReady: boolean;
  isOpened: boolean;
};

class App extends React.Component<{}, State> {
  state = {
    count: 1,
    removeElev: false,
    isLoaded: false,
    isReady: false,
    isOpened: false,
  };

  render() {
    return (
      <div>
        Hello from React!
        {!this.state.removeElev && (
          <Elevio
            accountId="57f5cf7544681"
            keywords={['test']}
            onLoad={() => this.setState({ isLoaded: true })}
            onReady={() => this.setState({ isReady: true })}
            onWidgetOpened={() => this.setState({ isOpened: true })}
            onWidgetClosed={() => this.setState({ isOpened: false })}
          />
        )}
        <br />
        <b>{this.state.count}</b>
        <br />
        <button
          id="increment"
          onClick={() => {
            this.setState((state) => ({
              count: state.count + 1,
            }));
          }}
        >
          Trigger re-draw
        </button>
        <br />
        {!this.state.removeElev && (
          <button
            id="remove-elevio"
            onClick={() => {
              this.setState({ removeElev: true });
            }}
          >
            Remove Elevio
          </button>
        )}
        {this.state.removeElev && (
          <button
            id="add-elevio"
            onClick={() => {
              this.setState({ removeElev: false });
            }}
          >
            Add Elevio
          </button>
        )}
        <br />
        {this.state.isLoaded && <div id="is-loaded">is loaded</div>}
        {this.state.isReady && <div id="is-ready">is ready</div>}
        {this.state.isOpened && <div id="is-opened">is open</div>}
        {!this.state.isOpened && <div id="is-closed">is closed</div>}
      </div>
    );
  }
}

function render() {
  const target = document.getElementById('root');
  if (!target) throw new Error('Cant find target div');
  ReactDOM.render(<App />, target);
}

render();
