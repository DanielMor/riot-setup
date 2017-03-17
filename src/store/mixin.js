
function storeMixin(store) {
  return {
    getStore: () => store,
    getState: (reducer) => store.getState()[reducer],
  }
}

export default storeMixin;