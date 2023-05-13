const utils = {
  nombreUsuarioRegex:
    /^(?=.{5,25}$)[a-zA-ZáéíóúüñÁÉÍÓÚÑ0-9_]+(?:[\s][a-zA-ZáéíóúüñÁÉÍÓÚÑ0-9]+)*$/,
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

export function validateUserNameRegex(regex, callback) {
  if (!utils.nombreUsuarioRegex.test(regex)) {
    callback();
    return false;
  } else {
    return true;
  }
}

export default utils;
