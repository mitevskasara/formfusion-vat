declare module "@formfusion/vat" {
  type Vat = {
    AT: string;
    BE: string;
    BG: string;
    HR: string;
    CY: string;
    CZ: string;
    DK: string;
    EE: string;
    FI: string;
    FR: string;
    DE: string;
    EL: string;
    HU: string;
    IE: string;
    IT: string;
    LV: string;
    LT: string;
    LU: string;
    MT: string;
    NL: string;
    PL: string;
    RO: string;
    SK: string;
    SI: string;
    ES: string;
    SE: string;
    AL: string;
    MK: string;
    AU: string;
    BY: string;
    CA: string;
    IS: string;
    IN: string;
    ID: string;
    IL: string;
    KZ: string;
    NZ: string;
    NG: string;
    NO: string;
    PH: string;
    RU: string;
    SM: string;
    SA: string;
    RS: string;
    TR: string;
    UA: string;
    GB: string;
    UZ: string;
    AR: string;
    BO: string;
    BR: string;
    CL: string;
    CO: string;
    CR: string;
    EC: string;
    SV: string;
    GT: string;
    HN: string;
    MX: string;
    NI: string;
    PA: string;
    PY: string;
    PE: string;
    DO: string;
    UY: string;
    VE: string;
  };

  type LowercaseKeys<T> = {
    [K in keyof T as K extends string ? Lowercase<K> : never]: T[K];
  };

  const vat: LowercaseKeys<Vat>;

  export = vat;
}
