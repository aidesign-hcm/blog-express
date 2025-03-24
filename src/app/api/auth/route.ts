import envConfig from "@/config";
import CryptoJS from 'crypto-js';

const SECRET_KEY = envConfig.CRYPTOJS_SECRECT; 

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionToken = body.sessionToken as string;
    const expiresAt = body.expiresAt as string;
    const user = body.user; 
    if (!sessionToken || !user || !user.rule) {
      return new Response(
        JSON.stringify({ message: 'Missing session token or user information' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    const encryptedRole = CryptoJS.AES.encrypt(user.rule, SECRET_KEY).toString(); // Encrypt the role
    const expiresDate = new Date(expiresAt).toUTCString();

    return new Response(
      JSON.stringify(body),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': [
            `sessionToken=${sessionToken}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure`,
            `userRole=${encryptedRole}; Path=/; HttpOnly; Expires=${expiresDate}; SameSite=Lax; Secure`,
          ].join(', '),
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
