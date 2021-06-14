import React from 'react';
import {View, FlatList} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import lodash from 'lodash';

import ScriptWrapper from '~/BaseComponent/components/elements/script/ScriptWrapper';
import {generateNextActivity} from '~/utils/script';
import {setTotalQuestion} from '~/features/activity/ActivityAction';
import {currentScriptConversationSelector} from '~/selector/activity';
import ConversationLetTalk from '~/BaseComponent/components/elements/speak/ConversationLetTalk';

const PrimaryLetTalkConversationScreen = () => {
  const conversationRef = React.useRef(null);
  const question = useSelector(currentScriptConversationSelector);
  const dispatch = useDispatch();

  const {conversations, detailConversations, totalQuestion} = question;

  const [actions, setListActions] = React.useState(
    conversations && conversations[0] ? [conversations[0]] : [],
  );

  React.useEffect(() => {
    dispatch(setTotalQuestion(totalQuestion || 0));
  }, [totalQuestion, dispatch]);

  const pushAction = React.useCallback(
    (item) => {
      if (item.nextItem) {
        if (item.nextItem?.type) {
          setListActions((preActions) => {
            return [...preActions, item.nextItem];
          });
        } else {
          setTimeout(() => {
            setListActions((preActions) => {
              return lodash.uniqBy(
                [...preActions, detailConversations[item.nextItem]],
                'key',
              );
            });
          }, 1000);
        }
        return;
      }

      setTimeout(() => {
        generateNextActivity();
      }, 4000);
    },
    [detailConversations],
  );

  const scrollToEnd = React.useCallback(() => {
    setTimeout(() => {
      if (conversationRef && conversationRef.current) {
        conversationRef.current.scrollToEnd();
      }
    }, 100);
  }, [conversationRef]);
  const renderItem = React.useCallback(
    ({item}) => {
      return (
        <ConversationLetTalk conversation={item} pushActions={pushAction} />
      );
    },
    [pushAction],
  );

  return (
    <ScriptWrapper>
      <FlatList
        data={actions}
        ListFooterComponent={<View style={{height: 50}} />}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        style={{paddingVertical: 24}}
        ref={conversationRef}
        onContentSizeChange={scrollToEnd}
      />
    </ScriptWrapper>
  );
};

export default PrimaryLetTalkConversationScreen;
