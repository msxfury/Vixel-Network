import React, { useState } from 'react';
import { PackageOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import CheckoutModal from '../components/CheckoutModal';

export default function Crates() {
  const [checkoutItem, setCheckoutItem] = useState<{ name: string; price: string } | null>(null);

  const crates = [
    {
      name: 'Common Crate',
      price: '₹99',
      color: 'text-gray-300',
      border: 'border-gray-500/20',
      bg: 'bg-gray-500/5',
      btnHover: 'hover:bg-gray-200 hover:text-black',
      features: [
        'Iron/Gold tools & armor',
        'Basic enchant books',
        '500-2000 game coins',
        'Small chance: rare cosmetic'
      ]
    },
    {
      name: 'Mythic Crate',
      price: '₹299',
      color: 'text-purple-400',
      border: 'border-purple-500/20',
      bg: 'bg-purple-500/5',
      btnHover: 'hover:bg-purple-500 hover:text-white',
      features: [
        'Diamond gear with Enchants',
        'Mythic pet egg',
        '5000 in game coins',
        'Guaranteed rare cosmetic'
      ]
    },
    {
      name: 'Legendary Crate',
      price: '₹599',
      color: 'text-yellow-400',
      border: 'border-yellow-500/20',
      bg: 'bg-yellow-500/5',
      btnHover: 'hover:bg-yellow-500 hover:text-black',
      features: [
        'Netherite gear (custom Enchants)',
        'Legendary Dragon pet',
        '25000 in game coins',
        'Exclusive particle set',
        'Chance: VIXEL-GOD 24h trial'
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <Link to="/store" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group text-sm font-medium">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Store</span>
        </Link>
      </div>
      
      <div className="text-center mb-16">
        <h1 className="text-4xl font-display font-bold text-white mb-4">Crates</h1>
        <p className="text-gray-400 font-medium">Unlock amazing rewards with our custom crates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {crates.map((crate) => (
          <div key={crate.name} className={`bg-white/[0.02] backdrop-blur-sm rounded-3xl p-8 border ${crate.border} flex flex-col items-center justify-center group hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl`}>
            <div className={`p-5 rounded-2xl ${crate.bg} border ${crate.border} mb-6 group-hover:scale-110 transition-transform duration-300`}>
              <PackageOpen size={40} className={`${crate.color}`} />
            </div>
            <h3 className={`text-2xl font-display font-bold mb-2 ${crate.color}`}>{crate.name}</h3>
            <p className="text-3xl font-display font-bold text-white mb-6">{crate.price}</p>
            
            <ul className="text-left w-full space-y-3 mb-8 flex-1">
              {crate.features.map((feature, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                  <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${crate.color.replace('text', 'bg')}`} />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button 
              onClick={() => setCheckoutItem({ name: `${crate.name} Key`, price: crate.price })}
              className={`w-full py-3 rounded-xl font-semibold border ${crate.border} ${crate.color} bg-white/5 ${crate.btnHover} hover:border-transparent transition-all duration-300`}
            >
              Purchase Key
            </button>
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
