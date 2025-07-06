const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

let DB = []; // Temporary array (later mongo ya JSON file)

if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ POST: Upload Watch
app.post('/upload', upload.single('image'), (req, res) => {
  try {
    const { title, desc, price } = req.body; // 👈 ab yahan price le rahe hain
    const imagePath = req.file.path;
    const id = Date.now();

    let newWatch = {
      id,
      title,
      description: desc,
      price: Number(price), // 👈 type cast
      image: `http://localhost:5000/${imagePath}`,
    };

    DB.push(newWatch);

    res.json({ message: "Watch uploaded!", data: newWatch });
  } catch (err) {
    console.log("UPLOAD ERROR", err);
    res.status(500).json({ message: "Upload failed" });
  }
});


// ✅ GET: All watches
app.get('/data', (req, res) => {
  res.json(DB);
});

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
