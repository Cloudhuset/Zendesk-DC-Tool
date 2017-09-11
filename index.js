const fs = require('fs');
const needle = require('needle');

exports.run = function(configuration, fileName, localeId) {
    if (!localeId) localeId = 1;

    fs.readFile(fileName, 'utf8', function(err, data) {
        if(err) {
            console.error(err);
            return;
        }

        let lines = data.split('\n');

        for(let i = 0; i < lines.length; i++) {
            const line = lines[i];

            const parts = line.split('=');
            const tag   = parts[0];
            const value = parts[1];

            const requestData = {
                item: {
                    name: tag,
                    default_locale_id: localeId,
                    variants: [
                        {
                            locale_id: localeId,
                            default: true,
                            content: value,
                        }
                    ]
                }
            };

            needle.post('https://' + configuration.HOST + '/api/v2/dynamic_content/items.json', requestData, {
                username: configuration.USERNAME + '/token',
                password: configuration.TOKEN,
                json: true,
            }, function(err, res) {
                if(err) {
                    return;
                }

                console.log(res.body);
            });
        }

    });

};