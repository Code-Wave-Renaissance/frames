/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
// import { neynar } from 'frog/hubs'
import { neynar } from 'frog/middlewares'
import { handle } from 'frog/next'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'

import { ApplicantDataType } from '@/data/answer'

const mockApplicantData: ApplicantDataType = {
  id: "",
  fid: "",
  title: "",
  description: "",
  price: 0,
};

async function createApplicant(applicantData: ApplicantDataType) {
  try {
    const response = await fetch('http://localhost:5000/api/new', { // Adjust the URL to your actual API endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicantData),
    });

    if (!response.ok) {
      throw new Error('Failed to create applicant');
    }

    const result = await response.text(); // or response.json() if your server responds with JSON
    console.log(result); // Handle success
    alert('Applicant created successfully'); // Simple success feedback
  } catch (error) {
    console.error("Error creating applicant:", error);
    alert('Error creating applicant'); // Simple error feedback
  }
}

const neynarMiddleware = neynar({
  apiKey: 'NEYNAR_FROG_FM',
  features: ['interactor', 'cast'],
})

const app = new Frog({
  assetsPath: '/',
  basePath: '/api',
  imageAspectRatio: '1.91:1',
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
}).frame('/', (c) => {
  return c.res({
    image: 'https://i.ibb.co/GnbS9TV/taskflow-banner-V4.png',
    // image:(
    //   <div
    //   style={{
    //     alignItems: 'center',
    //     color: 'white',
    //     display: 'flex',
    //     flexDirection: 'column',
    //     justifyContent: 'center',
    //     backgroundImage: 'linear-gradient(to bottom right, white, #bae6fd)',
    //     // backgroundColor: 'white',
    //     fontSize: 164,
    //     height: '100%',
    //     width: '100%',
    //     padding: 20,
    //   }}
    // >
    //  <p style={{
    //     marginTop: 90,
    //     color: 'transparent',
    //     fontFamily: 'fantasy',
    //     fontWeight: 900,
    //     fontSize: 180,
    //     backgroundClip: 'text',
    //     WebkitBackgroundClip: 'text',
    //     WebkitTextFillColor: 'transparent',
    //     backgroundImage: 'linear-gradient(to right, #38bdf8, #1d4ed8)',

    //   }}>TASK FLOW</p>
    // </div>
    // ),
    intents: [
      <Button value='create' action='/page/create/title'>Create Task</Button>,
      <Button.Redirect location='https://google.com' >Explore Tasks</Button.Redirect>,
    ],
  })
}).frame('/page/create/title', neynarMiddleware, (c) => {
  const { displayName } = c.var.interactor || {}
  return c.res({
    // action: '/page/1',
    image: (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundImage: 'linear-gradient(to bottom, #dbf4ff, #38bdf8)',
          // fontSize: 50,
          letterSpacing: -2,
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            backgroundImage: 'linear-gradient(0deg, #2563eb, #0ea5e9)',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 100,
          }}
        >
          Hello {displayName || 'there'}
        </p>
        <p
          style={{
            backgroundImage: 'linear-gradient(180deg, #2563eb, #1d4ed8)',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 130,
          }}
        >
          Let's create a TASK
        </p>
        <p
          style={{
            backgroundImage: 'linear-gradient(180deg, #1d4ed8, #1e3a8a)',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 60,
          }}
        >
          First, give it a title ⬇
        </p>
      </div>
    ),
    intents: [
      <Button value='return' action='/'>↩️ Return</Button>,
      <Button action='/page/create/description'>Confirm ✅</Button>,
      <TextInput placeholder="Your TASK Title here" />,
    ],
  })
}).frame('/page/create/description', neynarMiddleware, (c) => {
  const { displayName } = c.var.interactor || {}
  const { inputText } = c;
  return c.res({
    action: '/page/1',
    image: (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundImage: 'linear-gradient(to bottom, #38bdf8, #1d4ed8)',
          // fontSize: 50,
          letterSpacing: -2,
          fontWeight: 700,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            backgroundImage: 'linear-gradient(180deg, #1d4ed8, #1e3a8a)',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 60,
          }}
        >
          {inputText ? `${inputText} huh? AWESOME!!` : ""}
        </p>
        <p
          style={{
            backgroundImage: 'linear-gradient(180deg, #1e40af, #1e3a8a)',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 100,
          }}
        >
          {inputText ? "Now give your TASK a Short Description" : "It looks like you didn't give a title 😅"}
        </p>
        {/* <p
          style={{
            backgroundImage: 'linear-gradient(180deg, #2563eb, #1d4ed8)',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 130,
          }}
        >
          Short Description
        </p> */}
      </div>
    ),
    intents: [
      <Button value='return' action='/page/create/title'>↩️ Return</Button>,
      inputText ?
        <TextInput placeholder="Your TASK Description here" />
        : null,
      inputText ?
        <Button action='/page/create/amount'>Confirm ✅</Button>
        : null,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
