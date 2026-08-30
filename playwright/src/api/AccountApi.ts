import { APIRequestContext, expect } from '@playwright/test';

export type CreatedUser = {
  userID: string;
  userName: string;
  password: string;
  token: string;
};

export class AccountApi {
  constructor(private readonly request: APIRequestContext) {}

  async createUser(userName: string, password: string): Promise<{ userID: string }> {
    const res = await this.request.post('/Account/v1/User', {
      data: { userName, password },
    });
    expect(res.status(), `Create user failed: ${await res.text()}`).toBe(201);
    const body = await res.json();
    return { userID: body.userID };
  }

  async generateToken(userName: string, password: string): Promise<string> {
    const res = await this.request.post('/Account/v1/GenerateToken', {
      data: { userName, password },
    });
    expect(res.status(), `Generate token failed: ${await res.text()}`).toBe(200);
    const body = await res.json();
    expect(body.status, `Token generation not Success: ${body.result}`).toBe('Success');
    return body.token;
  }

  async deleteUser(userID: string, token: string): Promise<void> {
    try {
      await this.request.delete(`/Account/v1/User/${userID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.warn(`Cleanup: failed to delete user ${userID}:`, err);
    }
  }

  async setupUser(userName: string, password: string): Promise<CreatedUser> {
    const { userID } = await this.createUser(userName, password);
    const token = await this.generateToken(userName, password);
    return { userID, userName, password, token };
  }
}

export function generateUniqueUserName(prefix = 'xenith_test'): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}_${ts}_${rand}`;
}
