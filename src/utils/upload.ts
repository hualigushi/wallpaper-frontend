// @ts-ignore
export const isCredentialsExpired=(credentials) =>{
    if (!credentials) {
      return true;
    }
    const expireDate = new Date(credentials.Expiration);
    const now = new Date();
    // 如果有效期不足一分钟，视为过期。
    return expireDate.getTime() - now.getTime() <= 60000;
  }