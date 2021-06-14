import React from 'react';

import CommonHighlightOrStrikeContainer from '~/features/activity/container/CommonHighlightOrStrikeContainer';

class CommonHighlightOrStrikeParagraphScreen extends React.PureComponent {
  render() {
    return <CommonHighlightOrStrikeContainer paragraph={true} />;
  }
}

export default CommonHighlightOrStrikeParagraphScreen;
