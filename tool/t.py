import sys
from package.req import Req
from package.ddb import DDB
from package.s3 import S3
from package.moto import MOTO

# seed.
class SEED:
  def exec(self, arg1, arg2 = ""):
    s3 = S3()
    s3.exec("cb")
    s3.exec("pbc")
    moto = MOTO()
    moto.exec("cup")

# run.
def run():
  try:
    # 機能一覧.
    funcs = {
      "req": Req(),
      "ddb": DDB("ecsite"),
      "s3": S3(),
      "moto": MOTO(),
      "seed": SEED(),
    }

    # 引数を取り出す.
    arg1 = sys.argv[1] if len(sys.argv) >= 2 else ""
    arg2 = sys.argv[2] if len(sys.argv) >= 3 else ""
    arg3 = sys.argv[3] if len(sys.argv) >= 4 else ""

    # 実行.
    funcs.get(arg1, "").exec(arg2, arg3)

  except Exception as e:
    print(e)

run()