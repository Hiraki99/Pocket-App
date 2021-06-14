import React from 'react';

import ListenChoosePictureContainer from '~/BaseComponent/components/elements/pronunciation/container/ListenChoosePictureContainer';

class ListenChoosePictureScreen extends React.PureComponent {
  render() {
    return <ListenChoosePictureContainer navigation={this.props.navigation} />;
  }
}

export default ListenChoosePictureScreen;
