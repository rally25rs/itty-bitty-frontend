import { IonIcon, useIonViewWillEnter } from "@ionic/react";
import { logoFacebook } from "ionicons/icons";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

interface UserHomeProps {
  userName: string;
  trialDaysLeft?: number;
  freeAccount?: boolean;
  tokens?: number;
}

const UserHome: React.FC<UserHomeProps> = ({
  userName,
  trialDaysLeft,
  freeAccount,
  tokens,
}) => {
  const history = useHistory();
  useIonViewWillEnter(() => {});

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="p-2">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Welcome to SpeakAnyWay!
        </h1>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Empowering Communication Through Technology
        </h2>
      </div>
      <h3 className="text-lg my-6 text-center">
        Hi {userName}, we're thrilled to have you here!
      </h3>

      {freeAccount && (
        <section className="mb-2 text-center  cursor-pointer">
          {trialDaysLeft && trialDaysLeft > 0 && (
            <>
              <div
                className="text-xl p-4 bg-green-100 text-green-900 rounded-lg hover:bg-green-200 w-full md:w-3/4 mx-auto"
                onClick={() => history.push("/upgrade")}
              >
                <span className="font-bold block mb-2">
                  7 days of Free Access:{" "}
                </span>
                <span className="text-2xl">
                  Enjoy all the <strong>premium</strong> features of SpeakAnyWay
                  for free.
                </span>
                <span className="my-3 text-sm font-bold block">
                  You have {trialDaysLeft} days left in your free trial. Click
                  to upgrade now!
                </span>
              </div>
              <div
                className="mb-4 text-sm p-2 bg-green-100 text-green-900 rounded-lg hover:bg-green-200 w-full md:w-3/4 mx-auto"
                onClick={() => history.push("/upgrade")}
              >
                <span className="font-bold block">Reminder:</span> Upgrade to
                continue using our <strong>premium</strong> features.
                <span className="mt-3 text-lg font-bold block">
                  After your trial ends, you'll still have access to our{" "}
                  <strong>all</strong> other features FREE!
                </span>
                <span className="mt-3 text-sm font-md block">
                  You'll still be able to create boards, upload images, and
                  more!
                </span>
              </div>
            </>
          )}
          {trialDaysLeft && trialDaysLeft <= 0 && (
            <>
              <div
                className="text-center text-2xl p-4 bg-red-100 text-red-900 rounded-lg cursor-pointer hover:bg-red-200 w-full md:w-3/4 mx-auto"
                onClick={() => history.push("/upgrade")}
              >
                <span className="font-mono font-bold block">
                  Free Trial Expired:
                </span>{" "}
                Subscribe to continue using our premium features.
              </div>
              <div
                className="text-center mb-4 text-2xl p-4 bg-red-100 text-red-900 rounded-lg cursor-pointer hover:bg-red-200 w-full md:w-3/4 mx-auto"
                onClick={() => history.push("/upgrade")}
              >
                <span className="font-bold block">
                  {" "}
                  Upgrade to continue using our premium features.
                </span>
                <span className="mt-3 text-sm font-bold block">
                  Remember, you still have access to all other features.
                </span>
                <span className="mt-3 text-sm font-md block">
                  You can create boards, upload images, and more!
                </span>
              </div>
            </>
          )}
        </section>
      )}

      <div className="px-2 w-full md:w-3/4 mx-auto">
        <section className="mb-2">
          <h4 className="text-2xl font-semibold mb-2">Getting Started</h4>

          <ol className="list-decimal list-inside space-y-2">
            <li className="mb-2 ml-3">
              <span className="font-bold">Personalize Your Experience:</span>
              <ul className="list-disc list-inside ml-3">
                <li
                  onClick={() => history.push("/settings")}
                  className="cursor-pointer hover:underline text-blue-700"
                >
                  Customize your profile and preferences.
                </li>
                <li
                  onClick={() => history.push("/boards")}
                  className="cursor-pointer  hover:underline text-blue-700"
                >
                  Create a new communication board.
                </li>
                <li
                  onClick={() => history.push("/images")}
                  className="cursor-pointer  hover:underline text-blue-700"
                >
                  Search for images or upload your own.
                </li>
              </ul>
            </li>
            <li className="mb-2 ml-3">
              <span className="font-bold">Explore SpeakAnyWay:</span>
              <ul className="list-disc list-inside ml-3">
                <li className="mb-2 ml-3">
                  Create boards & share them with others
                </li>
                <li className="mb-2 ml-3">
                  {" "}
                  Customizable settings for voice output
                </li>
                <li className="mb-2 ml-3">
                  Try out the Menu Creator & Scenario Boards
                </li>
              </ul>
            </li>
          </ol>
          <div className="mt-2 font-md border p-2">
            <h1 className="text-md font-bold mt-2 text-left ml-2">
              What's a token?
            </h1>
            <p className="text-md font-bold">
              You currently have {tokens || 0} tokens.
            </p>
            <ul className="list-[square] ml-4">
              <li className="text-sm mt-2 text-left">
                A token is a unit of currency used for the AI features.
              </li>
              <li className="text-sm mt-2 text-left">
                We offer a limited number of free tokens to get you started.
              </li>
              <li className="text-sm mt-2 text-left">
                When you subscribe, you'll receive additional tokens each month.
              </li>
            </ul>
          </div>
        </section>

        <section className="mb-4 p-1 ">
          <h4 className="text-2xl font-semibold mb-3">Features Overview</h4>
          <ul className="list-[square] space-y-2">
            <li className="mb-2 ml-3">
              <span className="font-bold block">Communication Boards:</span>{" "}
              <span className="ml-3">
                Choose from a variety of pre-made boards.
              </span>
            </li>
            <li
              onClick={() => history.push("/boards/new")}
              className="cursor-pointer hover:underline text-blue-700 mb-2 ml-3"
            >
              <span className="font-bold block">Scenario Board Creator:</span>{" "}
              <span className="ml-3">
                Create boards for specific scenarios.
              </span>
            </li>
            <li className="mb-2 ml-3">
              <span className="font-bold block">Multiple Voice Options:</span>{" "}
              <span className="ml-3">
                Choose from a variety of voices for your boards.
              </span>
            </li>
            <li
              onClick={() => history.push("/menus/new")}
              className="cursor-pointer hover:underline text-blue-700 mb-2 ml-3"
            >
              <span className="font-bold block">Menu Conversion:</span>
              <span className="ml-3">
                Convert text menus into image boards.
              </span>
            </li>
            <li className="mb-2 ml-3">
              <span className="font-bold block">AI-Generated Images:</span>{" "}
              <span className="ml-3">
                Leverage AI for perfect image matches.
              </span>
            </li>
            <li
              onClick={() => history.push("/settings")}
              className="cursor-pointer hover:underline text-blue-700 mb-2 ml-3"
            >
              <span className="font-bold block">Customizable Settings:</span>{" "}
              <span className="ml-3">
                Adjust voice speed, pitch, and other settings.
              </span>
            </li>
            <li className="mb-2 ml-3">
              <span className="font-bold block">More Coming Soon:</span>{" "}
              <span className="ml-3">
                Stay tuned for innovative communication tools.
              </span>
            </li>
          </ul>
        </section>

        <section className="mb-4 p-2">
          <h4 className="text-xl font-semibold">Stay Connected</h4>
          <p className="text-md text-left flex items-center">
            Follow us on social media for updates, tips, and stories from our
            community:{" "}
            <a href="https://www.facebook.com/speakanywayaac" className="m-2">
              <IonIcon
                size="large"
                icon={logoFacebook}
                className="text-blue-500"
              />
            </a>
          </p>
        </section>

        <section className="mb-6 p-2">
          <h4 className="text-lg font-semibold mb-2">Need Help?</h4>
          <p className="text-md text-left">
            If you have any questions or need assistance, please reach out to
            our support team:{" "}
            <a href="mailto:hello@speakanyway.com" className="">
              hello@speakanyway.com
            </a>
          </p>
        </section>

        <footer className="text-center my-3 mb-8">
          <p className="text-lg">
            Happy Communicating,
            <br />
            The SpeakAnyWay Team
          </p>
        </footer>
      </div>
    </div>
  );
};

export default UserHome;
