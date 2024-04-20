import subprocess
import json
import os
class DDB:
  def __init__(self):
    self.db_table = "ecsite" # 適時変更.
    self.file_path = "../app/back/dynamodb-table.json"
    self.rocal = " --endpoint-url http://localhost:8000"

  # private.
  def _lt(self, op1):
    cmd = "aws dynamodb list-tables" + ( "" if op1 == "remote" else self.rocal )
    print(cmd)
    return subprocess.run(cmd)

  def _dest(self, op1):
    cmd = "aws dynamodb describe-table --table-name " + self.db_table + ( "" if op1 == "remote" else self.rocal )
    print(cmd)
    return subprocess.run(cmd)

  def _create(self, op1):
    # CloudFormationと--cli-input-jsonで指定可能な定義が異なるためJSONファイルを微調整.
    with open(self.file_path, 'r') as file:
      data = json.load(file)

    with open("properties.json", 'w') as file:
      json.dump(data['Properties'], file, indent=4)

    cmd = "aws dynamodb create-table --cli-input-json file://properties.json" + ( "" if op1 == "remote" else self.rocal )
    print(cmd)
    result = subprocess.run(cmd)
    os.remove("properties.json")  # 調整後のJSONファイルは削除.
    return result

  # public.
  def exec(self, arg1, arg2 = ""):
    cmdList = {
      "lt"  : self._lt,
      "dest": self._dest,
      "create": self._create,
    }
    result = cmdList.get(arg1, self._lt)(arg2)
    print(result)

