// NOTE: `any | null` (実際には`any`になる) は，APIの仕様がはっきりしないため暫定的にこうしている

export type LoginResponse =
  | {
      statusDto: {
        success: true;
        messageList: string[];
      };
      data: {
        userId: string;
        encryptedPassword: string;
        userName: string;
        userShkbtKbn: string;
        shokuinUserKbn: any | null;
        jinjiCd: any | null;
        kanriNo: number;
        gaksekiCd: string;
        name: string;
        nameKana: string;
        nameEng: string;
        nameDisp: string;
        validKikanStartDatetime: any | null;
        validKikanEndDatetime: any | null;
        menuPtnCd: any | null;
        langCd: string;
      };
    }
  | {
      statusDto: {
        success: false;
        messageList: string[];
      };
      data: null;
    };

export type ClassData = {
  /** 授業年度 */
  nendo: number;

  /** 授業コード */
  jugyoCd: string;

  /** 開講年度 */
  kaikoNendo: number;

  /** 開講学期 */
  gakkiNo: number;

  /**
   * 授業区分
   *
   * `"1"`: 通常授業
   *
   * `"6"`: 集中授業
   */
  jugyoKbn: string;

  /** 授業名 */
  jugyoName: string;

  /** 授業曜日 */
  kaikoYobi: number;

  /** 授業時限 */
  jigenNo: number;

  /**
   * 授業開始時間
   *
   * 集中講義の場合は `null` になる
   */
  jugyoStartTime: string | null;

  /**
   * 授業終了時間
   *
   * 集中講義の場合は `null` になる
   */
  jugyoEndTime: string | null;

  /** 指導教員名 */
  kyoinName: string;

  /** 教室名 */
  kyostName: string | null;

  keijiMidokCnt: number;
};

export type ClassScheduleResponse =
  | {
      statusDto: {
        success: true;
        messageList: string[];
      };
      data: {
        nendo: number;
        gakkiNo: number;
        gakkiName: string;
        jgkmDtoList: ClassData[];
        keijiCnt: number;
        funcIdList: string[];
        maxGakkiNo: number;
      };
    }
  | {
      statusDto: {
        success: false;
        messageList: string[];
      };
      data: null;
    };
