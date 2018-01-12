export default function (Vue) {
  const TOKEN = 'token'
  const EXPIRATION = 'expiration'

  Vue.auth = {
    setToken(token, expiration) {
      localStorage.setItem(TOKEN, token);
      localStorage.setItem(EXPIRATION, expiration);
    },
    getToken() {
      const token = localStorage.getItem(TOKEN);
      const expiration = localStorage.getItem(EXPIRATION);
      if (!token || !expiration) {
        return null;
      }
      if (parseInt(expiration) < Date.now()) {
        this.destroyToken();
        return null;
      } else {
        return token;
      }
    },
    destroyToken() {
      localStorage.removeItem(TOKEN);
      localStorage.removeItem(EXPIRATION);
    },
    isAuthenticated() {
      if (this.getToken()) {
        return true;
      } else {
        return false;
      }
    }
  }
  Object.defineProperties(Vue.prototype, {
    $auth: {
      get: () => {
        return Vue.auth;
      }
    }
  });
}