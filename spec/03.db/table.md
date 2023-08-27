# Table: ECSite
  |Index|Attributes|||
  |--|--|--|--|
  ||uuid: S|key: S|value: S|
  |PrimaryKey|PK|SK||
  |GSI-General|(projection)|PK|SK|
  ||{uuid-1}|entity|goods|
  ||{uuid-1}|owner|{ownerid}|
  ||{uuid-1}|id|{id}|
  ||{uuid-1}|name|{name}|
  ||{uuid-1}|explanation|{explanation}|
  ||{uuid-1}|price|{price}|
  ||{uuid-1}|image|{S3-path}|
  ||{uuid-1}|category|{category}|

# entity
  - 正規表現
    - ^[a-zA-Z0-9]+$
  - 列挙型
    - goods

# owner
  - 正規表現
    - ^[a-zA-Z0-9]{20}$


