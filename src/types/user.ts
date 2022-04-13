export interface UserData {
    id: string; // user.id
    email: string; // user.email
    emailVerified: boolean; // user.emailVerified
    createdAt: string; // user.createdAt
    accessToken: string; // _tokenResponse.idToken
    refreshToken: string; // _tokenResponse.refreshToken
}
