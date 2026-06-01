const express = require('express');
const dotenv = require('dotenv');

// Load API Key dari file .env
dotenv.config();

const app = express();
app.use(express.json());

// Memberi tahu server untuk membaca file HTML dari dalam folder 'public'
app.use(express.static('public'));

// Endpoint untuk menerima pertanyaan dari Tampilan Web
app.post('/tanya-ai', async (req, res) => {
    const { pertanyaan } = req.body;

    try {
        // Panggil Server Groq (Llama 3)
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "openai/gpt-oss-20b",
                messages: [{ role: "user", content: pertanyaan }]
            })
        });

        const data = await response.json();

        // TAMBAHKAN BARIS INI UNTUK MENGINTIP ERROR ASLI DARI GROQ
        console.log("Respon asli dari Groq:", data);
        
        // Ambil teks jawaban dari struktur data Groq
        const jawabanAI = data.choices[0].message.content;
        
        // Kirim balik jawabannya ke tampilan web
        res.json({ hasil: jawabanAI });

    } catch (error) {
        console.error(error);
        res.status(500).json({ hasil: "Waduh, ada kendala koneksi ke otak AI." });
    }
});

// Jalankan server di port 3000
app.listen(3000, () => {
    console.log('Aplikasi jalan! Buka: http://localhost:3000');
});