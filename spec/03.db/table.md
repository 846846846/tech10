# テーブル名
  - ECSite

# テーブル構造
  |Index|Attributes||||
  |--|--|--|--|--|
  ||uuid: S|key: S|value: S|ownerid: S|
  |PrimaryKey|PK|SK||
  |GSI-General|(projection)|PK|SK|
  |GSI-OwnerGoodsList||(projection)|(projection)|PK|
  ||{uuid-1}|entity|goods||
  ||{uuid-1}|owner|{ownerid}|{ownerid}|
  ||{uuid-1}|id|{id}|{ownerid}||
  ||{uuid-1}|name|{name}|{ownerid}|
  ||{uuid-1}|explanation|{explanation}||
  ||{uuid-1}|price|{price}|{ownerid}|
  ||{uuid-1}|image|{filename}|{ownerid}|
  ||{uuid-1}|category|{category}||
  ||{uuid-1}|createAt|{ISO8601}||
  ||{uuid-1}|updateAt|{ISO8601}||

# 各データの説明
## entity
  - 説明
    - データの実体(商品、ユーザーなど)。
  - 型
    - Enum
  - リスト(Enum型のみ)
    - 未定義[TODO]
  - 正規表現
    - ^[a-zA-Z0-9]+$

## owner
  - 説明
    - データの所有者。
  - 型
    - Enum
  - リスト(Enum型のみ)
    - buyer: 購入者
    - seller: 販売者
    - admin: 管理者
    - meta: メタ(開発者が利用するメタ情報)
  - 正規表現
    - ^[a-zA-Z0-9]{10}$

## id
  - 説明
    - データを一意に特定するID。
    - パーティションキーとは異なる。
    - 購入者や販売者も参照できる。
  - 型
    - string
  - 正規表現
    - ^[a-zA-Z0-9]{1,10}$

## name
  - 説明
    - 商品の名称。
  - 型
    - string
  - 正規表現
    - ^.{0,30}$

## explanation
  - 説明
    - 商品の説明。
  - 型
    - string
  - 正規表現
    - ^.{0,1000}$

## price
  - 説明
    - 商品の値段(円)。
  - 型
    - number
  - 正規表現
    - ^[1-9][0-9]{0,9}$

## image
  - 説明
    - S3バケットに格納した画像ファイルのキー名。
  - 型
    - string
  - 正規表現
    - なし

## category
  - 説明
    - 商品の分類。
    - 例：「家電」「ファッション」「食品」。
  - 型
    - Enum
  - リスト(Enum型のみ)
    - 未定義[TODO]
  - 正規表現
    - ^[a-zA-Z0-9]+$

## createAt
  - 説明
    - データの新規作成時刻
    - バックエンドで自動付加。
  - 型
    - Date(ISO8601)
  - 正規表現
    - なし

## updateAt
  - 説明
    - データの更新時刻。
    - バックエンドで自動付加。
  - 型
    - Date(ISO8601)
  - 正規表現
    - なし
