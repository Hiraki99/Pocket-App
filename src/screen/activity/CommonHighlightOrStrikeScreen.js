import React from 'react';

import CommonHighlightOrStrikeContainer from '~/features/activity/container/CommonHighlightOrStrikeContainer';

class CommonHighlightOrStrikeScreen extends React.PureComponent {
  render() {
    return <CommonHighlightOrStrikeContainer paragraph={false} />;
  }
}

export default CommonHighlightOrStrikeScreen;
