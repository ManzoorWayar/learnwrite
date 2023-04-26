import multer from "multer";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, "public/uploads/");
    },

    filename(req, file, cb) {
        cb(null, file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "video/mp4") {
        cb(null, true);
    } else {
        cb(
            {
                message: "Unsupported File Format",
            },
            false
        );
    }
};

const videoUploader = multer({
    storage,
    limits: {
        fieldNameSize: 200,
        fileSize: 30 * 1024 * 1024,
    },
    fileFilter,
}).single("video");

export default videoUploader
