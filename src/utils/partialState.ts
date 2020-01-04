type StateUpdate<Model> = (model: Model) => Model;
type SetState<Model> = (updateFn: StateUpdate<Model>) => void;

export function partialSetState<Model>(setState: SetState<Model>) {
  return function(updates: Partial<Model>) {
    return setState((model: Model) => {
      return { ...model, ...updates };
    });
  };
}
