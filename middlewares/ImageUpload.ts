import multer from "multer";

const imageStorage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, "images")
    },
    filename: function(req, file, cb){
        cb(null, new Date().toISOString().replace(/:/g,"_") + "_" + file.originalname) 
    }
})

export const ImageUpload = multer({storage: imageStorage}).array("images", 10);