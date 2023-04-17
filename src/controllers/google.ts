import {Credentials, OAuth2Client} from 'google-auth-library';
import { google } from 'googleapis';
const CLIENT_ID = '821807422785-pb5f6i3pro263i8qbd5s9oo2jg6lfp3n.apps.googleusercontent.com';
const CLIENT_SECRET = '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';

interface UserInfo {
    id: string;
    name: string;
    email: string;
    picture: string;
    // 필요한 경우에 따라 추가적인 필드들을 정의할 수 있습니다.
}
// Google OAuth2 인증 클라이언트 생성


// 로그인 페이지로 이동하는 함수
export const loginWithGoogle = (): string => {
    const REDIRECT_URI = `${process.env.SOCIAL_POSTBACK}/google`;
    console.log(REDIRECT_URI)
    const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, `${process.env.SOCIAL_POSTBACK}/google`);
    const url = client.generateAuthUrl({
        access_type: 'offline',
        scope: ['email', 'profile'],
        redirect_uri: REDIRECT_URI,
    });
    return url;
};

// 콜백 함수에서 토큰을 받아오는 함수
export const userGoogleOAuth = async (code: string): Promise<Credentials> => {
    const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, `${process.env.SOCIAL_POSTBACK}/google`);

    const { tokens } = await client.getToken(code);
    console.log("tokens")
    console.log(tokens)
    return tokens;
};



// 유저 정보를 가져오는 함수
export const getGoogleUserInfo = async (accessToken: string): Promise<any> => {
    const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, `${process.env.SOCIAL_POSTBACK}/google`);
    // Google OAuth2 클라이언트 설정
    client.setCredentials({ access_token: accessToken });

    // 구글 API 클라이언트 생성
    const googleClient = google.people({ version: 'v1', auth: client });

    // 구글 API 호출
    const { data } = await googleClient.people.get({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses',
    });
    console.log(data)
    // 필요한 유저 정보를 추출하여 반환
    return {
        name: data.names?.[0].displayName,
        email: data.emailAddresses?.[0].value,
    };
};
