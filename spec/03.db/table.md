# テーブル名
  - ecsite-{stg}

# テーブル構造
  |Index|Attributes||||
  |--|--|--|--|--|
  ||uuid: S|key: S|value: S|list: S|
  |PrimaryKey|PK(※1)|SK(※2)||
  |GSI-General|pt(※3)|PK|SK|
  |GSI-List||pt|pt|PK|
  ||b0d647df-ed8a-4c63-893b-02738ee6e558|entity|goods||
  ||b0d647df-ed8a-4c63-893b-02738ee6e558|owner|seller#satou|goods|
  ||b0d647df-ed8a-4c63-893b-02738ee6e558|id|apple_001|goods||
  ||b0d647df-ed8a-4c63-893b-02738ee6e558|name|りんご|goods|
  ||b0d647df-ed8a-4c63-893b-02738ee6e558|explanation|りんごは、数ある果物の中でも人々に広く親しまれているものの一つです。||
  ||b0d647df-ed8a-4c63-893b-02738ee6e558|price|140|goods|
  ||b0d647df-ed8a-4c63-893b-02738ee6e558|image|20230928T073511479_Apple.jpeg|goods|
  ||b0d647df-ed8a-4c63-893b-02738ee6e558|category|foods||
  ||b0d647df-ed8a-4c63-893b-02738ee6e558|createAt|2023-11-24T10:12:28+09:00||
  ||b0d647df-ed8a-4c63-893b-02738ee6e558|updateAt|2023-11-24T10:12:28+09:00||

  - ※1: Partition Key
  - ※2: Sort Key
  - ※3: projection target(射影対象)

# 詳細説明
## Index
  - PrimaryKey
  - GSI-General
  - GSI-List

## Attributes
  - uuid
  - key
  - value
  - list

## key
  |Key名|説明|正規表現|補足|
  |--|--|--|--|
  |entity|データの実体|^(goods\|users)$||
  |owner|データの所有者|^(buyer\|seller\|admin\|)#{0,1000}$|(※1)|
  |id|ユーザーがデータを一意に特定するためのID|^[a-zA-Z0-9]{1,10}$||
  |name|商品の名称|^.{0,30}$||
  |explanation|商品の説明|^.{0,1000}$||
  |price|商品の値段(円)|^[1-9][0-9]{0,9}$||
  |image|S3バケットに格納した画像ファイルのキー名|^\d{8}T\d{9}_[A-Za-z0-9]{1,30}\.[A-Za-z0-9]+$||
  |category|商品の分類|^(foods\|clothes)$||
  |createAt|データの作成時刻|^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$|バックエンドで自動付加|
  |updateAt|データの更新時刻|^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+\d{2}:\d{2}$|バックエンドで自動付加|

### 補足
  - (※1)
    - ownerは、'#'を区切り文字とした複合ソートキーで表現する。
    - '#’の前半はオーナーの種別を示し、以下である。
      - buyer: 販売者
      - seller: 購入者
      - admin: 管理者
    - '#'の後半はオーナーの名前を示し、任意の文字列である。
    - 例えば、以下は'satou'という販売者がデータを所有していることを示す。
      - seller#satou