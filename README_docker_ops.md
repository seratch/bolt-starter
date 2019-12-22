# Build and run Docker image

```bash
docker build -t my-bolt-app .
docker run \
  -p 3000:3000 \
  -e SLACK_BOT_TOKEN=${SLACK_BOT_TOKEN} \
  -e SLACK_SIGNING_SECRET=${SLACK_SIGNING_SECRET} \
  -it my-bolt-app
```

# Deploy to Google Cloud Run

```bash
gcloud config list # make sure if the project is valid
export GLOUD_PROJECT={your project}
export IMAGE_NAME=my-bolt-app
export SLACK_BOT_TOKEN=xoxb-xxx-yyy-zzz
export SLACK_SIGNING_SECRET=the-value

# Build a Docker image and upload it to Google's registry
gcloud builds submit --tag gcr.io/${GLOUD_PROJECT}/${IMAGE_NAME} .

# Deploy a Docker container to Google Cloud Run
gcloud run deploy \
  --image gcr.io/${GLOUD_PROJECT}/${IMAGE_NAME} \
  --platform managed \
  --update-env-vars SLACK_BOT_TOKEN=${SLACK_BOT_TOKEN},SLACK_SIGNING_SECRET=${SLACK_SIGNING_SECRET} # no space
```
