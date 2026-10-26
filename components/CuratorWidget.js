import React from 'react';

export default class CuratorWidget extends React.Component {
  componentDidMount() {
    const src = 'https://elfsightcdn.com/platform.js';

    if (!document.querySelector(`script[src="${src}"]`)) {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.body.appendChild(script);
    }
  }

  render() {
    return (
      <div
        className="elfsight-app-150d95d1-f27c-4bb8-92f1-a84d0bca0e61"
        data-elfsight-app-lazy=""
      />
    );
  }
}