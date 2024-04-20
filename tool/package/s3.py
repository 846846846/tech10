import subprocess

class S3:
  # private.

  # public.
  def exec(self, arg1, arg2 = ""):
    cmdList = {
      # bukect.
      "cb" : "aws s3api create-bucket --bucket images --endpoint-url=http://localhost:4566 --profile localstack --region ap-northeast-1 --create-bucket-configuration LocationConstraint=ap-northeast-1",
      "lb" : "aws s3api list-buckets --endpoint-url=http://localhost:4566 --profile localstack",
      "db" : "aws s3api delete-bucket --bucket images --endpoint-url=http://localhost:4566",
      
      # bukect-cors.
      "gbc": "aws s3api get-bucket-cors --bucket images --endpoint-url=http://localhost:4566",
      "pbc": "aws s3api put-bucket-cors --bucket images --cors-configuration file://assets/cors.json --endpoint-url=http://localhost:4566",

      # object.
      "lo": "aws s3api list-objects --bucket images --endpoint-url=http://localhost:4566",
      "dall": "aws s3 rm s3://images --recursive --endpoint-url=http://localhost:4566",
      "do": "aws s3api delete-object --bucket images --key temp/90e1a7ae-c98f-4945-85d5-cca89b32ab27.jpeg  --endpoint-url=http://localhost:4566"
    }
    cmd = cmdList.get(arg1, "na")
    print(cmd)
    subprocess.run(cmd)