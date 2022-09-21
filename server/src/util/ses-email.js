const AWS = require('aws-sdk');

require('dotenv').config();

const SES_CONFIG = {
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION,
};

const AWS_SES = new AWS.SES(SES_CONFIG);

let sendEmail = (recipientEmail, subject, body) => {
    let params = {
        Source: 'staysignal@outlook.com',
        Destination: {
            ToAddresses: [recipientEmail],
        },
        ReplyToAddresses: [],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: body,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject,
            },
        },
    };
    return AWS_SES.sendEmail(params).promise();
};

let sendTemplateEmail = (recipientEmail) => {
    let params = {
        Source: 'staysignal@outlook.com',
        Template: '<name of your template>',
        Destination: {
            ToAddress: [recipientEmail],
        },
        TemplateData: "{ \"name':'John Doe'}",
    };
    return AWS_SES.sendTemplatedEmail(params).promise();
};

module.exports = {
    sendEmail,
    sendTemplateEmail,
};
