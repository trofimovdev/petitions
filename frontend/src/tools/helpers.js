export function isDevEnv() {
  return process.env.NODE_ENV === "development";
}

export function devLog(any) {
  if (isDevEnv()) {
    console.log(any);
  }
}

export const smoothScrollAction = async () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c <= 0) {
    return;
  }
  window.requestAnimationFrame(smoothScrollAction);
  window.scrollTo(0, c - c / 8);
};

export const smoothScrollToTop = async (f = () => {}) => {
  await smoothScrollAction();
  f();
};
