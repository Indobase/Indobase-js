<a href="https://demo-nextjs-with-indobase.vercel.app/">
  <img alt="Next.js and Indobase Starter Kit - the fastest way to build apps with Next.js and Indobase" src="https://demo-nextjs-with-indobase.vercel.app/opengraph-image.png">
  <h1 align="center">Next.js and Indobase Starter Kit</h1>
</a>

<p align="center">
 The fastest way to build apps with Next.js and Indobase
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-indobase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Works across the entire [Next.js](https://nextjs.org) stack
  - App Router
  - Pages Router
  - Middleware
  - Client
  - Server
  - It just works!
- indobase-ssr. A package to configure Indobase Auth to use cookies
- Password-based authentication block installed via the [Indobase UI Library](https://indobase.com/ui/docs/nextjs/password-based-auth)
- Styling with [Tailwind CSS](https://tailwindcss.com)
- Components with [shadcn/ui](https://ui.shadcn.com/)
- Optional deployment with [Indobase Vercel Integration and Vercel deploy](#deploy-your-own)
  - Environment variables automatically assigned to Vercel project

## Demo

You can view a fully working demo at [demo-nextjs-with-indobase.vercel.app](https://demo-nextjs-with-indobase.vercel.app/).

## Deploy to Vercel

Vercel deployment will guide you through creating a Indobase account and project.

After installation of the Indobase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-indobase&project-name=nextjs-with-indobase&repository-name=nextjs-with-indobase&demo-title=nextjs-with-indobase&demo-description=This+starter+configures+Indobase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-indobase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-indobase&demo-image=https%3A%2F%2Fdemo-nextjs-with-indobase.vercel.app%2Fopengraph-image.png)

The above will also clone the Starter kit to your GitHub, you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need an Indobase project which can be made [via the Indobase dashboard](https://database.new)

2. Create a Next.js app using the Indobase Starter template npx command

   ```bash
   npx create-next-app --example with-indobase with-indobase-app
   ```

   ```bash
   yarn create next-app --example with-indobase with-indobase-app
   ```

   ```bash
   pnpm create next-app --example with-indobase with-indobase-app
   ```

3. Use `cd` to change into the app's directory

   ```bash
   cd with-indobase-app
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_INDOBASE_URL=[INSERT INDOBASE PROJECT URL]
   NEXT_PUBLIC_INDOBASE_ANON_KEY=[INSERT INDOBASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_INDOBASE_URL` and `NEXT_PUBLIC_INDOBASE_ANON_KEY` can be found in [your Indobase project's API settings](https://indobase.com/dashboard/project/_?showConnect=true)

5. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   The starter kit should now be running on [localhost:3000](http://localhost:3000/).

6. This template comes with the default shadcn/ui style initialized. If you instead want other ui.shadcn styles, delete `components.json` and [re-install shadcn/ui](https://ui.shadcn.com/docs/installation/next)

> Check out [the docs for Local Development](https://indobase.com/docs/guides/getting-started/local-development) to also run Indobase locally.

## Feedback and issues

Please file feedback and issues over on the [Indobase GitHub org](https://github.com/indobase/indobase/issues/new/choose).

## More Indobase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Indobase Auth and the Next.js App Router](https://github.com/indobase/indobase/tree/master/examples/auth/nextjs)
