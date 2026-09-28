import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Mail, Check, AlertCircle,
  ArrowRight, ArrowLeft, Sparkles, CheckCircle2, Shield,
  FileText
} from 'lucide-react'
import { countries } from '../data/countries'
import { playClick, playPop } from '../lib/sound'

export function PassengerForm({
  passenger,
  setPassenger,
  onNext,
  onBack,
}) {
  const [activeSubStep, setActiveSubStep] = useState(1)
  const [touched, setTouched] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [phoneCode, setPhoneCode] = useState(passenger.phoneCountryCode || '+1')

  const update = (key, value) => {
    setPassenger((prev) => ({ ...prev, [key]: value }))
  }

  const markTouched = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }))
  }

  // Field validation rules
  const errors = useMemo(() => {
    const errs = {}
    if (!passenger.first || passenger.first.trim().length < 2) {
      errs.first = 'First name must be at least 2 letters'
    }
    if (!passenger.last || passenger.last.trim().length < 2) {
      errs.last = 'Last name must be at least 2 letters'
    }
    if (!passenger.dob) {
      errs.dob = 'Please specify your date of birth'
    }
    if (!passenger.gender) {
      errs.gender = 'Please select a gender option'
    }
    if (!passenger.email || !/^\S+@\S+\.\S+$/.test(passenger.email)) {
      errs.email = 'Please provide a valid email address'
    }
    if (!passenger.phone || !/^[+\d\s()-]{6,}$/.test(passenger.phone)) {
      errs.phone = 'Valid phone number required'
    }
    if (!passenger.nationality) {
      errs.nationality = 'Select your nationality / country'
    }
    return errs
  }, [passenger])

  // Calculate completion percentage for progress animation
  const requiredFields = ['first', 'last', 'dob', 'gender', 'email', 'phone', 'nationality']
  const completedFieldsCount = requiredFields.filter((k) => !errors[k] && passenger[k]).length
  const progressPercent = Math.round((completedFieldsCount / requiredFields.length) * 100)

  // 1-Click Auto-fill Demo Data
  const handleAutoFill = () => {
    playPop()
    setPassenger({
      title: 'Ms',
      first: 'Sophia',
      last: 'Chen',
      dob: '1994-06-18',
      gender: 'Female',
      nationality: 'United States',
      nationalityCode: 'US',
      nationalityFlag: '🇺🇸',
      phoneCountryCode: '+1',
      email: 'sophia.chen@example.com',
      phone: '415 890 2341',
      passport: 'P482910492',
      meal: 'Standard / Chef Selection',
    })
    setPhoneCode('+1')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (Object.keys(errors).length === 0) {
      playClick()
      onNext()
    } else {
      // Find first error sub-step to jump to
      const hasStep1Err = ['first', 'last', 'dob', 'gender'].some((k) => errors[k])
      if (hasStep1Err) setActiveSubStep(1)
      else setActiveSubStep(2)
    }
  }

  return (
    <div className="passenger-form-wrapper">
      {/* Form Progress Header */}
      <div className="passenger-progress-box">
        <div className="progress-info-row">
          <div>
            <span className="step-tag">PASSENGER DETAILS</span>
            <h1 className="step-main-title">Who is traveling?</h1>
            <p className="step-caption">
              Please ensure traveler name matches official passport or government ID exactly.
            </p>
          </div>
          <button
            type="button"
            className="demo-autofill-btn"
            onClick={handleAutoFill}
            title="Auto-fill sample traveler data"
          >
            <Sparkles size={14} className="text-amber-500" />
            <span>Auto-fill Demo Data</span>
          </button>
        </div>

        {/* Animated Progress Bar */}
        <div className="progress-track-container">
          <div className="progress-label-bar">
            <span>Form Completion</span>
            <motion.b
              key={progressPercent}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="text-teal-700 font-bold"
            >
              {progressPercent}% Complete
            </motion.b>
          </div>
          <div className="progress-track-bg">
            <motion.div
              className="progress-track-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            />
          </div>
        </div>

        {/* Sub-step Navigation Tabs */}
        <div className="substep-tabs-row">
          {[
            { id: 1, label: '1. Personal Information' },
            { id: 2, label: '2. Contact & All Countries' },
            { id: 3, label: '3. Preferences & Passport' },
          ].map((tab) => {
            const isActive = activeSubStep === tab.id
            const isDone =
              tab.id === 1
                ? !errors.first && !errors.last && !errors.dob && !errors.gender && passenger.first
                : tab.id === 2
                ? !errors.email && !errors.phone && !errors.nationality && passenger.email
                : !!passenger.passport

            return (
              <button
                key={tab.id}
                type="button"
                className={`substep-tab-btn ${isActive ? 'active' : ''} ${isDone ? 'completed' : ''}`}
                onClick={() => {
                  playClick()
                  setActiveSubStep(tab.id)
                }}
              >
                <span className="tab-indicator-dot">
                  {isDone ? <Check size={11} /> : tab.id}
                </span>
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Interactive Form Card */}
      <form onSubmit={handleSubmit} className="passenger-card-form">
        <AnimatePresence mode="wait">
          {/* Substep 1: Personal Info */}
          {activeSubStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.2 }}
              className="substep-content"
            >
              <div className="substep-section-heading">
                <User size={16} className="text-teal-700" />
                <b>Legal Name & Birthdate</b>
              </div>

              <div className="form-fields-grid">
                {/* Title */}
                <div className="form-field-group">
                  <label className="field-label">Title</label>
                  <select
                    value={passenger.title || 'Ms'}
                    onChange={(e) => update('title', e.target.value)}
                    className="custom-select"
                  >
                    <option>Ms</option>
                    <option>Mr</option>
                    <option>Mrs</option>
                    <option>Mx</option>
                    <option>Dr</option>
                  </select>
                </div>

                {/* First Name */}
                <div
                  className={`form-field-group ${
                    (touched.first || submitted) && errors.first ? 'field-error' : ''
                  }`}
                >
                  <div className="field-label-row">
                    <label className="field-label">First / Given Name</label>
                    {passenger.first && !errors.first && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="valid-indicator"
                      >
                        <CheckCircle2 size={13} className="text-emerald-600" /> Valid
                      </motion.span>
                    )}
                  </div>
                  <div className="field-input-box">
                    <input
                      type="text"
                      placeholder="e.g. Sophia"
                      value={passenger.first || ''}
                      onChange={(e) => update('first', e.target.value)}
                      onBlur={() => markTouched('first')}
                    />
                  </div>
                  <AnimatePresence>
                    {(touched.first || submitted) && errors.first && (
                      <motion.p
                        className="field-error-msg"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0, x: [-3, 3, -2, 2, 0] }}
                        exit={{ opacity: 0 }}
                      >
                        <AlertCircle size={12} /> {errors.first}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Last Name */}
                <div
                  className={`form-field-group ${
                    (touched.last || submitted) && errors.last ? 'field-error' : ''
                  }`}
                >
                  <div className="field-label-row">
                    <label className="field-label">Last / Surname</label>
                    {passenger.last && !errors.last && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="valid-indicator"
                      >
                        <CheckCircle2 size={13} className="text-emerald-600" /> Valid
                      </motion.span>
                    )}
                  </div>
                  <div className="field-input-box">
                    <input
                      type="text"
                      placeholder="e.g. Chen"
                      value={passenger.last || ''}
                      onChange={(e) => update('last', e.target.value)}
                      onBlur={() => markTouched('last')}
                    />
                  </div>
                  <AnimatePresence>
                    {(touched.last || submitted) && errors.last && (
                      <motion.p
                        className="field-error-msg"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0, x: [-3, 3, -2, 2, 0] }}
                        exit={{ opacity: 0 }}
                      >
                        <AlertCircle size={12} /> {errors.last}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Date of Birth */}
                <div
                  className={`form-field-group ${
                    (touched.dob || submitted) && errors.dob ? 'field-error' : ''
                  }`}
                >
                  <div className="field-label-row">
                    <label className="field-label">Date of Birth</label>
                    {passenger.dob && !errors.dob && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="valid-indicator"
                      >
                        <CheckCircle2 size={13} className="text-emerald-600" /> Valid
                      </motion.span>
                    )}
                  </div>
                  <div className="field-input-box">
                    <input
                      type="date"
                      value={passenger.dob || ''}
                      max="2020-01-01"
                      onChange={(e) => update('dob', e.target.value)}
                      onBlur={() => markTouched('dob')}
                    />
                  </div>
                  <AnimatePresence>
                    {(touched.dob || submitted) && errors.dob && (
                      <motion.p
                        className="field-error-msg"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        <AlertCircle size={12} /> {errors.dob}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Gender */}
                <div
                  className={`form-field-group ${
                    (touched.gender || submitted) && errors.gender ? 'field-error' : ''
                  }`}
                >
                  <label className="field-label">Gender (as on Passport)</label>
                  <select
                    value={passenger.gender || ''}
                    onChange={(e) => update('gender', e.target.value)}
                    onBlur={() => markTouched('gender')}
                    className="custom-select"
                  >
                    <option value="">Select Gender</option>
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Undisclosed">Prefer not to say</option>
                  </select>
                  <AnimatePresence>
                    {(touched.gender || submitted) && errors.gender && (
                      <motion.p className="field-error-msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <AlertCircle size={12} /> {errors.gender}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* Substep 2: Contact & All Countries */}
          {activeSubStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.2 }}
              className="substep-content"
            >
              <div className="substep-section-heading">
                <Mail size={16} className="text-teal-700" />
                <b>Contact Information & Global Citizenship (All Countries)</b>
              </div>

              <div className="form-fields-grid">
                {/* Email */}
                <div
                  className={`form-field-group col-span-2 ${
                    (touched.email || submitted) && errors.email ? 'field-error' : ''
                  }`}
                >
                  <div className="field-label-row">
                    <label className="field-label">Email Address (E-Ticket & Boarding Pass)</label>
                    {passenger.email && !errors.email && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="valid-indicator"
                      >
                        <CheckCircle2 size={13} className="text-emerald-600" /> Valid email
                      </motion.span>
                    )}
                  </div>
                  <div className="field-input-box">
                    <Mail size={15} className="input-affix-icon" />
                    <input
                      type="email"
                      placeholder="e.g. sophia.chen@example.com"
                      value={passenger.email || ''}
                      onChange={(e) => update('email', e.target.value)}
                      onBlur={() => markTouched('email')}
                    />
                  </div>
                  <AnimatePresence>
                    {(touched.email || submitted) && errors.email && (
                      <motion.p
                        className="field-error-msg"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0, x: [-3, 3, -2, 2, 0] }}
                        exit={{ opacity: 0 }}
                      >
                        <AlertCircle size={12} /> {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Phone with Country Dial Code Selector */}
                <div
                  className={`form-field-group ${
                    (touched.phone || submitted) && errors.phone ? 'field-error' : ''
                  }`}
                >
                  <div className="field-label-row">
                    <label className="field-label">Mobile Phone (Flight SMS Updates)</label>
                    {passenger.phone && !errors.phone && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="valid-indicator"
                      >
                        <CheckCircle2 size={13} className="text-emerald-600" /> Valid
                      </motion.span>
                    )}
                  </div>
                  <div className="phone-input-composite">
                    {/* Dial Code Select from All Countries */}
                    <select
                      className="phone-dial-select"
                      value={phoneCode}
                      onChange={(e) => {
                        setPhoneCode(e.target.value)
                        update('phoneCountryCode', e.target.value)
                      }}
                      aria-label="Country dial code"
                    >
                      {countries.map((c) => (
                        <option key={`${c.code}-${c.dialCode}`} value={c.dialCode}>
                          {c.flag} {c.code} ({c.dialCode})
                        </option>
                      ))}
                    </select>
                    <div className="field-input-box flex-1">
                      <input
                        type="tel"
                        placeholder="e.g. 555 0192"
                        value={passenger.phone || ''}
                        onChange={(e) => update('phone', e.target.value)}
                        onBlur={() => markTouched('phone')}
                      />
                    </div>
                  </div>
                  <AnimatePresence>
                    {(touched.phone || submitted) && errors.phone && (
                      <motion.p className="field-error-msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <AlertCircle size={12} /> {errors.phone}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Country / Nationality (ALL COUNTRIES OF THE WORLD) */}
                <div
                  className={`form-field-group ${
                    (touched.nationality || submitted) && errors.nationality ? 'field-error' : ''
                  }`}
                >
                  <div className="field-label-row">
                    <label className="field-label">
                      Country / Nationality ({countries.length} Countries)
                    </label>
                    {passenger.nationality && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="valid-indicator"
                      >
                        <CheckCircle2 size={13} className="text-emerald-600" /> Selected
                      </motion.span>
                    )}
                  </div>
                  <select
                    value={passenger.nationality || ''}
                    onChange={(e) => {
                      const selectedName = e.target.value
                      const match = countries.find((c) => c.name === selectedName)
                      if (match) {
                        update('nationality', match.name)
                        update('nationalityCode', match.code)
                        update('nationalityFlag', match.flag)
                        // If phoneCode not set, sync dial code
                        if (!passenger.phoneCountryCode) {
                          setPhoneCode(match.dialCode)
                          update('phoneCountryCode', match.dialCode)
                        }
                      } else {
                        update('nationality', selectedName)
                      }
                    }}
                    onBlur={() => markTouched('nationality')}
                    className="custom-select"
                  >
                    <option value="">Select Country ({countries.length} available)</option>
                    {countries.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.flag} {c.name} ({c.code})
                      </option>
                    ))}
                  </select>
                  <AnimatePresence>
                    {(touched.nationality || submitted) && errors.nationality && (
                      <motion.p className="field-error-msg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <AlertCircle size={12} /> {errors.nationality}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* Substep 3: Preferences & Passport */}
          {activeSubStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.2 }}
              className="substep-content"
            >
              <div className="substep-section-heading">
                <FileText size={16} className="text-teal-700" />
                <b>Travel Documents & Meal Preferences</b>
              </div>

              <div className="form-fields-grid">
                {/* Passport */}
                <div className="form-field-group">
                  <div className="field-label-row">
                    <label className="field-label">Passport / National ID Number</label>
                    <span className="field-optional">Optional now</span>
                  </div>
                  <div className="field-input-box">
                    <input
                      type="text"
                      placeholder="e.g. P12345678"
                      value={passenger.passport || ''}
                      onChange={(e) => update('passport', e.target.value.toUpperCase())}
                    />
                  </div>
                </div>

                {/* Special Meal Selection */}
                <div className="form-field-group">
                  <label className="field-label">Complimentary Dining Choice</label>
                  <select
                    value={passenger.meal || 'Standard / Chef Selection'}
                    onChange={(e) => update('meal', e.target.value)}
                    className="custom-select"
                  >
                    <option>Standard / Chef Selection</option>
                    <option>Asian Vegetarian (AVML)</option>
                    <option>Vegan Gourmet (VGML)</option>
                    <option>Halal Certified (MOML)</option>
                    <option>Kosher Selection (KSML)</option>
                    <option>Gluten-Friendly (GFML)</option>
                    <option>Child Friendly Meal (CHML)</option>
                  </select>
                </div>
              </div>

              {/* Secure Booking Guarantee Box */}
              <div className="passport-security-card">
                <Shield size={18} className="text-teal-600 flex-shrink-0" />
                <div className="security-copy">
                  <b>Government Privacy & ICAO Standard Compliance</b>
                  <p>
                    Your travel documents are protected using AES-256 bank-level encryption. You may also update your passport anytime up to 2 hours before scheduled takeoff.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Form Navigation Controls */}
        <div className="form-bottom-actions">
          {activeSubStep > 1 ? (
            <button
              type="button"
              className="btn-form-back"
              onClick={() => {
                playClick()
                setActiveSubStep((s) => s - 1)
              }}
            >
              <ArrowLeft size={16} />
              <span>Previous Step</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-form-back"
              onClick={onBack}
            >
              <ArrowLeft size={16} />
              <span>Back to Flights</span>
            </button>
          )}

          {activeSubStep < 3 ? (
            <button
              type="button"
              className="btn-form-next"
              onClick={() => {
                playClick()
                setActiveSubStep((s) => s + 1)
              }}
            >
              <span>Next: {activeSubStep === 1 ? 'Contact & Countries' : 'Preferences'}</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <motion.button
              type="submit"
              className="btn-form-submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Continue to Seat Selection</span>
              <ArrowRight size={16} />
            </motion.button>
          )}
        </div>
      </form>
    </div>
  )
}
