import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import Backend from "./Backend";
import ConnectionError from "./ConnectionError";

const api = new VKMiniAppAPI();

export const isDevEnv = () => {
  return process.env.NODE_ENV === "development";
};

export const devLog = any => {
  if (isDevEnv()) {
    console.log(any);
  }
};

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

export const loadPetitions = (method, withFriends = true, params = {}) => {
  return new Promise((resolve, reject) => {
    if (!["bootstrap", "petitions"].includes(method.split("/")[0])) {
      reject(new ConnectionError("Invalid method"));
      return;
    }

    if (!withFriends) {
      Backend.request(method, params)
        .then(r => {
          resolve(r);
        })
        .catch(e => {
          reject(e);
        });
      return;
    }

    api
      .getAccessToken(7338958, "friends")
      .then(({ accessToken }) => {
        api
          .callAPIMethod("friends.get", {
            access_token: accessToken,
            v: "5.103"
          })
          .then(r => {
            Backend.request(
              method,
              {
                ...params,
                ...{
                  with_friends: true,
                  friends: r.items.join(",")
                }
              },
              "POST"
            )
              .then(response => resolve(response))
              .catch(e => reject(e));
          })
          .catch(e => reject(e));
      })
      .catch(e => reject(e));
  });
};

export const declOfNum = (n, titles) => {
  return titles[
    n % 10 === 1 && n % 100 !== 11
      ? 0
      : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
      ? 1
      : 2
  ];
};
