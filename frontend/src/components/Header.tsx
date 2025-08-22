'use client';

import { useSignIn, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import banner from '../assets/banner.png';
import violenceImg from '../assets/banner1.png';
import indiaStatsImg from '../assets/banner12.png';

export default function Header() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const { user } = useUser();

  const isAdmin = user?.unsafeMetadata?.isAdmin === true;

  const registerIndividual = async () => {
    if (!signIn) return;
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/user/sso-callback',
        redirectUrlComplete: '/',
      });
    } catch (error) {
      console.error('Registration redirect failed:', error);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full">
      {/* 🔷 HERO SECTION */}
      <div className="flex items-center mt-12 gap-32 flex-col md:flex-row">
        <div className="flex flex-col gap-5">
          <h1 className="font-extrabold text-[40px] text-gray-800">
            <span className="text-blue-700">Astraa</span> – When silence isn’t safe, we help you speak.
          </h1>

          <p className="text-[20px] text-gray-700 leading-relaxed">
            Astraa is an AI-powered mobile app designed to protect and empower women in abusive or unsafe environments.
            It offers a discreet way to seek help, access mental health support, and receive trusted legal guidance —
            all in one secure platform. Even in situations where speaking out may be dangerous, Astraa enables women
            to reach out safely, confidently, and without fear.
          </p>

          {!isAdmin && (
            <div className="flex items-center gap-4">
              <button
                onClick={registerIndividual}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-lg text-white rounded-lg shadow-md transform hover:scale-105 duration-200 ease-in-out font-semibold"
              >
                Register
              </button>

              <button
                onClick={() => router.push('/create-post')}
                className="px-6 py-3 text-lg text-blue-700 rounded-lg border border-blue-700 shadow-md transform hover:scale-105 hover:bg-blue-700 hover:text-white duration-200 ease-in-out font-semibold"
              >
                Report Now
              </button>
            </div>
          )}
        </div>

        <Image
          src={banner}
          width={500}
          height={500}
          alt="App preview illustration"
          className="scale-x-[1]"
        />
      </div>

      {/* 🔶 VIOLENCE STATS SECTION */}
      <section className="mt-20 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          Every 3 minutes, a woman in India becomes a victim of violence.
        </h2>

        <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:w-1/2">
            <Image
              src={violenceImg}
              alt="Illustration of violence statistics"
              className="object-cover w-full h-full"
            />
          </div>

          <div className="md:w-1/2 p-8 space-y-4">
            <h3 className="text-2xl font-semibold text-blue-700">
              The harsh reality women face every day
            </h3>
            <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
              <li>💔 <strong>One rape every 17 minutes</strong> — over 31,000 cases reported in India in 2023 alone.</li>
              <li>😔 <strong>70% of women</strong> never report abuse — silenced by fear, shame, or lack of trust.</li>
              <li>🏠 <strong>Domestic violence, dowry deaths, and cyber harassment</strong> continue to rise, often unreported.</li>
              <li>🌍 <strong>1 in 3 women globally</strong> has faced physical or sexual violence — most by someone they know.</li>
              <li>⚖️ <strong>Legal support exists</strong>, but accessing it remains unsafe or intimidating for many.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 🔶 INDIA-SPECIFIC DATA CARD SECTION */}
      <section className="mt-16 px-4">
        <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="md:w-1/2 p-8 space-y-4">
            <h3 className="text-2xl font-semibold text-blue-700 mb-2">
              India’s Grim Statistics on Women's Safety
            </h3>
            <ul className="list-disc list-inside text-gray-700 text-lg space-y-2">
              <li>🧾 70+ crimes against women daily in 2023 (NCRB).</li>
              <li>👧 One child raped every <strong>155 minutes</strong>; one woman every <strong>17 minutes</strong>.</li>
              <li>⚖️ <strong>90%+</strong> of victims knew their attackers — trust exploited.</li>
              <li>📱 Cybercrime against women increased by <strong>50%</strong> in 3 years.</li>
              <li>🤐 Only <strong>10%</strong> of abuse cases are reported due to fear or shame.</li>
              <li>🧑‍⚖️ Just <strong>27%</strong> of rape cases result in conviction.</li>
              <li>📲 <strong>7 in 10 women</strong> feel unsafe online — even on popular platforms.</li>
              <li>🧠 Online harassment causes trauma, anxiety, and PTSD.</li>
            </ul>
          </div>

          <div className="md:w-1/2">
            <Image
              src={indiaStatsImg}
              alt="Graphical stats of India’s women safety"
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* 🔷 FEATURES SECTION */}
      <section className="mt-20 px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center">
          What Astraa Offers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-blue-700 mb-2">Legal Companion Bot</h3>
            <p className="text-gray-700">
              Astraa’s AI legal assistant helps women understand rights and take first steps toward justice with verified resources and privacy.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-blue-700 mb-2">Discreet SOS Messaging</h3>
            <p className="text-gray-700">
              Astraa uses <strong>steganography</strong> to silently embed SOS messages in files like images — keeping women safe from detection.
            </p>
          </div>

          <div className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition-all duration-300">
            <h3 className="text-xl font-bold text-blue-700 mb-2">Mental Health Support</h3>
            <p className="text-gray-700">
              A wellness bot offering emotional guidance, safe conversations, and resources — available 24/7.
            </p>
          </div>
        </div>
      </section>

      {/* 🔻 FOOTER SECTION */}
      <footer className="bg-white border-t border-gray-200 py-4 text-sm text-gray-800 mt-24">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="mb-2 md:mb-0 text-center md:text-left font-medium">
            <span className="text-blue-700">Astraa</span> — Empowering Women Silently
          </div>

          <div className="flex gap-4 font-medium">
            <a href="#about" className="hover:text-blue-600 transition">About</a>
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#report" className="hover:text-blue-600 transition">Report</a>
          </div>

          <div className="hidden md:block font-medium">
            © {new Date().getFullYear()} Astraa. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}