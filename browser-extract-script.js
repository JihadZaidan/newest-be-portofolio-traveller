
// Paste this script in browser console at http://localhost:5173/admin/blog
(function() {
    const blogData = localStorage.getItem('admin_blog_articles');
    
    if (blogData) {
        const articles = JSON.parse(blogData);
        console.log('📝 Found', articles.length, 'articles in localStorage');
        console.log('📋 Articles:');
        articles.forEach((article, index) => {
            console.log(`${index + 1}. ${article.title} (${article.status})`);
        });
        
        // Create download link
        const dataStr = JSON.stringify(articles, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', 'blog-data.json');
        linkElement.click();
        
        console.log('✅ File blog-data.json downloaded!');
        console.log('🔄 Now run: node extract-dynamic-blog-data.js');
    } else {
        console.log('❌ No blog data found in localStorage');
        console.log('💡 Make sure you have added articles in the admin blog page');
    }
})();
