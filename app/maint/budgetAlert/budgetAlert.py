import boto3

def lambda_handler(event, context):
    print("rcv budget alert --> start cloudfront stop")
    client = boto3.client('cloudfront')
    distribution_id = 'E2ZL9XK4Q9GW1Y'
    response = client.get_distribution_config(Id=distribution_id)
    etag = response['ETag']
    config = response['DistributionConfig']
    config['Enabled'] = False
    update_response = client.update_distribution(
        DistributionConfig=config,
        Id=distribution_id,
        IfMatch=etag
    )
    print(update_response)
    print("end cloudfront stop")
    return
