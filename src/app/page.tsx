import Image from 'next/image';
import Logo from '@/app/components/Logo';
import FeedbackForm from '@/app/components/FeedbackForm';
import SignIn from '@/app/components/SignInButton';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await getServerSession();
  if (session && session.user) redirect('/home/links');

  return (
    <main className="mx-auto w-100">
      <div className="w-100 text-center py-16 bg-black flex justify-center">
        <div className="px-4 container">
          <h1 className="text-4xl font-semibold text-white">
            Unlock the Power of Link Organization with LinkArk
          </h1>
          <p className="text-gray-600 mt-4 text-white">
            Offering a user-friendly platform for storing and sharing links,
            ensuring you never lose track again
          </p>
          {/* <button className="bg-blue-600 text-white px-6 py-2 rounded-full mt-6">Create Account</button> */}
        </div>
      </div>
      <div className="py-16 px-4">
        <h2 className="text-3xl font-semibold text-center">
          Save and Share Links
        </h2>
        <p className="text-gray-600 text-center mt-4">
          The easiest way to keep your favourite and important URL links
          organised in one place
        </p>
        <div className="flex justify-center mt-6">
          <SignIn title="Get Started" size="md" />
        </div>
        <div className="flex justify-center mt-10">
          <div className="flex relative">
            <Image
              src="/mobile-screen-1.png"
              width={250}
              height={100}
              className="md:block relative z-[1] top-10"
              alt="Screenshot of app welcome page"
            />
            <Image
              src="/mobile-screen-2.png"
              width={250}
              height={100}
              className="md:block sm:none absolute z-0 right-14"
              alt="Screenshot of app home screen"
            />
          </div>
        </div>
      </div>
      <div className="text-center py-8">
        <div className="flex justify-center items-center">
          <Logo />
        </div>
        <div className="flex justify-center items-center flex-col gap-4 mt-4">
          <FeedbackForm />
          <a className="text-blue-400" href="mailto:contact@linkark.solutions">
            contact@linkark.solutions{' '}
          </a>
        </div>
        <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
          <p className="text-gray-500 text-sm sm:order-3 sm:w-100">
            © Copyright Blancpoint Ltd 2024. All Rights Reserved.
          </p>
          <a className="text-gray-500 text-sm sm:order-1" href="#">
            Terms &amp; Condition
          </a>
          <a className="text-gray-500 text-sm sm:order-2" href="#">
            Privacy Policy
          </a>
        </div>
      </div>
    </main>
  );
}
