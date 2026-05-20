# AWS S3 Setup

This guide walks through setting up an AWS account and an S3 bucket for the JRW Engineering app's project file storage.

The app keeps the bucket **private** and uses **presigned URLs** for uploads and downloads. This means files are not publicly accessible — every read/write is short-lived and signed by the app's IAM credentials.

## Required environment variables

By the end of this guide you'll have values for:

```
AWS_REGION=us-west-2
AWS_S3_BUCKET=jrwengineering
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

These get added to `.env` (local) and **Vercel → Settings → Environment Variables** (production).

---

## 1. Create an AWS account

If you don't already have one:

1. Go to <https://aws.amazon.com/> and click **Create an AWS Account**.
2. Enter email, account name (e.g., `JRW Engineering`), and a strong root password.
3. Choose **Personal** or **Business** account type — Business is appropriate here.
4. Add a payment method (a card is required even for the free tier).
5. Verify your phone number.
6. Choose the **Basic Support — Free** plan.

Once the account is created, **enable MFA on the root user immediately**:

1. Sign in to the AWS Console as root.
2. Top-right user menu → **Security credentials**.
3. Under **Multi-factor authentication (MFA)**, click **Assign MFA device** and follow the prompts (Authy, 1Password, Google Authenticator, etc.).

After enabling MFA, **stop using the root account for day-to-day work**. Create an admin IAM user and use that instead (covered below).

## 2. Pick a region

Choose an AWS region close to your users / Vercel deployment. Suggested:

- **us-west-2** (Oregon) — matches your Neon DB location
- **us-east-1** (N. Virginia) — cheapest, default for many tutorials

Stick with one region for everything. Note the region code (e.g., `us-west-2`); you'll need it for `AWS_REGION`.

## 3. Create the S3 bucket

1. AWS Console → search "S3" → **S3** service.
2. Make sure your selected region (top-right) matches the one you chose in step 2.
3. Click **Create bucket**.

Settings:

| Field | Value |
|---|---|
| Bucket name | `jrwengineering` (must be globally unique — add a suffix if taken) |
| AWS Region | The region from step 2 |
| Object Ownership | **ACLs disabled (recommended)** |
| Block Public Access settings | **Block all public access — checked** (leave default) |
| Bucket Versioning | **Enable** (recommended — protects against accidental deletes/overwrites) |
| Tags | Optional, e.g. `app=jrw-engineering` |
| Default encryption | **Server-side encryption with Amazon S3 managed keys (SSE-S3)** (default) |
| Bucket Key | **Enable** |

Click **Create bucket**.

Save the bucket name as `AWS_S3_BUCKET`.

## 4. Configure CORS on the bucket

Browser uploads via presigned URLs require CORS to allow the browser origin to PUT/GET directly to S3.

1. S3 Console → click your bucket → **Permissions** tab.
2. Scroll to **Cross-origin resource sharing (CORS)** → **Edit**.
3. Paste:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://www.jrwengineering.us"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Update `AllowedOrigins` to include any other domain you serve from (e.g., a Vercel preview URL if you upload from preview deployments). Click **Save changes**.

## 5. Create an IAM policy for the app

The app needs limited permissions on **only this bucket**.

1. AWS Console → **IAM** → **Policies** → **Create policy**.
2. Click the **JSON** tab and paste:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BucketLevel",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket",
        "s3:GetBucketLocation"
      ],
      "Resource": "arn:aws:s3:::jrwengineering"
    },
    {
      "Sid": "ObjectLevel",
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:GetObjectAttributes"
      ],
      "Resource": "arn:aws:s3:::jrwengineering/*"
    }
  ]
}
```

**Important:** make sure the bucket name in **both** `Resource` ARNs matches your actual bucket exactly. A mismatch is a silent 403 on uploads — the policy compiles fine but doesn't grant access to anything that exists.

3. **Next** → name it `JrwEngineeringS3Access` → **Create policy**.

## 6. Create an IAM user for the app

The app authenticates to S3 with an access key bound to a dedicated IAM user. Don't reuse your personal admin keys.

1. IAM → **Users** → **Create user**.
2. User name: `jrw-engineering-app`.
3. **Do not** check "Provide user access to the AWS Management Console" — this is a programmatic-only user.
4. **Next** → **Attach policies directly** → search for and check `JrwEngineeringS3Access` (the policy you just created).
5. **Next** → **Create user**.

## 7. Generate an access key

1. IAM → **Users** → click `jrw-engineering-app`.
2. **Security credentials** tab → scroll to **Access keys** → **Create access key**.
3. Use case: **Application running outside AWS**. Acknowledge the recommendation banner and continue.
4. Description tag (optional): `vercel-production`.
5. Click **Create access key**.
6. **Copy both values now** — the secret is shown only once:
   - **Access key ID** → `AWS_ACCESS_KEY_ID`
   - **Secret access key** → `AWS_SECRET_ACCESS_KEY`

If you lose the secret, delete the access key and create a new one — they cannot be recovered.

## 8. Add the variables

### Local development

Add to `.env` (do not commit):

```
AWS_REGION=us-west-2
AWS_S3_BUCKET=jrwengineering
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
```

### Vercel production

**Vercel → Project → Settings → Environment Variables** → add each of the four vars to the **Production** environment (and **Preview** if you want previews to talk to S3 too). Redeploy for changes to take effect.

## 9. Verify

A quick sanity check from your terminal once `.env` is set:

```bash
npx tsx -e "
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import 'dotenv/config';
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const r = await s3.send(new ListObjectsV2Command({ Bucket: process.env.AWS_S3_BUCKET }));
console.log('OK — bucket reachable. Object count:', r.KeyCount ?? 0);
"
```

Expected output: `OK — bucket reachable. Object count: 0`. Any other error means the credentials, region, or policy is misconfigured.

---

## Optional hardening

- **Lifecycle rule**: auto-delete incomplete multipart uploads after 7 days (S3 → Bucket → Management → Create lifecycle rule).
- **Object expiration**: if you want to age out old non-current versions (paired with versioning), add a rule for that too.
- **CloudTrail**: enable to log all S3 API calls for audit purposes.
- **Budget alert**: AWS Billing → Budgets → create a $5–10/month alert so unexpected usage shows up early.

## Costs

For a low-traffic internal tool, monthly S3 cost is typically **under $1**:

- Storage: ~$0.023/GB/month (Standard, us-west-2)
- Requests: $0.005 per 1k PUT, $0.0004 per 1k GET
- Egress to internet: $0.09/GB (first 100GB/month free)

The 12-month free tier (new accounts) includes 5GB storage, 20k GETs, and 2k PUTs per month.

## Rotating the access key

Every 90 days (or sooner if leaked):

1. IAM → Users → `jrw-engineering-app` → Security credentials.
2. **Create access key** for the new key — note the values.
3. Update `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` in Vercel and redeploy.
4. Verify the app still works.
5. Back in IAM, **deactivate** the old key. Wait a day or two with no errors, then **delete** it.
