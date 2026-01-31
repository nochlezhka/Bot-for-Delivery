export const noop = () => {
  //pass
};
export const noopAsync = async () => {
  //pass
};

export type Noop = typeof noop | typeof noopAsync;
