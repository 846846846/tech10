import subprocess

class DDB:
  def __init__(self, db_table):
    self.db_table = db_table

  # private.

  # public.
  def exec(self, arg1, arg2 = ""):
    cmdList = {
      "lt"  : "aws dynamodb list-tables",
      "dest": "aws dynamodb describe-table --table-name " + self.db_table,
    }
    cmd = cmdList.get(arg1, "na")
    if(arg2 != "remote"):
      cmd = cmd + " --endpoint-url http://localhost:8000"

    print(cmd)
    subprocess.run(cmd)