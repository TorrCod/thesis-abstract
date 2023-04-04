import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="application-name" content="TAMS App" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="TAMS App" />
        <meta
          name="description"
          content="A thesis abstract management system for the College of Engineering in URS Morong is a web application designed to simplify the process of submitting, reviewing, and managing thesis abstracts for students, faculty, and staff at the College of Engineering. The system would allow students to easily submit their thesis abstracts online, and the faculty and staff would be able to access and review them remotely. The system would also automate the approval process, allowing for faster turnaround times and increased efficiency. In addition to submission and review features, the system could include tools for tracking progress, managing deadlines, and generating reports. This would enable the College of Engineering to better manage their thesis abstract process, ensuring that all students have a fair chance to complete their thesis work on time. Overall, the thesis abstract management system would streamline the thesis process for students, faculty, and staff at the College of Engineering in URS Morong, making it more efficient and effective."
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />

        <meta name="msapplication-TileColor" content="#2B5797" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />

        <link rel="apple-touch-icon" href="/icons/touch-icon-iphone.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/touch-icon-ipad.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/touch-icon-iphone-retina.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/touch-icon-ipad-retina.png"
        />

        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#5bbad5"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="TAMS" />
        <meta
          property="og:description"
          content="A thesis abstract management system for the College of Engineering in URS Morong is a web application designed to simplify the process of submitting, reviewing, and managing thesis abstracts for students, faculty, and staff at the College of Engineering. The system would allow students to easily submit their thesis abstracts online, and the faculty and staff would be able to access and review them remotely. The system would also automate the approval process, allowing for faster turnaround times and increased efficiency. In addition to submission and review features, the system could include tools for tracking progress, managing deadlines, and generating reports. This would enable the College of Engineering to better manage their thesis abstract process, ensuring that all students have a fair chance to complete their thesis work on time. Overall, the thesis abstract management system would streamline the thesis process for students, faculty, and staff at the College of Engineering in URS Morong, making it more efficient and effective."
        />
        <meta property="og:site_name" content="TAMS App" />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_DOMAIN} />
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_DOMAIN}/icons/apple-touch-icon.png`}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
