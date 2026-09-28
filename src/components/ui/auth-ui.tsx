import { useEffect, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, X } from 'lucide-react'
import { Typewriter } from './typewriter'

export interface AuthUIProps { onClose: () => void }

export function AuthUI({ onClose }: AuthUIProps) {
  const [signIn, setSignIn] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    setMessage(signIn ? `Welcome back. You're signed in as ${email}.` : `Your SkyVoyage account is ready, ${name}.`)
  }

  return <motion.div className="sky-auth-backdrop" role="presentation" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <motion.section className="sky-auth-modal" role="dialog" aria-modal="true" aria-labelledby="auth-title" initial={{ opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: .98 }}>
      <button className="sky-auth-close" onClick={onClose} aria-label="Close sign in"><X size={18}/></button>
      <div className="sky-auth-form-side"><a className="sky-auth-brand" href="#home"><span>✦</span> skyvoyage<span>.</span></a>
        <div className="sky-auth-title"><div className="eyebrow">YOUR JOURNEY, TOGETHER</div><h2 id="auth-title">{signIn ? 'Welcome back.' : 'A world awaits.'}</h2><p>{signIn ? 'Sign in to see your trips and thoughtful little extras.' : 'Create an account and make every trip your own.'}</p></div>
        <AnimatePresence mode="wait">{message ? <motion.div className="sky-auth-success" key="success" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>{message}<button onClick={onClose}>Continue exploring <ArrowRight size={14}/></button></motion.div> : <motion.form key={signIn ? 'sign-in' : 'sign-up'} onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {!signIn && <label>Full name<input name="name" placeholder="Your name" autoComplete="name" required/></label>}
          <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required/></label>
          <label>Password<span className="sky-password"><input name="password" type={showPassword ? 'text' : 'password'} placeholder="At least 8 characters" minLength={8} autoComplete={signIn ? 'current-password' : 'new-password'} required/><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button></span></label>
          <button className="primary-btn sky-auth-submit" type="submit">{signIn ? 'Sign in' : 'Create account'} <ArrowRight size={15}/></button>
          <div className="sky-auth-divider"><span/>or<span/></div>
          <button className="sky-google-btn" type="button" onClick={() => setMessage('Demo sign-in complete. Connect an identity provider to enable Google authentication.')}>Continue with Google</button>
        </motion.form>}</AnimatePresence>
        <p className="sky-auth-toggle">{signIn ? 'New to SkyVoyage?' : 'Already have an account?'} <button type="button" onClick={() => { setMessage(''); setSignIn((value) => !value) }}>{signIn ? 'Create an account' : 'Sign in'}</button></p>
        <small className="sky-auth-demo-note">Demo UI only — account details stay in this browser session.</small>
      </div>
      <div className="sky-auth-image"><div className="sky-auth-image-shade"/><div className="sky-auth-quote"><small>THE WORLD IS STILL WIDE OPEN</small><p>“<Typewriter text={signIn ? 'The journey continues.' : 'A new chapter awaits.'} speed={55}/>”</p><span>Everywhere, a little closer.</span></div></div>
    </motion.section>
  </motion.div>
}
