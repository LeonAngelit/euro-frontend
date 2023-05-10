const utils = {
  nombreUsuarioRegex:
    /^(?=.{1,50}$)[a-zA-ZáéíóúüñÁÉÍÓÚÑ0-9]+(?:[\s][a-zA-ZáéíóúüñÁÉÍÓÚÑ0-9]+)*$/,
  passwordRegex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
};

export function validateRegex(regex, callback) {
  if (!utils.passwordRegex.test(regex)) {
    callback();
    return false;
  } else {
    return true;
  }
}

export default utils;
