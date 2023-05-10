function useValidateToken(token) {
  const difference = (Date.now() - parseInt(token)) / 3600000;
  if (difference >= 24) {
    return false;
  }
  return true;
}

export default useValidateToken;
