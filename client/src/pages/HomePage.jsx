import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, CheckCircle, Users, Wallet, Settings, BarChart } from "lucide-react";
import { motion } from "framer-motion";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { useRef } from "react";
import LogoIcon from '../images/logo/logo-icon.svg';

const features = [
  { icon: Wallet, title: "Track Payments", description: "Monitor cash and online member payments easily." },
  { icon: BarChart, title: "Fund Transfers", description: "Track fund flow from members to treasurers." },
  { icon: Users, title: "Visitor Management", description: "Add and track temporary members or visitors." },
  { icon: Settings, title: "Custom Roles & Fees", description: "Set up roles and flexible fee structures." }
];

const screenshots = [
  "/screens/dashboard1.png",
  "/screens/dashboard2.png",
  "/screens/dashboard3.png"
];

export default function LandingPage() {
  const [sliderRef] = useKeenSlider({ loop: true, slides: { perView: 1 } });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3C8CE7] to-[#00EAFF] p-6">
      <header className="text-center py-10">
        <img src={LogoIcon} alt="SimpliCollect Logo" className="mx-auto h-16 mb-4" />
        <motion.h1 
          initial={{ opacity: 0, y: -30 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.7 }}
          className="text-4xl md:text-5xl font-bold text-white"
        >
          Simplify Your Membership Fee Collection
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="mt-4 text-lg text-white/90"
        >
          SimpliCollect helps clubs and organizations manage payments, roles, and fund transfers with ease.
        </motion.p>
        <div className="mt-6 flex justify-center gap-4">
          <Button variant="outline" className="flex items-center gap-2 bg-white text-indigo-600">Watch Demo <ArrowRight size={16} /></Button>
        </div>
        <p className="mt-4 text-sm text-white/80">A product by <a href="https://simplium.in" target="_blank" className="underline text-white">Simplium Technologies</a></p>
      </header>

      <section className="py-12">
        <h2 className="text-2xl font-semibold text-center text-white mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, idx) => (
            <Card key={idx} className="shadow-md">
              <CardContent className="p-6 text-center">
                <feature.icon className="mx-auto h-10 w-10 text-indigo-500" />
                <h3 className="text-lg font-semibold mt-4">{feature.title}</h3>
                <p className="text-sm text-gray-500 mt-2">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="py-12 bg-white">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">See It In Action</h2>
        <div ref={sliderRef} className="keen-slider max-w-4xl mx-auto rounded-xl overflow-hidden">
          {screenshots.map((src, idx) => (
            <div key={idx} className="keen-slider__slide">
              <img src={src} alt={`Screenshot ${idx + 1}`} className="w-full h-auto object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800">Why SimpliCollect?</h2>
          <p className="mt-4 text-gray-600 text-lg mb-8">
            Managing memberships, fee deadlines, discounts, and penalties manually is stressful and time-consuming. SimpliCollect automates these tasks, giving you a powerful dashboard to track payments, configure complex rules, and communicate effectively with members.
          </p>
          <div className="overflow-x-auto">
            <table className="table-auto w-full border border-gray-200">
              <thead>
                <tr className="bg-indigo-100">
                  <th className="px-4 py-2 border">Feature</th>
                  <th className="px-4 py-2 border">Manual Process</th>
                  <th className="px-4 py-2 border">SimpliCollect</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border">Payment Tracking</td>
                  <td className="px-4 py-2 border">❌ Spreadsheet</td>
                  <td className="px-4 py-2 border">✅ Dashboard</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="px-4 py-2 border">Role Management</td>
                  <td className="px-4 py-2 border">❌ Manual Logs</td>
                  <td className="px-4 py-2 border">✅ Smart Roles</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border">Fund Transfer Logs</td>
                  <td className="px-4 py-2 border">❌ None</td>
                  <td className="px-4 py-2 border">✅ Automated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="text-center py-16">
        <h2 className="text-3xl font-bold text-gray-800">Interested in using SimpliCollect?</h2>
        <p className="text-gray-600 mt-2">Users cannot create a chapter by themselves. Please contact us for a demo and we'll help onboard your chapter.</p>
        <div className="mt-6">
          <p className="text-lg font-semibold text-indigo-700">📞 +91 9876543210</p>
        </div>
      </section>

      <footer className="text-center py-6 text-sm text-white/80">
        © {new Date().getFullYear()} SimpliCollect — A product by <a href="https://simplium.in" target="_blank" className="underline text-white">Simplium Technologies</a>.
      </footer>
    </div>
  );
}
