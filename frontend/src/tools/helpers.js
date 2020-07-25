import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import React from "react";
import Backend from "./Backend";
import ConnectionError from "./ConnectionError";
import { goBack } from "../store/router/actions";
import {
  setLast,
  setManaged,
  setPopular,
  setSigned
} from "../store/petitions/actions";
import { setInitError } from "../store/data/actions";
import store from "../store";

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
    if (!["petitions"].includes(method.split("/")[0])) {
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
      .getAccessToken(store.getState().data.appId, "friends")
      .then(data => {
        const { accessToken } = data;
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
              .then(response => {
                resolve(response);
              })
              .catch(e => {
                reject(e);
              });
          })
          .catch(e => {
            reject(e);
          });
      })
      .catch(e => {
        reject(e);
      });
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

export const loadPhoto = src => {
  return new Promise((resolve, reject) => {
    const file = new Image();
    file.crossOrigin = "Anonymous";
    file.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.height = file.height;
      canvas.width = file.width;
      ctx.drawImage(file, 0, 0);
      const dataURL_file = canvas.toDataURL("image/png");
      resolve([file, dataURL_file]);
    };
    file.onerror = () => {
      reject();
    };
    file.src = src;
  });
};

export const getLinkName = item => {
  return (
    <a
      className="UsersStack__text__link"
      href={`https://vk.com/id${item.user_id}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {item.user.first_name}
    </a>
  );
};

export const userStackText = friends => {
  if (friends.length === 1) {
    return (
      <>
        {parseInt(friends[0].user.sex) === 2 ? "Подписал " : "Подписала "}
        {getLinkName(friends[0])}
      </>
    );
  }
  return (
    <>
      Подписали {}
      {friends.length === 2 ? (
        <>
          {getLinkName(friends[0])} и {getLinkName(friends[1])}
        </>
      ) : (
        <>
          {friends.slice(0, 3).map((item, index) => {
            return (
              <React.Fragment key={index}>
                {getLinkName(item)}
                {index !== 2 && ","}{" "}
              </React.Fragment>
            );
          })}
        </>
      )}
      {friends.length > 3 &&
        `и еще ${friends.length - 3} ${declOfNum(friends.length - 3, [
          "друг",
          "друга",
          "друзей"
        ])}`}
    </>
  );
};

export const filterString = string => {
  let clearString = string;

  clearString = clearString.replace(/[^\p{L}\p{N}\p{P}\p{S}\s]/gu, "");
  clearString = clearString.replace(/\n\n+/g, "\n\n");
  clearString = clearString.replace(/\t\t+/g, "\t");
  clearString = clearString.replace(/  +/g, " ");
  return clearString;
};

export const storeGoBack = () => {
  store.dispatch(goBack());
};

export const initPetitions = launchParameters => {
  return dispatch => {
    return new Promise((resolve, reject) => {
      loadPetitions(
        "petitions",
        launchParameters.vk_access_token_settings.includes("friends")
      )
        .then(r => {
          dispatch(setPopular(r.popular || []));
          dispatch(setLast(r.last || []));
          dispatch(setSigned(r.signed || []));
          dispatch(setManaged(r.managed || []));
          resolve();
        })
        .catch(() => {
          dispatch(setInitError(true));
          reject();
        });
    });
  };
};

export const reportPetition = petitionId => {
  return new Promise((resolve, reject) => {
    Backend.request(
      "reports",
      {
        petitionId
      },
      "POST"
    )
      .then(response => {
        resolve(response);
      })
      .catch(e => {
        reject(e);
      });
  });
};
