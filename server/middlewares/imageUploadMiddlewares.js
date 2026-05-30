import multer from 'multer'

const storage = multer.diskStorage({
    destination : (req,file,cb) => {
        cb(null , "uploads")
    },
    filename : (req , file , cb) => {
        const fileName = Date.now() + '.' + file.originalname.split(".")[1]
        cb(null , fileName)
    }
})


const upload = multer({storage : storage})

export default upload






// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, '/tmp/my-uploads')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix)
//   }
// })

// const upload = multer({ storage: storage })