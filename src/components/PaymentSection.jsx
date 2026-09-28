import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard, QrCode, Building, ShieldCheck, Check,
  ArrowLeft, Lock, Sparkles, RefreshCw, Smartphone
} from 'lucide-react'
import { money } from '../data/flights'
import { playClick, playPop, playSwoosh } from '../lib/sound'

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, subtitle: 'Visa, Mastercard, Amex' },
  { id: 'upi', label: 'Instant UPI & QR', icon: QrCode, subtitle: 'Google Pay, PhonePe, Paytm' },
  { id: 'netbanking', label: 'Net Banking', icon: Building, subtitle: 'All major banks' },
  { id: 'wallet', label: 'Apple / Google Pay', icon: Smartphone, subtitle: '1-Click Express Checkout' },
]

export function PaymentSection({
  totalAmount,
  onPaySuccess,
  onBack,
  passenger,
}) {
  const [method, setMethod] = useState('card')
  const [card, setCard] = useState({
    name: '',
    number: '',
    expiry: '',
    cvv: '',
  })
  const [isFlipped, setIsFlipped] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [selectedBank, setSelectedBank] = useState('Chase')

  // Auto-detect Card Brand
  const cardBrand = useMemo(() => {
    const raw = card.number.replace(/\D/g, '')
    if (raw.startsWith('4')) return { name: 'VISA', color: '#1a3b8b' }
    if (raw.startsWith('5')) return { name: 'MASTERCARD', color: '#eb001b' }
    if (raw.startsWith('3')) return { name: 'AMEX', color: '#007bc1' }
    if (raw.startsWith('6')) return { name: 'DISCOVER', color: '#ff6000' }
    return { name: 'VISA', color: '#168c91' }
  }, [card.number])

  const updateCard = (key, value) => {
    setPaymentError('')
    setCard((prev) => ({ ...prev, [key]: value }))
  }

  // Format Card Number (adds space every 4 digits)
  const handleNumberChange = (e) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 16)
    const formatted = val.replace(/(\d{4})/g, '$1 ').trim()
    updateCard('number', formatted)
  }

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4)
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`
    }
    updateCard('expiry', val)
  }

  // Auto-fill Demo Card
  const fillDemoCard = () => {
    playPop()
    setCard({
      name: passenger?.first ? `${passenger.first.toUpperCase()} ${passenger.last.toUpperCase()}` : 'ALEXANDER HAMILTON',
      number: '4532 8920 4821 9012',
      expiry: '12/28',
      cvv: '742',
    })
  }

  const handlePay = (e) => {
    e.preventDefault()
    setPaymentError('')

    if (method === 'card') {
      const cleanNum = card.number.replace(/\s/g, '')
      if (cleanNum.length < 15) {
        setPaymentError('Please enter a valid 16-digit card number.')
        return
      }
      if (!card.name || card.name.trim().length < 3) {
        setPaymentError('Please enter the cardholder name.')
        return
      }
      if (!card.expiry || card.expiry.length < 5) {
        setPaymentError('Please enter a valid expiry date (MM/YY).')
        return
      }
      if (!card.cvv || card.cvv.length < 3) {
        setPaymentError('Please enter the 3 or 4 digit CVV security code.')
        return
      }
    }

    playClick()
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      onPaySuccess()
    }, 1200)
  }

  return (
    <div className="payment-page-wrapper">
      {/* Header */}
      <div className="payment-header-card">
        <div>
          <span className="step-tag">SECURE CHECKOUT</span>
          <h1 className="step-main-title">Select Payment Method</h1>
          <p className="step-caption">
            256-bit encrypted simulated checkout for testing the booking engine.
          </p>
        </div>
        <div className="payment-total-pill">
          <span>Total Due:</span>
          <b>{money(totalAmount)}</b>
        </div>
      </div>

      {/* Payment Method Selector Tabs with Motion Layout Indicator */}
      <div className="payment-methods-grid">
        {PAYMENT_METHODS.map((pm) => {
          const Icon = pm.icon
          const isSelected = method === pm.id
          return (
            <button
              key={pm.id}
              type="button"
              className={`payment-method-card ${isSelected ? 'active-method' : ''}`}
              onClick={() => {
                playClick()
                setMethod(pm.id)
              }}
            >
              {isSelected && (
                <motion.div
                  layoutId="activePaymentHighlight"
                  className="payment-card-highlight-ring"
                  transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                />
              )}
              <div className="pm-card-inner">
                <div className="pm-icon-wrap">
                  <Icon size={18} />
                </div>
                <div className="pm-text-wrap">
                  <b>{pm.label}</b>
                  <small>{pm.subtitle}</small>
                </div>
                {isSelected && (
                  <span className="pm-check-circle">
                    <Check size={12} />
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* Selected Payment Method Form View */}
      <div className="payment-body-container">
        {method === 'card' && (
          <div className="card-checkout-split">
            {/* 3D Animated Flipping Card */}
            <div className="card-visual-column">
              <div className="card-perspective-stage">
                <motion.div
                  className="interactive-credit-card"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* FRONT FACE */}
                  <div className="card-face card-front-face">
                    <div className="card-hologram-sheen" />
                    <div className="card-front-top">
                      <div className="card-bank-name">
                        <span className="brand-dot" />
                        <span>skyvoyage.</span>
                      </div>
                      <div className="card-brand-tag">{cardBrand.name}</div>
                    </div>

                    <div className="card-chip-row">
                      <div className="emv-chip">
                        <span />
                        <span />
                      </div>
                      <div className="contactless-waves">
                        <span />
                        <span />
                        <span />
                      </div>
                    </div>

                    <div className="card-number-readout">
                      {card.number || '•••• •••• •••• ••••'}
                    </div>

                    <div className="card-front-bottom">
                      <div className="card-holder-block">
                        <small>CARDHOLDER NAME</small>
                        <b>{card.name || 'YOUR FULL NAME'}</b>
                      </div>
                      <div className="card-expiry-block">
                        <small>EXPIRES</small>
                        <b>{card.expiry || 'MM/YY'}</b>
                      </div>
                    </div>
                  </div>

                  {/* BACK FACE */}
                  <div className="card-face card-back-face">
                    <div className="mag-stripe" />
                    <div className="back-cvv-section">
                      <small>AUTHORIZED SIGNATURE / SECURITY CODE</small>
                      <div className="cvv-signature-strip">
                        <span className="fake-signature">SkyVoyage Verified</span>
                        <b className="cvv-digits">{card.cvv || '•••'}</b>
                      </div>
                    </div>
                    <div className="back-disclaimer">
                      <span>Demo simulated card. No real transaction occurs.</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Flip Button Toggle */}
              <button
                type="button"
                className="manual-flip-btn"
                onClick={() => {
                  playSwoosh()
                  setIsFlipped(!isFlipped)
                }}
              >
                <RefreshCw size={13} />
                <span>{isFlipped ? 'View Front of Card' : 'View Back of Card (CVV)'}</span>
              </button>

              <button
                type="button"
                className="autofill-card-btn"
                onClick={fillDemoCard}
              >
                <Sparkles size={13} className="text-amber-500" />
                <span>Fill Demo Card Details</span>
              </button>
            </div>

            {/* Card Inputs Form */}
            <form onSubmit={handlePay} className="card-inputs-column">
              {/* Cardholder Name */}
              <div className="card-input-field">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  placeholder="e.g. SOPHIA CHEN"
                  value={card.name}
                  onFocus={() => setIsFlipped(false)}
                  onChange={(e) => updateCard('name', e.target.value.toUpperCase())}
                />
              </div>

              {/* Card Number */}
              <div className="card-input-field">
                <label>Card Number</label>
                <div className="input-with-badge">
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    maxLength={19}
                    onFocus={() => setIsFlipped(false)}
                    onChange={handleNumberChange}
                  />
                  <span className="card-network-badge">{cardBrand.name}</span>
                </div>
              </div>

              {/* Expiry & CVV */}
              <div className="card-two-col">
                <div className="card-input-field">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM / YY"
                    maxLength={5}
                    value={card.expiry}
                    onFocus={() => setIsFlipped(false)}
                    onChange={handleExpiryChange}
                  />
                </div>
                <div className="card-input-field">
                  <label>Security Code (CVV)</label>
                  <input
                    type="password"
                    inputMode="numeric"
                    placeholder="CVV"
                    maxLength={4}
                    value={card.cvv}
                    onFocus={() => {
                      playSwoosh()
                      setIsFlipped(true)
                    }}
                    onBlur={() => setIsFlipped(false)}
                    onChange={(e) =>
                      updateCard('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))
                    }
                  />
                </div>
              </div>

              {/* Error Banner */}
              <AnimatePresence>
                {paymentError && (
                  <motion.div
                    className="payment-error-banner"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0, x: [-5, 5, -3, 3, 0] }}
                    exit={{ opacity: 0 }}
                  >
                    <span>{paymentError}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Pay Button */}
              <motion.button
                type="submit"
                className="pay-now-btn"
                disabled={isProcessing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isProcessing ? (
                  <>
                    <span className="payment-spinner" />
                    <span>Processing Demo Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Pay {money(totalAmount)} Securely</span>
                  </>
                )}
              </motion.button>
            </form>
          </div>
        )}

        {/* UPI & Instant QR View */}
        {method === 'upi' && (
          <div className="upi-payment-view">
            <div className="qr-box-card">
              <div className="qr-wrapper">
                <div className="qr-animated-laser" />
                <div className="simulated-qr-pattern">
                  <div className="qr-corner qr-tl" />
                  <div className="qr-corner qr-tr" />
                  <div className="qr-corner qr-bl" />
                  <div className="qr-dots-grid" />
                </div>
              </div>
              <span className="qr-scan-hint">Scan with any UPI App to Pay</span>
              <b className="qr-amount-text">{money(totalAmount)}</b>
            </div>

            <div className="upi-apps-row">
              {['Google Pay', 'PhonePe', 'Paytm', 'Amazon Pay'].map((app) => (
                <button
                  key={app}
                  type="button"
                  className="upi-app-btn"
                  onClick={handlePay}
                >
                  <span>Pay via {app}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="pay-now-btn mt-4"
              onClick={handlePay}
              disabled={isProcessing}
            >
              {isProcessing ? 'Verifying UPI Authorization...' : `Complete ${money(totalAmount)} via UPI`}
            </button>
          </div>
        )}

        {/* Net Banking View */}
        {method === 'netbanking' && (
          <div className="netbanking-view">
            <label className="field-label mb-2">Select your financial institution</label>
            <div className="banks-grid">
              {[
                'Chase Bank', 'Bank of America', 'Wells Fargo', 'Citibank',
                'Barclays', 'HSBC', 'DBS Bank', 'Standard Chartered'
              ].map((bank) => (
                <button
                  key={bank}
                  type="button"
                  className={`bank-select-btn ${selectedBank === bank ? 'active-bank' : ''}`}
                  onClick={() => {
                    playClick()
                    setSelectedBank(bank)
                  }}
                >
                  <Building size={16} />
                  <span>{bank}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              className="pay-now-btn mt-6"
              onClick={handlePay}
              disabled={isProcessing}
            >
              {isProcessing ? 'Redirecting to Bank Portal...' : `Authorize ${money(totalAmount)} with ${selectedBank}`}
            </button>
          </div>
        )}

        {/* 1-Click Wallet View */}
        {method === 'wallet' && (
          <div className="wallet-view">
            <div className="express-checkout-card">
              <Smartphone size={38} className="text-teal-700" />
              <h3>Express Biometric Checkout</h3>
              <p>Authorize instantly using Apple Pay Face ID or Google Pay Touch ID.</p>
              <button
                type="button"
                className="apple-pay-btn"
                onClick={handlePay}
                disabled={isProcessing}
              >
                {isProcessing ? 'Authenticating Face ID...' : `Pay with Pay (${money(totalAmount)})`}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="payment-footer-bar">
        <button type="button" className="btn-secondary-back" onClick={onBack}>
          <ArrowLeft size={16} />
          <span>Back to Seat Selection</span>
        </button>

        <div className="security-guarantee-note">
          <ShieldCheck size={16} className="text-emerald-600" />
          <span>Guaranteed Safe Checkout · SkyVoyage Buyer Protection</span>
        </div>
      </div>
    </div>
  )
}
