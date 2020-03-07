export function isDevEnv() {
  return process.env.NODE_ENV === "development";
}

export function devLog(any) {
  if (isDevEnv()) {
    console.log(any);
  }
}

export const smoothScrollToTop = () => {
  const c = document.documentElement.scrollTop || document.body.scrollTop;
  if (c <= 0) {
    return;
  }
  window.requestAnimationFrame(smoothScrollToTop);
  window.scrollTo(0, c - c / 8);
};
