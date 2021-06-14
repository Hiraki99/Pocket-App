import {
  CommonActions,
  DrawerActions,
  StackActions,
} from '@react-navigation/native';

let containerRef;

function setContainer(container) {
  containerRef = container;
}

function reset(routeName, params = {}) {
  containerRef.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [
        {
          name: routeName,
          params,
        },
      ],
    }),
  );
}

function navigate(routeName, params = {}, key = null) {
  containerRef.dispatch(
    CommonActions.navigate({
      name: routeName,
      key: key ? key : routeName,
      params,
    }),
  );
}

function getCurrentRoute() {
  if (!containerRef) {
    return null;
  }
  const data = containerRef.getCurrentRoute();
  return data.name;
}

function back() {
  return containerRef.dispatch(CommonActions.goBack());
}

function backNull() {
  return containerRef.dispatch({
    ...CommonActions.goBack(),
    source: null,
    target: null,
  });
}

function pop(n) {
  return containerRef.dispatch(StackActions.pop(n));
}

function openDrawer() {
  return containerRef.dispatch(DrawerActions.openDrawer());
}

function getParam(param, defaultValue = null) {
  if (containerRef) {
    const data = containerRef.getCurrentRoute();
    const {params} = data;
    if (params) {
      if (params[param] === null || params[param] === undefined) {
        return defaultValue;
      }
      return params[param];
    }
  }
  return defaultValue;
}

function setParams(params = {}) {
  if (containerRef) {
    containerRef.dispatch(CommonActions.setParams(params));
  }
}

const navigator = {
  setContainer,
  navigate,
  reset,
  back,
  goBack: back,
  getCurrentRoute,
  openDrawer,
  getParam,
  setParams,
  pop,
  backNull,
};

export default navigator;
