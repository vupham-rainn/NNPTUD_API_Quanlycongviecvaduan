const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); 
const Project = require('../schemas/project'); 


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });

const Attachment = require('../schemas/attachment'); 

router.post('/', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Vui lòng chọn file!" });

        const { projectId, userId } = req.body; 
        
     
        const newAttachment = new Attachment({
            name: req.file.originalname,
            path: req.file.filename,
            project: projectId,
            uploadedBy: userId
        });

        const savedFile = await newAttachment.save();

        res.status(200).json({ 
            message: "Lưu vào Database thành công!", 
            file: savedFile 
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi lưu DB: " + err.message });
    }
});

router.delete('/:projectId/:fileName', async (req, res) => {
    try {
        const { projectId, fileName } = req.params;

        await Project.findByIdAndUpdate(projectId, {
            $pull: { files: { path: fileName } }
        });

       
        const filePath = path.join(__dirname, '../uploads/', fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        res.json({ message: "Đã xóa file thành công khỏi hệ thống" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const Attachment = require('../schemas/attachment');
        const files = await Attachment.find().sort({ createdAt: -1 });
        res.json(files);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const Attachment = require('../schemas/attachment');
        await Attachment.findByIdAndDelete(req.params.id);
        res.json({ message: "Đã xóa file khỏi bảng attachments" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;