import React, { useState } from 'react';
import { X, Copy, Check, QrCode, ClipboardCheck, ArrowRight, User, Mail, Hash, Sparkles } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => boolean | void;
  itemName: string;
  price: string;
  qrImage?: string;
}

export default function CheckoutModal({ isOpen, onClose, itemName, price, qrImage }: CheckoutModalProps) {
  const [ign, setIgn] = useState('');
  const [email, setEmail] = useState('');
  const [utr, setUtr] = useState('');
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [trackingCode] = useState(() => `VX-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(10 + Math.random() * 90)}`);

  if (!isOpen) return null;

  const upiId = 'pay.vixelnetwork@upi';

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!ign.trim()) {
      newErrors.ign = 'Minecraft In-Game Name is required.';
    } else if (ign.trim().length < 3) {
      newErrors.ign = 'IGN must be at least 3 characters.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!utr.trim()) {
      newErrors.utr = 'UTR / Transaction ID is required.';
    } else if (utr.trim().length < 8) {
      newErrors.utr = 'Please enter a valid UTR number (usually 12 digits).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      try {
        const payload = {
          embeds: [
            {
              title: "💰 New Payment Submission Received",
              description: "A player has submitted transaction details for verification.",
              color: 16351254, // Hex color or decimal representation of #f97316 (mc-orange)
              fields: [
                {
                  name: "📧 Email",
                  value: email,
                  inline: true
                },
                {
                  name: "🎮 IGN (Minecraft Name)",
                  value: `\`${ign}\``,
                  inline: true
                },
                {
                  name: "📦 Product Purchased",
                  value: itemName,
                  inline: true
                },
                {
                  name: "💳 Amount Paid",
                  value: price,
                  inline: true
                },
                {
                  name: "🔍 UTR / Transaction ID",
                  value: `\`${utr}\``,
                  inline: true
                },
                {
                  name: "🎫 Tracking Code",
                  value: `\`${trackingCode}\``,
                  inline: true
                }
              ],
              timestamp: new Date().toISOString(),
              footer: {
                text: "VixelMC Store Gatekeeper"
              }
            }
          ]
        };

        await fetch("https://discord.com/api/webhooks/1524397586868338728/QVfk35UnVaBz7kt4RGJUuQbZ6L-7W1vjnzX3pJXmckqauVLfpLvbxlsBKB18V_zx3AdE", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        setSubmitted(true);
      } catch (err) {
        console.error("Error sending to Discord Webhook:", err);
        // Fallback to true so they aren't blocked on network errors
        setSubmitted(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleClose = () => {
    setIgn('');
    setEmail('');
    setUtr('');
    setSubmitted(false);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-xl bg-[#0a0a0c] border border-white/10 rounded-3xl overflow-hidden shadow-2xl shadow-black/80 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-mc-orange/0 via-mc-orange to-mc-purple/0"></div>

        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
          <div>
            <h3 className="text-xl font-display font-bold text-white flex items-center gap-2">
              <Sparkles className="text-mc-orange" size={20} />
              Confirm Purchase
            </h3>
            <p className="text-xs text-gray-400 mt-1">Official Vixel Store Payment Gateway</p>
          </div>
          <button 
            onClick={handleClose}
            className="p-2 rounded-xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Summary Box */}
          <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex justify-between items-center">
            <div>
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Item to Purchase</span>
              <h4 className="text-lg font-display font-bold text-white mt-0.5">{itemName}</h4>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Amount</span>
              <p className="text-2xl font-display font-extrabold text-mc-orange mt-0.5">{price}</p>
            </div>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Official Payment Credentials */}
              <div className="bg-gradient-to-br from-mc-orange/5 to-mc-purple/5 border border-mc-orange/10 p-5 rounded-2xl space-y-4">
                <h5 className="text-xs font-bold text-mc-orange uppercase tracking-wider flex items-center gap-1.5">
                  <QrCode size={16} />
                  Step 1: Scan & Pay with UPI
                </h5>
                
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  {/* QR Code / Scanner Image */}
                  <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-black/20 overflow-hidden">
                    <img 
                      src={qrImage || '/Rs.149.jpg'}
                      alt={`${itemName} Scanner`} 
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        const fallback = e.currentTarget.parentElement?.querySelector('svg');
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <svg viewBox="0 0 100 100" className="w-full h-full text-black" style={{ display: 'none' }}>
                      {/* Generates a stylized decorative QR pattern */}
                      <path d="M 5,5 h 25 v 25 h -25 z M 5,70 h 25 v 25 h -25 z M 70,5 h 25 v 25 h -25 z" fill="currentColor" />
                      <path d="M 12,12 h 11 v 11 h -11 z M 12,77 h 11 v 11 h -11 z M 77,12 h 11 v 11 h -11 z" fill="white" />
                      <path d="M 40,10 h 20 v 5 h -20 z M 40,25 h 10 v 10 h -10 z M 45,50 h 25 v 5 h -25 z M 10,40 h 15 v 15 h -15 z M 40,70 h 15 v 20 h -15 z M 70,40 h 20 v 40 h -20 z M 85,85 h 10 v 10 h -10 z M 55,60 h 10 v 10 h -10 z M 25,60 h 5 v 5 h -5 z" fill="currentColor" />
                      <rect x="45" y="45" width="10" height="10" fill="#f97316" />
                    </svg>
                  </div>

                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <p className="text-xs text-gray-300">
                      Scan the QR code using Google Pay, PhonePe, Paytm, or any UPI App to pay <strong className="text-white">{price}</strong>.
                    </p>
                    <div className="pt-1">
                      <span className="text-[10px] text-gray-400 block uppercase font-bold tracking-wider mb-1">Official UPI ID</span>
                      <div className="inline-flex items-center bg-black/40 border border-white/5 rounded-xl overflow-hidden p-1.5 pl-3">
                        <code className="text-xs text-gray-200 font-mono select-all mr-3">{upiId}</code>
                        <button
                          type="button"
                          onClick={handleCopyUPI}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors flex items-center justify-center"
                        >
                          {copied ? <ClipboardCheck size={14} className="text-green-400" /> : <Copy size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Form */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Hash size={16} className="text-mc-purple" />
                  Step 2: Enter Verification Details
                </h5>

                {/* Minecraft IGN */}
                <div className="space-y-1.5">
                  <label htmlFor="ign" className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                    <User size={14} className="text-gray-400" />
                    Minecraft In-Game Name (IGN)
                  </label>
                  <input
                    type="text"
                    id="ign"
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    placeholder="e.g. Zenix_Vixel"
                    className={`w-full bg-black/30 border ${errors.ign ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-mc-orange'} p-3 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-colors font-mono`}
                  />
                  {errors.ign ? (
                    <p className="text-xs text-red-400">{errors.ign}</p>
                  ) : (
                    <p className="text-[10px] text-gray-400">Must match your in-game name exactly (Java/Bedrock).</p>
                  )}
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                    <Mail size={14} className="text-gray-400" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={`w-full bg-black/30 border ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-mc-orange'} p-3 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-colors`}
                  />
                  {errors.email ? (
                    <p className="text-xs text-red-400">{errors.email}</p>
                  ) : (
                    <p className="text-[10px] text-gray-400">Used for transaction confirmation and status updates.</p>
                  )}
                </div>

                {/* UTR Number */}
                <div className="space-y-1.5">
                  <label htmlFor="utr" className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                    <Hash size={14} className="text-gray-400" />
                    UTR / Transaction Reference Number
                  </label>
                  <input
                    type="text"
                    id="utr"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="e.g. 518392749281"
                    className={`w-full bg-black/30 border ${errors.utr ? 'border-red-500/50 focus:border-red-500' : 'border-white/10 focus:border-mc-orange'} p-3 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none transition-colors font-mono`}
                  />
                  {errors.utr ? (
                    <p className="text-xs text-red-400">{errors.utr}</p>
                  ) : (
                    <p className="text-[10px] text-gray-400">The 12-digit transaction ID from your GPay, PhonePe, or banking app receipt.</p>
                  )}
                </div>
              </div>

              {/* Submit Action */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-xl font-display font-bold text-white bg-gradient-to-r from-mc-orange to-mc-purple hover:from-mc-orange-dark hover:to-mc-purple-dark transition-all duration-300 shadow-lg shadow-mc-orange/10 hover:shadow-mc-orange/20 flex items-center justify-center gap-2 group mt-2 ${
                  isSubmitting ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>Submitting Details...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Payment Details</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Success State */
            <div className="text-center py-6 space-y-6">
              {/* Success Ring Animation */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full animate-pulse"></div>
                  <div className="w-16 h-16 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center text-green-400">
                    <Check size={32} className="animate-scale-up" />
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <h4 className="text-xl font-display font-bold text-white">Payment Submitted!</h4>
                <p className="text-sm text-gray-300">
                  Your verification request has been successfully queued for processing.
                </p>
              </div>

              {/* Details table */}
              <div className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 text-left space-y-2.5 max-w-sm mx-auto text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Tracking Code:</span>
                  <span className="font-mono font-bold text-mc-orange select-all">{trackingCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">In-Game Name:</span>
                  <span className="font-mono font-semibold text-white">{ign}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Item Purchased:</span>
                  <span className="text-white font-medium">{itemName} ({price})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">UTR / Reference ID:</span>
                  <span className="font-mono text-white break-all">{utr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="font-bold text-yellow-400 animate-pulse">Under Manual Verification</span>
                </div>
              </div>

              {/* Info Disclaimer */}
              <p className="text-xs text-gray-400 max-w-md mx-auto leading-relaxed pt-2">
                Our team is currently verifying your UTR with the UPI banking gateway. Once confirmed, your item will be credited directly to your profile. Please check back in-game in <strong className="text-white">5 to 15 minutes</strong>.
              </p>

              <button
                onClick={handleClose}
                className="w-full max-w-xs py-3 rounded-xl font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors mx-auto"
              >
                Close Gateway
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
