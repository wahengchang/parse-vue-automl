const express = require('express')
const router = express.Router()
const formidable = require('formidable');
const automl = require('../lib/automl')

const modelId=process.env.GOOGLE_AUTOML_MODEL_ID
const projectId=process.env.GOOGLE_AUTOML_PROJECT_ID

const downloadSingleFileToLocal = (req) => {
    return new Promise((resolve, reject)=>{
        const timestamp = `${new Date().getTime()}`

        const form = new formidable.IncomingForm();
    
        form.parse(req);
    
        form.on('fileBegin', function (name, file){
            const filename = `${timestamp}-${file.name}`
            file.path = `${__dirname}/../../images/${filename}`
        })
    
        form.on('file', function (name, file){
            console.log('Uploaded:' + `${timestamp}-${file.name}`);
            const filename = `${timestamp}-${file.name}`
            return resolve({
                filename,
                local: `${__dirname}/../../images/${filename}`,
                url: `/apis/files/download/${timestamp}-${file.name}`
            })
        });
    })
}

router.use('/upload', async (req, res) => {
    try {
        const file = await downloadSingleFileToLocal(req)
        console.log(file)

        const result = await automl.prediction(projectId, modelId, file.local)
        return res.status(200).json({...result})
    }
    catch(e){
        console.log('[ERROR] ',e)
        res.status(500)
        return res.json(e)
    }
})

module.exports = router