import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, Sparkles, Star, Shield, ArrowRight } from 'lucide-react';
import CheckoutModal from '../components/CheckoutModal';

export default function Store() {
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: string } | null>(null);

  const ranks = [
    {
      name: 'VIP',
      price: '₹149',
      color: 'text-green-400',
      bg: 'bg-green-500/5',
      border: 'border-green-500/20',
      btnHover: 'hover:bg-green-500 hover:text-white hover:border-green-500',
      icon: <Star size={28} className="text-green-400" />,
      features: [
        'Colored VIP chat tag',
        '/fly in lobby',
        '2+ vote rewards',
        'Access to /kit VIP weekly',
        'Priority queue slot'
      ]
    },
    {
      name: 'MVP',
      price: '₹349',
      color: 'text-blue-400',
      bg: 'bg-blue-500/5',
      border: 'border-blue-500/20',
      btnHover: 'hover:bg-blue-500 hover:text-white hover:border-blue-500',
      icon: <Shield size={28} className="text-blue-400" />,
      features: [
        'Glowing MVP chat tag',
        'Everything in VIP',
        '3+ vote rewards',
        '/nick custom nickname',
        '5 private homes [/sethome]'
      ]
    },
    {
      name: 'ELITE',
      price: '₹699',
      color: 'text-purple-400',
      bg: 'bg-purple-500/5',
      border: 'border-purple-500/20',
      btnHover: 'hover:bg-purple-500 hover:text-white hover:border-purple-500',
      icon: <Crown size={28} className="text-purple-400" />,
      features: [
        'Prismatic ELITE tag',
        'Everything in MVP',
        '/fly enabled everywhere',
        'Exclusive Elite cosmetics',
        '10 homes + /back'
      ]
    },
    {
      name: 'VIXEL-GOD',
      price: '₹1499',
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/5',
      border: 'border-yellow-500/20',
      btnHover: 'hover:bg-yellow-500 hover:text-black hover:border-yellow-500',
      icon: <Sparkles size={28} className="text-yellow-400" />,
      features: [
        'Animated Vixel-GOD tag',
        'All previous ranks perks',
        'Custom particle trail',
        'Dragon pet companion',
        'Unlimited homes + /god mode in survival lobby'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 pb-8 border-b border-white/10">
        <div>
          <h1 className="text-4xl font-display font-bold text-white mb-3">Server Store</h1>
          <p className="text-gray-400 font-medium">Support the network by purchasing global ranks.</p>
        </div>
        <div className="mt-8 md:mt-0">
          <Link to="/crates" className="inline-flex items-center space-x-2 bg-mc-orange hover:bg-mc-orange-dark text-white px-6 py-3 rounded-2xl font-semibold transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:-translate-y-0.5">
            <span>Visit Crates!</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ranks.map((rank) => (
          <div key={rank.name} className={`bg-white/[0.02] backdrop-blur-sm rounded-3xl p-8 border ${rank.border} text-center relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl flex flex-col`}>
            <div className={`absolute inset-0 ${rank.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-center mb-6">
                <div className={`p-4 rounded-2xl ${rank.bg} border ${rank.border}`}>
                  {rank.icon}
                </div>
              </div>
              <h3 className={`text-2xl font-display font-bold mb-2 ${rank.color}`}>{rank.name}</h3>
              <p className="text-3xl font-display font-bold text-white mb-6">{rank.price}</p>
              
              <ul className="text-left space-y-3 mb-8 flex-1">
                {rank.features.map((feature, i) => (
                  <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                    <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${rank.color.replace('text', 'bg')}`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => setCheckoutItem({ name: `${rank.name} Rank`, price: rank.price })}
                className={`mt-auto w-full py-3 rounded-xl font-semibold border ${rank.border} ${rank.color} ${rank.btnHover} transition-all duration-300 bg-white/5`}
              >
                Purchase
              </button>
            </div>
          </div>
        ))}
      </div>

      <CheckoutModal 
        isOpen={checkoutItem !== null}
        onClose={() => setCheckoutItem(null)}
        itemName={checkoutItem?.name || ''}
        price={checkoutItem?.price || ''}
      />
    </div>
  );
}
