/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from 'frog'
// import { neynar } from 'frog/hubs'
import { neynar } from 'frog/middlewares'
import { handle } from 'frog/next'
import { devtools } from 'frog/dev'
import { serveStatic } from 'frog/serve-static'

import { TaskDataType } from '@/data/answer'
import { mock } from 'node:test'

const mockTaskData: TaskDataType = {
  id: "",
  fid: 0,
  displayName: "",
  pfpUrl: "",
  title: "",
  description: "",
  price: 0,
  verifiedAddresses: {
    ethAddresses: [],
    solAddresses: []
  },
  applicants: [],
  status: "open",
  dealWith: "",
};

// super basic random id generator
function generateRandomId(): string {
  const timestamp = Date.now().toString(36);
  const randomString = Math.random().toString(36).substring(2, 7);
  return timestamp + randomString;
}

async function createTask(taskData: TaskDataType) {

  const id = generateRandomId();

  taskData.id = id;
  
  try {
    const response = await fetch(`${process.env.API_URL || "http://localhost:5000"}/api/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    const result = await response.text(); // or response.json() if your server responds with JSON
    console.log(result); // Handle success
  } catch (error) {
    console.error("Error creating task:", error);
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
      <Button value='create' action='/create/title'>Create Task</Button>,
      <Button.Redirect location='https://taskflow-red.vercel.app/explore-tasks' >Explore Tasks</Button.Redirect>,
    ],
  })
}).frame('/create/title', neynarMiddleware, (c) => {
  const { displayName } = c.var.interactor || {}
  return c.res({
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
      <Button action='/create/description'>Confirm ✅</Button>,
      <TextInput placeholder="Your TASK Title here" />,
    ],
  })
}).frame('/create/description', neynarMiddleware, (c) => {
  const { inputText, buttonValue } = c;
  // buttonValue !== 'description-return' ? (mockTaskData.title = inputText as string): "";
  mockTaskData.title = inputText || "";
  return c.res({
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
      // <Button value='title-return' action='/create/title'>↩️ Return</Button>,
      <Button.Reset>↩️ Return</Button.Reset>,
      inputText ?
        <TextInput placeholder="Your TASK Description here" />
        : null,
      inputText ?
        <Button action='/create/amount'>Confirm ✅</Button>
        : null,
    ],
  })
}).frame('/create/amount', neynarMiddleware, (c) => {
  const { inputText } = c;
  mockTaskData.description = inputText || "";
  return c.res({
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
        {/* <p
          style={{
            backgroundImage: 'linear-gradient(180deg, #1d4ed8, #1e3a8a)',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 60,
          }}
        >
          Now we're talking! 🚀
        </p> */}
        <p
          style={{
            backgroundImage: 'linear-gradient(180deg, #1e40af, #1e3a8a)',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 100,
          }}
        >
          {inputText ? "How much would you like to charge for your TASK?" : "It looks like you didn't give a description 😅"}
        </p>
      </div>
    ),
    intents: [
      // <Button value='description-return' action='/create/description'>↩️ Return</Button>,
      <Button.Reset>↩️ Return</Button.Reset>,
      inputText ?
        <TextInput placeholder="Example: 100" />
        : null,
      inputText ?
        <Button action='/finish'>Confirm ✅</Button>
        : null,
    ],
  })
}).frame('/finish', neynarMiddleware, (c) => {
  const { inputText } = c;
  const { followerCount, displayName, pfpUrl, verifiedAddresses } = c.var.interactor || {}
  const { frameData } = c
  const { fid }: any = frameData
  mockTaskData.fid = fid;
  mockTaskData.displayName = displayName as string;
  mockTaskData.pfpUrl = pfpUrl as string;
  mockTaskData.price = parseInt(inputText || "0");
  mockTaskData.verifiedAddresses = verifiedAddresses ? (verifiedAddresses.ethAddresses || []).concat(verifiedAddresses.solAddresses || []) : [];
  createTask(mockTaskData);
  return c.res({
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
          Thank you for creating a TASK! 🚀
        </p>
        <p
          style={{
            backgroundImage: 'linear-gradient(180deg, #1e40af, #1e3a8a)',
            backgroundClip: 'text',
            color: 'transparent',
            fontSize: 100,
          }}
        >
          Share with your {followerCount || "many"} followers!
        </p>
      </div>
    ),
    intents: [
      <Button.Reset>🔄️ Reset</Button.Reset>,
      <Button.Redirect location="https://taskflow-red.vercel.app/">Check our Platform ⭐</Button.Redirect>,
    ],
  })
})

devtools(app, { serveStatic })

export const GET = handle(app)
export const POST = handle(app)
