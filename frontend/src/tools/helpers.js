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

export const loadPetitionCards = (method, withFriends = true, offset = 0) => {
  return new Promise((resolve, reject) => {
    if (!["bootstrap"].includes(method)) {
      reject(new ConnectionError("Invalid method"));
      return;
    }
    console.log("FRIENDS request", withFriends);

    if (!withFriends) {
      console.log("WITHOUT friends");
      Backend.request(method, { offset })
        .then(r => {
          resolve(r);
        })
        .catch(e => {
          reject(e);
        });
      return;
    }

    console.log("TRY WITH friends");
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
                with_friends: true,
                friends: r.items.join(","),
                // friends: [1, 14, 15],//r.items.join(","),
                offset
              },
              "POST"
            )
              .then(response => resolve(response))
              .catch(e => reject(e));
          })
          .catch(e => reject(e));
      })
      .catch(e => reject(e));
    return;
  });
};
