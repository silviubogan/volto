import React from 'react';
import loadable from '@loadable/component';

const loadables = {
  'prettier/standalone': loadable.lib(() => import('prettier/standalone')),
  'prettier/parser-html': loadable.lib(() => import('prettier/parser-html')),
  'prismjs/components/prism-core': loadable.lib(() => {
    return import('prismjs/components/prism-core');
  }),
  'prismjs/components/prism-markup': loadable.lib(() => {
    return import('prismjs/components/prism-markup');
  }),
};

export function withLoadable(name) {
  function _wrapped(WrappedComponent) {
    class WithLoadableLibrary extends React.Component {
      constructor(props) {
        super(props);

        this.state = {
          loaded: false,
        };

        this.libraryRef = React.createRef();
      }

      LoadableLibrary = loadables[name];

      render() {
        const LoadableLibrary = this.LoadableLibrary;
        return (
          <>
            <LoadableLibrary
              ref={(val) => {
                this.libraryRef.current = val;
                this.setState({ loaded: true });
              }}
            />
            {this.state.loaded && (
              <WrappedComponent
                {...this.props}
                {...{
                  [name]: this.libraryRef,
                }}
              />
            )}
          </>
        );
      }
    }

    WithLoadableLibrary.displayName = `WithLoadableLibrary(${name})(${getDisplayName(
      WrappedComponent,
    )})`;

    return WithLoadableLibrary;
  }
  return _wrapped;
}

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
