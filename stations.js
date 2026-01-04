// エリア・都道府県・放送局の階層データ
const stationData = {
  "hokkaido": {
    name: "北海道",
    prefectures: {
      "hokkaido": {
        name: "北海道",
        stations: [
          { id: "HBC", name: "HBCラジオ" },
          { id: "STV", name: "STVラジオ" },
          { id: "AIR-G", name: "AIR-G'（FM北海道）" },
          { id: "NORTHWAVE", name: "FM NORTH WAVE" }
        ]
      }
    }
  },
  "tohoku": {
    name: "東北",
    prefectures: {
      "aomori": {
        name: "青森",
        stations: [
          { id: "RAB", name: "RAB青森放送" },
          { id: "AFB", name: "エフエム青森" }
        ]
      },
      "iwate": {
        name: "岩手",
        stations: [
          { id: "IBC", name: "IBC岩手放送" },
          { id: "FMI", name: "エフエム岩手" }
        ]
      },
      "miyagi": {
        name: "宮城",
        stations: [
          { id: "TBC", name: "TBCラジオ" },
          { id: "DATEFM", name: "Date fm" }
        ]
      },
      "akita": {
        name: "秋田",
        stations: [
          { id: "ABS", name: "ABS秋田放送" },
          { id: "AFM", name: "エフエム秋田" }
        ]
      },
      "yamagata": {
        name: "山形",
        stations: [
          { id: "YBC", name: "YBC山形放送" },
          { id: "RFM", name: "Rhythm Station" }
        ]
      },
      "fukushima": {
        name: "福島",
        stations: [
          { id: "RFC", name: "ラジオ福島" },
          { id: "FMF", name: "ふくしまFM" }
        ]
      }
    }
  },
  "kanto": {
    name: "関東",
    prefectures: {
      "tokyo": {
        name: "東京",
        stations: [
          { id: "TBS", name: "TBSラジオ" },
          { id: "QRR", name: "文化放送" },
          { id: "LFR", name: "ニッポン放送" },
          { id: "RN1", name: "ラジオNIKKEI第1" },
          { id: "RN2", name: "ラジオNIKKEI第2" },
          { id: "INT", name: "InterFM897" },
          { id: "FMT", name: "TOKYO FM" },
          { id: "FMJ", name: "J-WAVE" },
          { id: "HOUSOU-DAIGAKU", name: "放送大学" }
        ]
      },
      "kanagawa": {
        name: "神奈川",
        stations: [
          { id: "JORF", name: "ラジオ日本" },
          { id: "YFM", name: "FMヨコハマ" }
        ]
      },
      "saitama": {
        name: "埼玉",
        stations: [
          { id: "NACK5", name: "NACK5" }
        ]
      },
      "chiba": {
        name: "千葉",
        stations: [
          { id: "BAYFM78", name: "bayfm78" }
        ]
      },
      "gunma": {
        name: "群馬",
        stations: [
          { id: "FM_GUNMA", name: "FM GUNMA" }
        ]
      },
      "tochigi": {
        name: "栃木",
        stations: [
          { id: "CRT", name: "栃木放送" },
          { id: "RADIO_BERRY", name: "RADIO BERRY" }
        ]
      },
      "ibaraki": {
        name: "茨城",
        stations: [
          { id: "IBS", name: "LuckyFM 茨城放送" }
        ]
      }
    }
  },
  "chubu": {
    name: "中部・北陸・甲信越",
    prefectures: {
      "aichi": {
        name: "愛知",
        stations: [
          { id: "CBC", name: "CBCラジオ" },
          { id: "TOKAI", name: "東海ラジオ" },
          { id: "FMA", name: "FM AICHI" },
          { id: "ZIP-FM", name: "ZIP-FM" }
        ]
      },
      "shizuoka": {
        name: "静岡",
        stations: [
          { id: "SBS", name: "SBSラジオ" },
          { id: "K-MIX", name: "K-MIX" }
        ]
      },
      "nagano": {
        name: "長野",
        stations: [
          { id: "SBC", name: "SBCラジオ" },
          { id: "FMN", name: "FM長野" }
        ]
      },
      "niigata": {
        name: "新潟",
        stations: [
          { id: "BSN", name: "BSNラジオ" },
          { id: "FMNIIGATA", name: "FM-NIIGATA" },
          { id: "FMPORT", name: "FM PORT" } 
        ]
      },
      "yamanashi": {
        name: "山梨",
        stations: [
          { id: "YBS", name: "YBSラジオ" },
          { id: "FM-FUJI", name: "FM FUJI" }
        ]
      },
      "ishikawa": {
        name: "石川",
        stations: [
          { id: "MRO", name: "MROラジオ" },
          { id: "HELLO5", name: "エフエム石川" }
        ]
      },
      "toyama": {
        name: "富山",
        stations: [
          { id: "KNB", name: "KNBラジオ" },
          { id: "FMTOYAMA", name: "FMとやま" }
        ]
      },
      "fukui": {
        name: "福井",
        stations: [
          { id: "FBC", name: "FBCラジオ" },
          { id: "FMFUKUI", name: "FM福井" }
        ]
      }
    }
  },
  "kinki": {
    name: "近畿",
    prefectures: {
      "osaka": {
        name: "大阪",
        stations: [
          { id: "ABC", name: "ABCラジオ" },
          { id: "MBS", name: "MBSラジオ" },
          { id: "OBC", name: "OBCラジオ大阪" },
          { id: "CCL", name: "FM COCOLO" },
          { id: "802", name: "FM802" },
          { id: "FMO", name: "FM大阪" }
        ]
      },
      "hyogo": {
        name: "兵庫",
        stations: [
          { id: "CRK", name: "ラジオ関西" },
          { id: "KISSFMKOBE", name: "Kiss FM KOBE" }
        ]
      },
      "kyoto": {
        name: "京都",
        stations: [
          { id: "KBS", name: "KBS京都" },
          { id: "ALPHA-STATION", name: "α-STATION" }
        ]
      },
      "shiga": {
        name: "滋賀",
        stations: [
          { id: "E-RADIO", name: "e-radio FM滋賀" }
        ]
      },
      "wakayama": {
        name: "和歌山",
        stations: [
          { id: "WBS", name: "WBS和歌山放送" }
        ]
      }
    }
  },
  "chugoku_shikoku": {
    name: "中国・四国",
    prefectures: {
      "hiroshima": {
        name: "広島",
        stations: [
          { id: "RCC", name: "RCCラジオ" },
          { id: "HFM", name: "広島FM" }
        ]
      },
      "okayama": {
        name: "岡山",
        stations: [
          { id: "RSK", name: "RSKラジオ" },
          { id: "FM-OKAYAMA", name: "FM岡山" }
        ]
      },
      "ehime": {
        name: "愛媛",
        stations: [
          { id: "RNB", name: "RNB南海放送" },
          { id: "JOEU-FM", name: "FM愛媛" }
        ]
      },
      "fukuoka": {
        name: "福岡",
        stations: [
          { id: "RKB", name: "RKBラジオ" },
          { id: "KBC", name: "KBCラジオ" },
          { id: "LOVEFM", name: "LOVE FM" },
          { id: "CROSSFM", name: "CROSS FM" },
          { id: "FMFUKUOKA", name: "FM FUKUOKA" }
        ]
      }
    }
  },
  "kyushu_okinawa": {
    name: "九州・沖縄",
    prefectures: {
      "fukuoka": {
        name: "福岡",
        stations: [
           // 上記中国・四国枠に入れてしまったので重複注意（便宜上ここにも記載）
          { id: "RKB", name: "RKBラジオ" },
          { id: "KBC", name: "KBCラジオ" },
          { id: "FMFUKUOKA", name: "FM FUKUOKA" }
        ]
      },
      "okinawa": {
        name: "沖縄",
        stations: [
          { id: "RBC", name: "RBCiラジオ" },
          { id: "ROK", name: "ラジオ沖縄" },
          { id: "FM_OKINAWA", name: "FM沖縄" }
        ]
      }
      // 他県も同様に追加可能
    }
  }
};