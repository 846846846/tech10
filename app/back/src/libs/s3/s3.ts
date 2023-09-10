import { S3Client, ListObjectsV2Command, CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const REGION: string = process.env.REGION!

const sourceBucketName = '/temp'
const destinationBucketName = 'YOUR_DESTINATION_BUCKET_NAME'
const s3Client = new S3Client({ region: REGION })

async function moveObjects() {
  let continuationToken

  do {
    const listObjectsResponse = await s3Client.send(
      new ListObjectsV2Command({
        Bucket: sourceBucketName,
        ContinuationToken: continuationToken,
      })
    )

    if (!listObjectsResponse.Contents) {
      console.error('No objects found in the source bucket.')
      return
    }

    for (const object of listObjectsResponse.Contents) {
      if (!object.Key) continue

      const copySource = encodeURIComponent(sourceBucketName + '/' + object.Key)

      try {
        // Copy the object to the destination bucket
        await s3Client.send(
          new CopyObjectCommand({
            Bucket: destinationBucketName,
            CopySource: copySource,
            Key: object.Key,
          })
        )

        // Delete the object from the source bucket
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: sourceBucketName,
            Key: object.Key,
          })
        )

        console.log(`Moved ${object.Key} to ${destinationBucketName}`)
      } catch (error) {
        console.error(`Error moving ${object.Key}:`, error)
      }
    }

    // Set the continuationToken for the next iteration, if it exists.
    continuationToken = listObjectsResponse.NextContinuationToken
  } while (continuationToken)
}
