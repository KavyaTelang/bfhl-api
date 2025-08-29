const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const USER_FULL_NAME = "john_doe"; 
const USER_DOB = "17091999"; 
const USER_EMAIL = "john@xyz.com";
const USER_ROLL_NUMBER = "ABCD123";

app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                user_id: `${USER_FULL_NAME}_${USER_DOB}`,
                error: "Invalid input: 'data' must be an array."
            });
        }

        const odd_numbers = [];
        const even_numbers = [];
        const alphabets = [];
        const special_characters = [];
        let sum_of_numbers = 0;
        let alphabet_chars_for_concat = [];

        data.forEach(item => {
            if (typeof item !== 'string') {
                return;
            }

            if (!isNaN(item) && !isNaN(parseFloat(item))) {
                const num = parseInt(item, 10);
                sum_of_numbers += num;
                if (num % 2 === 0) {
                    even_numbers.push(item);
                } else {
                    odd_numbers.push(item);
                }
            } else if (item.length === 1 && item.match(/[a-zA-Z]/)) {
                alphabets.push(item.toUpperCase());
                alphabet_chars_for_concat.push(item);
            } else if (item.match(/^[a-zA-Z]+$/)) {
                alphabets.push(item.toUpperCase());
                alphabet_chars_for_concat = alphabet_chars_for_concat.concat(item.split(''));
            }
            else {
                if (item.length === 1 && !item.match(/[a-zA-Z0-9]/)) {
                     special_characters.push(item);
                }
            }
        });
        let concat_string = alphabet_chars_for_concat
            .map(char => char.toLowerCase())
            .reverse()
            .map((char, index) => (index % 2 === 0 ? char.toUpperCase() : char.toLowerCase()))
            .join('');

        res.status(200).json({
            is_success: true,
            user_id: `${USER_FULL_NAME}_${USER_DOB}`,
            email: USER_EMAIL,
            roll_number: USER_ROLL_NUMBER,
            odd_numbers: odd_numbers,
            even_numbers: even_numbers,
            alphabets: alphabets,
            special_characters: special_characters,
            sum: String(sum_of_numbers),
            concat_string: concat_string
        });

    } catch (error) {
        console.error("Error processing request:", error);
        res.status(500).json({
            is_success: false,
            user_id: `${USER_FULL_NAME}_${USER_DOB}`,
            error: "Internal server error."
        });
    }
});

app.get('/', (req, res) => {
    res.status(200).send('BFHL API is running. Use POST /bfhl to submit data.');
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);

});
