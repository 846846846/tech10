# Table: ECSite
  |Index|Attributes||||
  |--|--|--|--|--|
  ||uuid: S|key: S|value: S|ownerid: S|
  |PrimaryKey|PK|SK||
  |GSI-General|(projection)|PK|SK|
  |GSI-OwnerGoodsList||(projection)|(projection)|PK|
  ||{uuid-1}|entity|goods||
  ||{uuid-1}|owner|{ownerid}||
  ||{uuid-1}|id|{id}|{ownerid}||
  ||{uuid-1}|name|{name}|{ownerid}|
  ||{uuid-1}|explanation|{explanation}||
  ||{uuid-1}|price|{price}||
  ||{uuid-1}|image|{S3-path}||
  ||{uuid-1}|category|{category}||
  ||{uuid-1}|createAt|{ISO8601}||
  ||{uuid-1}|updateAt|{ISO8601}||

# entity
  - 正規表現
    - ^[a-zA-Z0-9]+$
  - 列挙型
    - goods

# owner
  - 正規表現
    - ^[a-zA-Z0-9]{20}$


