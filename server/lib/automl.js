
const automl = require('@google-cloud/automl');
const fs = require('fs');

const prediction = async (projectId, modelId, filePath, options = {}) => {
    const {computeRegion = 'us-central1', scoreThreshold = 0.7} = options
    if (!projectId) throw new Error(`projectId is required: ${projectId}`)
    if (!filePath) throw new Error(`filePath is required: ${filePath}`)
    if (!modelId) throw new Error(`modelId is required: ${modelId}`)

    console.log(`[INFO] projectId: ${projectId}`)
    console.log(`[INFO] filePath: ${filePath}`)
    console.log(`[INFO] modelId: ${modelId}`)
    console.log(`[INFO] computeRegion: ${computeRegion}`)
    console.log(`[INFO] scoreThreshold: ${scoreThreshold}`)

    // Create client for prediction service.
    const client = new automl.PredictionServiceClient();

    // Get the full path of the model.
    const modelFullId = client.modelPath(projectId, computeRegion, modelId);


    // Read the file content for prediction.
    const content = fs.readFileSync(filePath)

    const params = {};

    if (scoreThreshold) {
        params.score_threshold = scoreThreshold;
    }

    // Set the payload by giving the content and type of the file.
    const payload = {};
    payload.image = { imageBytes: content };

    // params is additional domain-specific parameters.
    // currently there is no additional parameters supported.
    const [response] = await client.predict({
        name: modelFullId,
        payload: payload,
        params: params,
    });
    console.log('Prediction results:');
    response.payload.forEach(result => {
        console.log(`Predicted class name: ${result.displayName}`);
        console.log(`Predicted class score: ${result.classification.score}`);
    });

    return response
}

module.exports = {
    prediction
}