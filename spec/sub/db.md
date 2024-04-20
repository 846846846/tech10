# アクセスパターン
  |ユースケース|アクセスパターン|ベーステーブル/GSI/LSI|操作|パーティションキー値|ソートキー値|その他の条件/フィルター|
  |--|--|--|--|--|--|--|
  |商品(Product)を作成する|createProduct|ベーステーブル|PutItem|PK=ProductId|SK=ProductId||
  |商品(Product)を閲覧する|getProduct|ベーステーブル|getItem|PK=ProductId|SK=ProductId||
  |商品(Product)を更新する|updateProduct|ベーステーブル|UpdateItem|PK=ProductId|SK=ProductId||
  |商品(Product)を削除する|deleteProduct|ベーステーブル|DeleteItem|PK=ProductId|SK=ProductId||
  |商品(Product)の一覧を閲覧する|getAllProduct|GSI-ListFromEntity|Query|PK=Product|||
  |注文(Order)を作成する|createOrder|ベーステーブル|PutItem|PK=OrderId|PK=OrderId||
  |注文(Order)を閲覧する|getOrder|ベーステーブル|getItem|PK=OrderId|PK=OrderId||
  |注文(Order)を更新する|updateOrder|ベーステーブル|UpdateItem|PK=OrderId|PK=OrderId||
  |注文(Order)を削除する|deleteOrder|ベーステーブル|DeleteItem|PK=OrderId|PK=OrderId||
  |注文(Order)の一覧を閲覧する|getAllOrder|GSI-ListFromEntity|Query|PK=Order|||
  |顧客(Customer)を作成する|-|-|-|||Cognito管理|
  |顧客(Customer)を閲覧する|-|-|-|||Cognito管理|
  |顧客(Customer)を更新する|-|-|-|||Cognito管理|
  |顧客(Customer)を削除する|-|-|-|||Cognito管理|
  |所有者(Owner)を作成する|-|-|-|||Cognito管理|
  |所有者(Owner)を閲覧する|-|-|-|||Cognito管理|
  |所有者(Owner)を更新する|-|-|-|||Cognito管理|
  |所有者(Owner)を削除する|-|-|-|||Cognito管理|

# エンティティ関係図(ER)
  - [こちら](./er.mermaid)

# スキーマ設計(NoSQL Workbench)
  - [こちら](./ECSite.json)
