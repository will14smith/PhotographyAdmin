type StateUpdate<TModel> = (model?: TModel) => TModel;
type SetState<TModel> = (updateFn: StateUpdate<TModel>) => void;

export function partialSetState<TModel>(setState: SetState<TModel>) {
  return function(updates: Partial<TModel>) {
    return setState((model?: TModel) => {
      if(model) {
        return { ...model, ...updates };
      }
      return { ...updates } as TModel;
    });
  };
}
