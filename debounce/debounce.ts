export default function useDebounce(value: any, delay = 350) {
  let timeout: any;

  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        clearTimeout(timeout);

        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}
// eslint-disable-next-line space-before-function-paren
export default function useDebounce<Type>(value: Type, delay = 350) {
  let timeout: NodeJS.Timeout | null;

  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        timeout && clearTimeout(timeout);

        timeout = setTimeout(() => {
          value = newValue;
          trigger();
        }, delay);
      },
    };
  });
}
