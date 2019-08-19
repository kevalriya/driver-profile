export const setCookie = (key, data, time) => {
  let date = new Date();
  date.setTime(date.getTime() + (time * 60 * 60 * 1000));
  let expires = "expires=" + date.toUTCString();
  document.cookie = key + "=" + JSON.stringify(data) + ";" + expires + ";path=/";
}

export const getCookie = (key) => {
  let keyStr = key + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
      let chars = cookieArray[i];
      while (chars.charAt(0) === ' ') {
          chars = chars.substring(1);
      }
      if (chars.indexOf(keyStr) === 0) {
          return chars.substring(keyStr.length, chars.length);
      }
  }
  return "";
}

export const deleteCookie = (key, domain) => {
  // overwrites and expires existing cookie
  document.cookie = key + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + domain;
}