// Generate sample blog data untuk testing
const fs = require('fs');

const sampleArticles = [
    {
        id: 1,
        cover: "/placeholder-image.png",
        title: "Tips for Preparing a Trip to Bali",
        category: "Travel Tips",
        status: "publish",
        content: `
            <h2>Planning Your Bali Adventure</h2>
            <p>Bali is one of the most popular destinations in Indonesia, offering a perfect blend of beautiful beaches, rich culture, and amazing food.</p>
            <h3>Best Time to Visit</h3>
            <p>The dry season from April to October is ideal for beach activities.</p>
        `
    },
    {
        id: 2,
        cover: "/blog-image.jpeg",
        title: "Hidden Gems of Yogyakarta",
        category: "Travel Story",
        status: "publish",
        content: `
            <h2>Discovering Yogyakarta's Treasures</h2>
            <p>Yogyakarta, often called Jogja, is a cultural hub that offers more than just the famous Borobudur and Prambanan temples.</p>
        `
    },
    {
        id: 3,
        cover: "/blog-image2.jpeg",
        title: "Digital Nomad Guide to Jakarta",
        category: "Travel Tips",
        status: "draft",
        content: `
            <h2>Working Remotely in Indonesia's Capital</h2>
            <p>Jakarta might not be the first city that comes to mind for digital nomads, but this bustling metropolis has a lot to offer.</p>
        `
    },
    {
        id: 4,
        cover: "/placeholder-image.png",
        title: "Exploring the Beauty of Raja Ampat",
        category: "Travel Story",
        status: "publish",
        content: `
            <h2>Raja Ampat: Paradise on Earth</h2>
            <p>Raja Ampat is an archipelago in West Papua that's famous for its stunning marine biodiversity and crystal-clear waters.</p>
        `
    },
    {
        id: 5,
        cover: "/blog-image3.jpg",
        title: "Street Food Guide to Bandung",
        category: "Food & Travel",
        status: "publish",
        content: `
            <h2>Culinary Adventures in Bandung</h2>
            <p>Bandung is not just about factory outlets and cool weather - it's a paradise for food lovers!</p>
        `
    },
    {
        id: 6,
        cover: "/placeholder-image.png",
        title: "Hiking Mount Bromo: A Complete Guide",
        category: "Adventure",
        status: "draft",
        content: `
            <h2>Conquering Mount Bromo</h2>
            <p>Mount Bromo is one of Indonesia's most iconic volcanoes, offering breathtaking sunrise views and otherworldly landscapes.</p>
        `
    },
    {
        id: 7,
        cover: "/blog-image.jpeg",
        title: "Cultural Heritage of Solo City",
        category: "Culture",
        status: "publish",
        content: `
            <h2>Solo: The Heart of Javanese Culture</h2>
            <p>Solo (Surakarta) is often overshadowed by Yogyakarta, but it offers an authentic Javanese cultural experience.</p>
        `
    },
    {
        id: 8,
        cover: "/blog-image2.jpeg",
        title: "Diving in Komodo National Park",
        category: "Adventure",
        status: "publish",
        content: `
            <h2>Underwater Paradise: Komodo National Park</h2>
            <p>Komodo National Park is not just about the famous dragons - it's a world-class diving destination.</p>
        `
    }
];

// Save to blog-data.json
fs.writeFileSync('blog-data.json', JSON.stringify(sampleArticles, null, 2));
console.log(`✅ Generated ${sampleArticles.length} sample articles`);
console.log('File saved as: blog-data.json');
console.log('Now run: npm run migrate:blog:file');
