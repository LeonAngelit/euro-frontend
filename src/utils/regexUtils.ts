const utils = {
  nombreUsuarioRegex: /^(?=.{5,25}$)[a-zA-Z0-9_]+(?:[a-zA-Z0-9]+)*$/,
  passwordRegex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/,
  emailRegex: /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
};

export function validateRegex(regex: string, callback?: () => void): boolean {
  if (!utils.passwordRegex.test(regex)) {
    if (callback) callback();
    return false;
  } else {
    return true;
  }
}

export function validateEmailRegex(
  regex: string,
  callback?: () => void,
): boolean {
  if (!utils.emailRegex.test(regex)) {
    if (callback) callback();
    return false;
  } else {
    return true;
  }
}

export function validateUserNameRegex(
  regex: string,
  callback?: () => void,
): boolean {
  if (!utils.nombreUsuarioRegex.test(regex)) {
    if (callback) callback();
    return false;
  } else {
    return true;
  }
}

export default utils;
