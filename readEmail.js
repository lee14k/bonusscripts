const axios = require('axios');
const fs = require('fs');

const WP_API_ENDPOINT = 'https://yourwordpresssite.com/wp-json/wp/v2';
const WP_ACF_ENDPOINT = 'https://yourwordpresssite.com/wp-json/acf/v3/events';  // Assuming 'events' is your post type.
const USERNAME = 'your_wp_username';
const PASSWORD = 'your_wp_password';

async function getToken() {
    try {
        const response = await axios.post('https://yourwordpresssite.com/wp-json/jwt-auth/v1/token', {
            username: USERNAME,
            password: PASSWORD
        });
        return response.data.token;
    } catch (error) {
        console.error('Failed to get token:', error.message);
        return null;
    }
}

async function uploadEvents(token) {
    const events = JSON.parse(fs.readFileSync('path_to_your_textfile.txt', 'utf-8'));
    for (let event of events) {
        try {
            // Create the event.
            const response = await axios.post(`${WP_API_ENDPOINT}/events`, {
                title: event.title,
                content: event.description,
                status: 'publish'
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const postId = response.data.id;

            // Set ACF fields.
            await axios.post(`${WP_ACF_ENDPOINT}/${postId}`, event.acf, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.error(`Failed to upload event ${event.title}:`, error.message);
        }
    }
}

(async () => {
    const token = await getToken();
    if (token) {
        await uploadEvents(token);
    }
})();
