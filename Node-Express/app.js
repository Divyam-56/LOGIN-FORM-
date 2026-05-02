const http = require('http');
const fs = require('fs');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // 1. Route: GET /
    if (url === '/' && method === 'GET') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Add Product</title></head>');
        res.write('<body>');
        res.write('<h1>Create a New Product</h1>');
        res.write('<form action="/add-product" method="POST">');
        res.write('<div>Title: <input type="text" name="title" required></div><br>');
        res.write('<div>Image URL: <input type="text" name="imageUrl" required></div><br>');
        res.write('<div>Description: <textarea name="description" required></textarea></div><br>');
        res.write('<div>Price: <input type="number" name="price" step="0.01" required></div><br>');
        res.write('<button type="submit">Add Product</button>');
        res.write('</form>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }

    // 2. Route: POST /add-product
    if (url === '/add-product' && method === 'POST') {
        const body = [];

        // Collect incoming data chunks
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        // Process data after stream ends
        req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString();
            
            // Convert URL-encoded string to JS Object
            // Format: title=Example&imageUrl=url&description=desc&price=10
            const formData = querystring.parse(parsedBody);

            const productData = {
                title: formData.title,
                imageUrl: formData.imageUrl,
                description: formData.description,
                price: formData.price
            };

            // Save to file (Append mode)
            fs.appendFile('products.txt', JSON.stringify(productData) + '\n', (err) => {
                if (err) {
                    console.error('File Write Error:', err);
                    res.statusCode = 500;
                    return res.end('Internal Server Error');
                }
                
                // Redirect back to /
                res.statusCode = 302;
                res.setHeader('Location', '/');
                return res.end();
            });
        });
    }
});

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});