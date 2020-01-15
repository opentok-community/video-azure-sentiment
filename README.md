# Video Azure Sentiment Analysis

<!-- Add a paragraph about the project. What does it do? Who is it for? Is it actively supported? Your reader just clicked on a random link from another web page and has no idea what Nexmo is ... -->

## Welcome to OpenTok

<!-- change "github-repo" at the end of the link to be the name of your repo, this helps us understand which projects are driving signups so we can do more stuff that developers love -->

If you're new to OpenTok, you can [sign up for a Tokbox account](https://tokbox.com/account/user/signup?utm_source=DEV_REL&utm_medium=github&utm_campaign=video-azure-sentiment) and get some free credit to get you started.

## Configuring the application

1. Clone this repository.

2. Edit the /js/config.js file and set values each of the variables.

| Variable                        | Description                                                     |
| ------------------------------- | --------------------------------------------------------------- |
| OPENTOK_API_KEY                 | Project specific API Key found in your [TokBox Account]         |
| OPENTOK_SESSION_ID              | Session ID generated in your [TokBox Account] (Read more below) |
| OPENTOK_TOKEN                   | Token generated in your [TokBox Account] (Read more below)      |
| AZURE_FACE_API_SUBSCRIPTION_KEY | Subscription Key associated with your Azure Face API service    |
| AZURE_FACE_API_ENDPOINT         | Uri endpoint associated with your Azure Face API service        |

### OpenTok Session ID & Token

To generate an OpenTok Session ID & Token, log into your [TokBox Account], and either create
a new project or use an existing project. Then go to your project page and scroll down to the
**Project Tools** section. From there, you can generate a session ID and token manually. Use the
project’s API key along with the session ID and token you generated.

**Important notes:**

- You can continue to get the session ID and token values from your Account during testing and
  development, but before you go into production you must set up a server. To learn more,
  visit [OpenTok Basics](https://tokbox.com/developer/guides/basics/) in the Developer Documentation.

## Getting Help

We love to hear from you so if you have questions, comments or find a bug in the project, let us know! You can either:

- Open an issue on this repository
- Tweet at us! We're [@NexmoDev on Twitter](https://twitter.com/NexmoDev)
- Or [join the Nexmo Community Slack](https://developer.nexmo.com/community/slack)

## Further Reading

- Check out the Developer Documentation at <https://tokbox.com/developer/>

<!-- add links to the api reference, other documentation, related blog posts, whatever someone who has read this far might find interesting :) -->

[tokbox account]: https://tokbox.com/account
