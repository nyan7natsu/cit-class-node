const CIT_PORTAL_URL = "https://portal.it-chiba.ac.jp";
const UPRX_WEBAPI = "/uprx/webapi/up";
const MAINTENANCE_MESSAGE =
  "申し訳ございません。ただいまサービス停止中です。（毎日 AM2：00～5：00）";

import { LoginResponse, ClassScheduleResponse } from "./types";

/**
 * CITClass Class
 */
export class CITClass {
  private fetch: (
    input: RequestInfo | URL,
    init?: RequestInit
  ) => Promise<Response>;

  private LOGIN_URL = CIT_PORTAL_URL + UPRX_WEBAPI + "/pk/Pky001Resource/login";
  private CLASS_URL =
    CIT_PORTAL_URL + UPRX_WEBAPI + "/ap/Apa004Resource/getJugyoKeijiMenuInfo";

  /**
   * CITClass Class Contructor
   * @param fetchImpl NodeJSデフォルトのfetchではなく，独自のリクエストメソッドを使いたい場合に指定する
   */
  constructor(
    fetchImpl: (
      input: RequestInfo | URL,
      init?: RequestInit
    ) => Promise<Response> = fetch
  ) {
    this.fetch = fetchImpl;
  }

  /**
   * ログインを行う
   * @param userId ユーザーID (アルファベット1文字 + 学籍番号)
   * @param password パスワード
   * @returns ログイン結果
   */
  public async login(userId: string, password: string): Promise<LoginResponse> {
    try {
      const resp = await this.fetch(this.LOGIN_URL, {
        method: "POST",
        body: JSON.stringify({
          data: {
            loginUserId: userId,
            plainLoginPassword: password,
          },
        }),
      });
      const body = decodeURIComponent(await resp.text());
      if (resp.status === 503 || body.includes(MAINTENANCE_MESSAGE)) {
        return {
          statusDto: {
            success: false,
            messageList: ["現在CITポータルは定期メンテナンス中です"],
          },
          data: null,
        };
      }
      const data: LoginResponse = JSON.parse(body);
      return data;
    } catch (e) {
      console.error("Login error:", e);
      return {
        statusDto: {
          success: false,
          messageList: ["CITポータルとの通信に失敗しました"],
        },
        data: null,
      };
    }
  }

  /**
   * 授業時間割の取得を行う
   *
   * パスワードまたは暗号化されたパスワードのどちらか一方を指定してください。
   * 両方の指定及び両方の未指定はエラーとなります。
   *
   * @param userId ユーザーID (アルファベット1文字 + 学籍番号)
   * @param password パスワード
   * @param encryptedPassword 暗号化されたパスワード (ログイン時に取得可能)
   * @returns 授業時間割取得結果
   */
  public async getClassSchedule(
    userId: string,
    password: string
  ): Promise<ClassScheduleResponse>;
  public async getClassSchedule(
    userId: string,
    encryptedPassword: string
  ): Promise<ClassScheduleResponse>;

  public async getClassSchedule(
    userId: string,
    password: string = "",
    encryptedPassword: string = ""
  ): Promise<ClassScheduleResponse> {
    if (
      (password === "" && encryptedPassword === "") ||
      (password !== "" && encryptedPassword !== "")
    ) {
      throw new Error(
        "パスワードまたは暗号化されたパスワードのどちらか一方を指定してください"
      );
    }
    try {
      const resp = await this.fetch(this.CLASS_URL, {
        method: "POST",
        body: JSON.stringify({
          productCd: "ap",
          langCd: "",
          loginUserId: userId,
          data: {
            autoLoginAuthCd: "",
            kaikoNendo: 0,
            gakkiNo: 0,
            deviceId: "",
          },
          plainLoginPassword: password,
          subProductCd: "apa",
          encryptedLoginPassword: encryptedPassword,
          deviceId: "",
        }),
      });
      const body = decodeURIComponent(await resp.text());
      if (resp.status === 503 || body.includes(MAINTENANCE_MESSAGE)) {
        return {
          statusDto: {
            success: false,
            messageList: ["現在CITポータルは定期メンテナンス中です"],
          },
          data: null,
        };
      }
      const data: ClassScheduleResponse = JSON.parse(body);
      return data;
    } catch (e) {
      console.error("Get class schedule error:", e);
      return {
        statusDto: {
          success: false,
          messageList: ["CITポータルとの通信に失敗しました"],
        },
        data: null,
      };
    }
  }
}
