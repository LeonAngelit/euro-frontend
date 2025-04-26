function useValidateToken(token) {
  if(!token){
    return false;
  }
  const difference = (Date.now() - parseInt(token)) / 3600000;
  if (difference >= 24) {
    return false;
  }
  return true;
}

export default useValidateToken;
