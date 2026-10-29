import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import financeDashboard from './assets/projects/Autonomous Finance Clerk Dashboard.png'
import portfolioAssistantPreview from './assets/projects/AI Portfolio Assistant Hero Mockup.png'
import visionBridgePreview from './assets/projects/Vision Bridge.png'
import yuktaViharPreview from './assets/projects/YuktaVihar Vacation Rental Showcase (1).png'
import educationCard from './assets/projects/Education.png'
import skillsCard from './assets/projects/2.png'
import projectsCard from './assets/projects/Projects.png'
import experienceCard from './assets/projects/Experience.png'
import sceneOval from './assets/projects/Oval.png'
import sceneArrow from './assets/projects/Arrow.png'
import sceneCircularLines from './assets/projects/circular_lines.png'
import reactLogo from './assets/projects/react.png'
import pythonLogo from './assets/projects/python.png'
import llmLogo from './assets/projects/llm.png'
import fastapiLogo from './assets/projects/fastapi.png'
import linkedinLogo from './assets/projects/Linkedin-Transparent.webp'
import githubLogo from './assets/projects/github.png'
import leetcodeLogo from './assets/projects/leetcode.png'
import './App.css'

const projects = [
  {
    name: 'YuktaVihar',
    type: 'A place to find your next stay',
    description: 'A full-stack vacation rental marketplace with listing management, secure accounts, and image uploads.',
    stack: ['Node.js', 'Express', 'MongoDB', 'Cloudinary'],
    className: 'project-yukta',
    mark: 'YV',
    shape: 'stay',
    repo: 'https://github.com/binitrajput/YuktaVihar',
    image: yuktaViharPreview,
  },
  {
    name: 'Vision Bridge',
    type: 'Meet, wherever you are',
    description: 'A real-time video conferencing platform built around WebRTC and Socket.io, supporting 100+ users.',
    stack: ['React', 'WebRTC', 'Socket.io', 'MongoDB'],
    className: 'project-vision',
    mark: 'VB',
    shape: 'video',
    repo: 'https://github.com/binitrajput/Vision-Bridge',
    live: 'https://vision-bridge-frontend.onrender.com/',
    image: visionBridgePreview,
  },
  {
    name: 'AI Portfolio Assistant',
    type: 'AI-powered recruiter Q&A',
    description: 'A recruiter-facing assistant that answers natural-language questions about my education, skills, projects, and experience.',
    highlights: [
      'Uses portfolio context and prompt constraints to keep answers focused on recruiter questions.',
      'Streams responses end to end with FastAPI StreamingResponse and React ReadableStream.',
      'Deployed on Vercel and Render with Groq-hosted LLMs.',
    ],
    stack: ['React', 'FastAPI', 'Groq', 'Streaming', 'Vercel', 'Render'],
    className: 'project-ai',
    mark: 'AI',
    shape: 'assistant',
    repo: 'https://github.com/binitrajput/AIPortfolioAssistant',
    live: 'https://your-ai-portfolio.vercel.app',
    image: portfolioAssistantPreview,
  },
  {
    name: 'Autonomous Finance Clerk',
    type: 'LLM-powered invoice processing agent',
    description: 'A finance workflow agent for invoice search, review, and ledger operations, with human approval gates, validation checks, ledger verification, and audit reports.',
    stack: ['Python', 'Streamlit', 'LiteLLM', 'SQLite', 'Groq'],
    className: 'project-finance',
    mark: 'FC',
    shape: 'finance',
    date: 'October 2026',
    repo: 'https://github.com/binitrajput/autonomous-finance-clerk',
    live: 'https://autonomous-finance-clerk.streamlit.app/',
    image: financeDashboard,
  },
]

const skills = ['C++', 'Python', 'JavaScript', 'React', 'FastAPI', 'Node.js', 'Express', 'MongoDB', 'SQL', 'Generative AI', 'REST APIs', 'Git']

function renderFormattedText(text) {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index}>{part.slice(1, -1)}</em>
    }
    return part
  })
}

function App() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [isSending, setIsSending] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [nearPageEnd, setNearPageEnd] = useState(false)
  const [atWorkSection, setAtWorkSection] = useState(false)
  const [activeProjectIndex, setActiveProjectIndex] = useState(projects.length)
  const [theme, setTheme] = useState(() => window.localStorage.getItem('portfolio-theme') || 'light')
  const inputRef = useRef(null)
  const messagesRef = useRef(null)
  const heroMessagesRef = useRef(null)
  const projectsTrackRef = useRef(null)
  const projectDragRef = useRef({ active: false, settling: false, moved: false, suppressClick: false, captureTarget: null, startX: 0, startScroll: 0, lastX: 0, lastTime: 0, velocity: 0, frame: 0 })

  function scrollProjects(direction) {
    const track = projectsTrackRef.current
    const first = track?.children[0]
    const second = track?.children[1]
    if (!track || !first || !second) return
    const step = second.getBoundingClientRect().left - first.getBoundingClientRect().left
    track.scrollBy({ left: direction * step, behavior: 'smooth' })
  }

  function handleProjectPointerDown(event) {
    if (event.pointerType !== 'mouse' || event.button !== 0) return
    const track = projectsTrackRef.current
    if (!track) return
    if (projectDragRef.current.frame) cancelAnimationFrame(projectDragRef.current.frame)
    const now = performance.now()
    const captureTarget = event.target instanceof Element ? event.target.closest('a') || track : track
    projectDragRef.current = { active: true, settling: false, moved: false, suppressClick: false, captureTarget, startX: event.clientX, startScroll: track.scrollLeft, lastX: event.clientX, lastTime: now, velocity: 0, frame: 0 }
    track.classList.add('is-dragging')
    captureTarget.setPointerCapture(event.pointerId)
  }

  function handleProjectPointerMove(event) {
    const drag = projectDragRef.current
    const track = projectsTrackRef.current
    if (!drag.active || !track) return
    if (!drag.moved && Math.abs(event.clientX - drag.startX) < 6) return
    drag.moved = true
    event.preventDefault()
    track.scrollLeft = drag.startScroll - (event.clientX - drag.startX)
    const now = performance.now()
    const elapsed = Math.max(1, now - drag.lastTime)
    const instantVelocity = -(event.clientX - drag.lastX) / elapsed
    drag.velocity = drag.velocity * 0.35 + instantVelocity * 0.65
    drag.lastX = event.clientX
    drag.lastTime = now
  }

  function handleProjectPointerUp(event) {
    const track = projectsTrackRef.current
    if (!projectDragRef.current.active || !track) return
    const drag = projectDragRef.current
    drag.active = false
    if (drag.captureTarget?.hasPointerCapture(event.pointerId)) drag.captureTarget.releasePointerCapture(event.pointerId)
    drag.captureTarget = null
    if (!drag.moved) {
      track.classList.remove('is-dragging')
      return
    }
    drag.suppressClick = true
    let velocity = Math.max(-1.4, Math.min(1.4, drag.velocity))
    let lastFrame = performance.now()
    const settleAtCenter = () => {
      const trackRect = track.getBoundingClientRect()
      const centerX = trackRect.left + track.clientWidth / 2
      const nearestCard = Array.from(track.children).reduce((nearest, card) => {
        const rect = card.getBoundingClientRect()
        const distance = Math.abs(rect.left + rect.width / 2 - centerX)
        return !nearest || distance < nearest.distance ? { card, distance } : nearest
      }, null)?.card
      if (!nearestCard) {
        drag.frame = 0
        track.classList.remove('is-dragging')
        return
      }
      const rect = nearestCard.getBoundingClientRect()
      const distance = rect.left + rect.width / 2 - centerX
      if (Math.abs(distance) < 1) {
        drag.settling = false
        drag.frame = 0
        track.classList.remove('is-dragging')
        handleProjectsScroll()
        return
      }
      drag.settling = true
      const start = track.scrollLeft
      const target = start + distance
      const startTime = performance.now()
      const duration = 650
      const animateSettle = (time) => {
        const progress = Math.min(1, (time - startTime) / duration)
        const eased = 1 - Math.pow(1 - progress, 3)
        track.scrollLeft = start + (target - start) * eased
        if (progress < 1) {
          drag.frame = requestAnimationFrame(animateSettle)
        } else {
          drag.settling = false
          drag.frame = 0
          track.classList.remove('is-dragging')
          handleProjectsScroll()
        }
      }
      drag.frame = requestAnimationFrame(animateSettle)
    }
    const glide = (now) => {
      const elapsed = Math.min(32, now - lastFrame)
      lastFrame = now
      track.scrollLeft += velocity * elapsed
      velocity *= Math.pow(0.94, elapsed / 16)
      if (Math.abs(velocity) > 0.025) {
        drag.frame = requestAnimationFrame(glide)
      } else {
        drag.frame = 0
        settleAtCenter()
      }
    }
    if (Math.abs(velocity) > 0.025) drag.frame = requestAnimationFrame(glide)
    else settleAtCenter()
  }

  function handleProjectClickCapture(event) {
    if (!projectDragRef.current.suppressClick) return
    projectDragRef.current.suppressClick = false
    event.preventDefault()
    event.stopPropagation()
  }

  useEffect(() => {
    window.localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  useEffect(() => {
    const revealSelector = '.hero-copy, .hero-chat-scene, .ticker, .section-heading, .projects-wheel-wrap, .project-card, .about-grid > *, .skill, .numbers-row > div, .education-note, .contact-inner > *, .footer > *'
    const revealItems = document.querySelectorAll(
      revealSelector,
    )
    revealItems.forEach((item) => {
      const siblings = Array.from(item.parentElement.children).filter((sibling) => sibling.matches(revealSelector))
      const stagger = Math.min(siblings.indexOf(item), 4) * 65
      item.style.setProperty('--reveal-delay', `${stagger}ms`)
      item.classList.add('scroll-reveal')
    })

    if (!('IntersectionObserver' in window)) {
      revealItems.forEach((item) => item.classList.add('is-revealed'))
      return undefined
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-revealed')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' })

    revealItems.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const updatePageEnd = () => {
      const remaining = document.documentElement.scrollHeight - window.innerHeight - window.scrollY
      setNearPageEnd(remaining < 300)
      const projectsSection = document.getElementById('work')
      setAtWorkSection(Boolean(projectsSection && window.scrollY >= projectsSection.offsetTop - 20))
    }
    updatePageEnd()
    window.addEventListener('scroll', updatePageEnd, { passive: true })
    window.addEventListener('resize', updatePageEnd)
    return () => {
      window.removeEventListener('scroll', updatePageEnd)
      window.removeEventListener('resize', updatePageEnd)
    }
  }, [])

  function handleProjectsScroll() {
    const track = projectsTrackRef.current
    const firstCard = track?.children[0]
    const loopCard = track?.children[projects.length]
    if (!track || !firstCard || !loopCard) return
    const loopDistance = loopCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().left
    if (!projectDragRef.current.settling) {
      if (track.scrollLeft < loopDistance) track.scrollLeft += loopDistance
      else if (track.scrollLeft >= loopDistance * 2) track.scrollLeft -= loopDistance
    }
    const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2
    let nearestIndex = 0
    let nearestDistance = Infinity
    Array.from(track.children).forEach((card, index) => {
      const rect = card.getBoundingClientRect()
      const distance = Math.abs(rect.left + rect.width / 2 - trackCenter)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearestIndex = index
      }
    })
    setActiveProjectIndex((current) => current === nearestIndex ? current : nearestIndex)
  }

  useLayoutEffect(() => {
    const track = projectsTrackRef.current
    const firstCard = track?.children[0]
    const middleSetFirstCard = track?.children[projects.length]
    if (!track || !firstCard || !middleSetFirstCard) return
    track.scrollLeft = middleSetFirstCard.getBoundingClientRect().left - firstCard.getBoundingClientRect().left
  }, [])

  useEffect(() => {
    if (!chatOpen) return undefined
    document.body.classList.add('chat-modal-open')
    inputRef.current?.focus()
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setChatOpen(false)
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.classList.remove('chat-modal-open')
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [chatOpen])

  useEffect(() => {
    ;[messagesRef.current, heroMessagesRef.current].forEach((messagesElement) => {
      if (messagesElement) messagesElement.scrollTop = messagesElement.scrollHeight
    })
  }, [messages])

  async function handleSend(event) {
    event?.preventDefault()
    const prompt = question.trim()
    if (!prompt || isSending) return

    setQuestion('')
    setIsSending(true)
    setMessages((current) => [...current, { role: 'user', content: prompt }, { role: 'assistant', content: '' }])

    let flushTimer
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: prompt }),
      })
      if (!response.ok) throw new Error('The assistant could not answer just now. Please try again.')
      if (!response.body) throw new Error('This browser could not open the assistant response.')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let answer = ''
      let pending = ''
      let displayed = ''
      let streamDone = false
      const flushPending = () => new Promise((resolve) => {
        flushTimer = window.setInterval(() => {
          if (pending.length) {
            const amount = Math.min(3, pending.length)
            displayed += pending.slice(0, amount)
            pending = pending.slice(amount)
            setMessages((current) => current.map((message, index) =>
              index === current.length - 1 ? { ...message, content: displayed } : message,
            ))
          } else if (streamDone) {
            window.clearInterval(flushTimer)
            resolve()
          }
        }, 18)
      })
      const animation = flushPending()
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        answer += chunk
        pending += chunk
      }
      const finalChunk = decoder.decode()
      answer += finalChunk
      pending += finalChunk
      streamDone = true
      await animation
      setMessages((current) => current.map((message, index) =>
        index === current.length - 1 ? { ...message, content: answer || 'I could not find an answer to that just now.' } : message,
      ))
    } catch (error) {
      if (typeof flushTimer !== 'undefined') window.clearInterval(flushTimer)
      setMessages((current) => current.map((message, index) =>
        index === current.length - 1
          ? { ...message, content: error.message || 'Could not connect to the assistant. Please try again.' }
          : message,
      ))
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main data-theme={theme}>
      <a className="wordmark first-screen-mark" href="#top" aria-label="Binit Rajput home">BR<span>.</span></a>
      <nav className={`nav shell ${atWorkSection ? 'nav-at-work' : ''}`} aria-label="Main navigation">
        <div className="nav-center-links">
          <div className={`nav-section-links ${atWorkSection ? 'is-collapsed' : ''}`} inert={atWorkSection}>
            <a href="#work">Work</a><a href="#about">About</a><span className="nav-divider" aria-hidden="true" />
          </div>
          <a className="nav-social-link" href="https://github.com/binitrajput" target="_blank" rel="noreferrer" aria-label="GitHub profile" title="GitHub">
            <img src={githubLogo} alt="" /><span className="nav-social-name">GitHub</span>
          </a>
          <a className="nav-social-link nav-leetcode-link" href="https://leetcode.com/u/binit_rajput/" target="_blank" rel="noreferrer" aria-label="LeetCode profile" title="LeetCode">
            <img src={leetcodeLogo} alt="" /><span className="nav-social-name">LeetCode</span>
          </a>
          <a className="nav-social-link" href="https://www.linkedin.com/in/binit-rajput-307a923b9/" target="_blank" rel="noreferrer" aria-label="LinkedIn profile" title="LinkedIn">
            <img src={linkedinLogo} alt="" /><span className="nav-social-name">LinkedIn</span>
          </a>
        </div>
      </nav>
      <button className="theme-toggle" type="button" onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
        <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span><small>{theme === 'light' ? 'Dark' : 'Light'}</small>
      </button>

      <section className="hero shell" id="top">
        <div className="hero-copy">
          <div className="hero-brand"><span>✳</span> AI Portfolio Assistant</div>
          <h1>AI Portfolio<br /><span className="highlight">Assistant</span></h1>
          <div className="hero-bottom">
            <div>
              <p className="hero-intro">An AI-powered portfolio and resume assistant that helps recruiters get quick, accurate answers about my education, skills, projects and experience.</p>
              <div className="hero-tech-list">
                <span><img src={pythonLogo} alt="" />Python</span>
                <span><img src={fastapiLogo} alt="" />FastAPI</span>
                <span><img src={reactLogo} alt="" />React</span>
                <span><img src={llmLogo} alt="" />LLM APIs</span>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-art hero-chat-scene">
          <img className="scene-oval" src={sceneOval} alt="" />
          <img className="scene-circular-lines" src={sceneCircularLines} alt="" />
          <img className="scene-topic scene-topic-education" src={educationCard} alt="Education" />
          <img className="scene-topic scene-topic-skills" src={skillsCard} alt="Skills" />
          <img className="scene-topic scene-topic-projects" src={projectsCard} alt="Projects" />
          <img className="scene-topic scene-topic-experience" src={experienceCard} alt="Experience" />
          <p className="scene-arrow-copy">Ask anything<br />about my portfolio</p>
          <img className="scene-arrow" src={sceneArrow} alt="" />
          <section className="hero-chat-panel" aria-label="Chat with Binit’s AI assistant">
            <header className="hero-chat-header"><span className="assistant-avatar">B<span>✳</span></span><div><b>Ask AI about Binit</b><small><span className="status-dot" /> Here to help</small></div><span className="hero-chat-close" aria-hidden="true">×</span></header>
            <div className="chat-messages hero-chat-messages" aria-live="polite" ref={heroMessagesRef}>
              {messages.length === 0 ? <div className="chat-empty"><p>Hi! Ask me about my projects, skills, education or experience.</p><div className="suggestions"><button type="button" onClick={() => setQuestion('What are my key projects?')}>What are my key projects? <span>↗</span></button><button type="button" onClick={() => setQuestion('What technologies does Binit use?')}>Explore my tech stack <span>↗</span></button></div></div> : messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`hero-${message.role}-${index}`}><span className="message-label">{message.role === 'user' ? 'YOU' : 'BINIT’S ASSISTANT'}</span><p>{renderFormattedText(message.content || (isSending && index === messages.length - 1 ? 'Thinking…' : ''))}</p></div>)}
            </div>
            <form className="chat-form hero-chat-form" onSubmit={handleSend}><input aria-label="Ask the assistant a question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question about my work…" /><button type="submit" disabled={isSending || !question.trim()} aria-label="Send question">{isSending ? '…' : 'Send'} <span>↗</span></button></form>
            <p className="chat-footnote">A small AI assistant, here to help you get to know my work.</p>
          </section>
        </div>
      </section>

      <section className="ticker" aria-label="Areas of interest">
        <div className="ticker-track"><span>FULL-STACK DEVELOPMENT</span><b>✳</b><span>GENERATIVE AI</span><b>✳</b><span>BUILDING FOR PEOPLE</span><b>✳</b><span>FULL-STACK DEVELOPMENT</span><b>✳</b><span>GENERATIVE AI</span><b>✳</b><span>BUILDING FOR PEOPLE</span><b>✳</b></div>
      </section>

      <section className="work-section shell section-space" id="work">
        <div className="section-heading">
          <div><p className="eyebrow">A FEW THINGS I’VE MADE</p><h2>Selected work<span className="highlight-dot">.</span></h2></div>
          <p className="section-note">Small teams, big ideas, and a lot of learning along the way.</p>
        </div>
        <div className="projects-wheel-wrap">
          <div className="projects-wheel" ref={projectsTrackRef} onScroll={handleProjectsScroll} onPointerDown={handleProjectPointerDown} onPointerMove={handleProjectPointerMove} onPointerUp={handleProjectPointerUp} onPointerCancel={handleProjectPointerUp} onClickCapture={handleProjectClickCapture} onDragStart={(event) => event.preventDefault()} aria-label="Project carousel. Drag horizontally to explore projects.">
            {[...projects, ...projects, ...projects].map((project, index, allProjects) => {
              const previousIndex = (activeProjectIndex - 1 + allProjects.length) % allProjects.length
              const nextIndex = (activeProjectIndex + 1) % allProjects.length
              const inMiddleSet = index >= projects.length && index < projects.length * 2
              const PreviewLink = project.live ? 'a' : 'div'
              const previewLinkProps = project.live ? {
                href: project.live,
                target: '_blank',
                rel: 'noreferrer',
                'aria-label': `Open ${project.name} live site`,
              } : {}
              return <article className={`project-card arc-card-${index % projects.length} ${project.className} ${activeProjectIndex === index ? 'is-active' : ''} ${index === previousIndex ? 'is-previous' : ''} ${index === nextIndex ? 'is-next' : ''}`} key={`${project.name}-${index}`} aria-hidden={!inMiddleSet} inert={!inMiddleSet}>
                <PreviewLink className="project-preview-link" {...previewLinkProps}>
                <div className={`project-art ${project.shape} ${project.image ? 'has-photo' : ''}`}>
                  {project.image && <img className="project-photo" src={project.image} alt={`${project.name} screenshot`} loading="lazy" draggable="false" />}
                  {project.shape === 'stay' && <><div className="stay-sun" /><div className="stay-house"><span /></div><div className="stay-hill hill-back" /><div className="stay-hill hill-front" /><span className="art-label">TAKE THE SCENIC ROUTE</span></>}
                  {project.shape === 'video' && <><div className="video-orb orb-a" /><div className="video-orb orb-b" /><div className="video-orb orb-c" /><div className="video-panel"><span /><span /><span /><b>LIVE<br />TOGETHER</b></div><span className="art-label">GOOD TO SEE YOU</span></>}
                  {project.shape === 'assistant' && <><div className="chat-bubble bubble-one">Tell me about your work <span>↗</span></div><div className="chat-bubble bubble-two">I build full-stack apps and AI tools.</div><div className="assistant-spark">✳</div><span className="art-label">A LITTLE HELP, ON DEMAND</span></>}
                  {project.shape === 'portfolio' && <><div className="portfolio-window"><div className="portfolio-window-top"><i /><i /><i /></div><div className="portfolio-window-content"><span>HELLO, I’M BINIT</span><b>Building useful<br />things for the internet.</b><i>SELECTED WORK&nbsp;&nbsp; ABOUT&nbsp;&nbsp; CONTACT</i></div></div><div className="portfolio-orbit" /><span className="art-label">A DIGITAL HOME FOR MY WORK</span></>}
                  {project.shape === 'finance' && <><div className="finance-sheet"><div className="finance-sheet-heading"><span>INVOICE REVIEW</span><b>✓ VERIFIED</b></div><div className="invoice-row"><i /><span>INV-2048 · ACME SUPPLY</span><b>$1,240.00</b></div><div className="invoice-row"><i /><span>INV-2049 · NORTHSTAR CO.</span><b>$860.50</b></div><div className="invoice-row flagged"><i /><span>INV-2050 · DUPLICATE CHECK</span><b>REVIEW</b></div><div className="ledger-total"><span>LEDGER STATUS</span><b>Balanced <i>✓</i></b></div></div><span className="finance-stamp">HUMAN<br />APPROVED</span><span className="art-label">TRACEABLE BY DESIGN</span></>}
                </div>
                </PreviewLink>
                <div className="project-info">
                <div className="project-title-row"><div><p className="project-type">{project.type}</p>{project.live ? <h3><a href={project.live} target="_blank" rel="noreferrer">{project.name}</a></h3> : <h3>{project.name}</h3>}{project.date && <p className="project-date">{project.date}</p>}</div>{project.live && <a className="project-arrow" href={project.live} target="_blank" rel="noreferrer" aria-label={`Open ${project.name} live site`}>↗</a>}</div>
                  <p className="project-description">{project.description}</p>
                  {project.highlights && <ul className="project-highlights">{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
                  <div className="tag-list">{project.stack.map((item) => <span key={item}>{item}</span>)}</div>
                {project.repo && <div className="project-external-links"><a href={project.repo} target="_blank" rel="noreferrer">GitHub <span>↗</span></a>{project.live && <a href={project.live} target="_blank" rel="noreferrer">Live link <span>↗</span></a>}</div>}
                </div>
              </article>
            })}
          </div>
          <div className="wheel-controls"><p><span>DRAG</span> TO EXPLORE <b>↔</b></p><div><button type="button" onClick={() => scrollProjects(-1)} aria-label="Previous project">←</button><button type="button" onClick={() => scrollProjects(1)} aria-label="Next project">→</button></div></div>
        </div>
      </section>

      <section className="about-section" id="about">
        <div className="shell about-grid">
          <div className="about-title"><p className="eyebrow">A LITTLE ABOUT ME</p><h2>Curious by<br />nature<span className="highlight-dot">.</span><br /><span className="serif-italic">Builder by choice.</span></h2></div>
          <div className="about-copy"><p>I’m pursuing a B.Tech in Electronics and Communication Engineering (IIoT) at NIT Kurukshetra. I enjoy working across the stack, learning how systems fit together, and making technology feel a little more human.</p><p>Outside of building, I’m usually working through a DSA problem or exploring what’s possible with generative AI.</p><div className="education-note"><span className="education-icon">✳</span><div><b>NIT Kurukshetra</b><span>B.Tech, ECE (IIoT) · Class of 2027</span></div><span className="education-score">8.18 CGPA</span></div></div>
        </div>
      </section>

      <section className="skills-section shell section-space">
        <div className="section-heading"><div><p className="eyebrow">MY TOOLBOX</p><h2>Things I work with<span className="highlight-dot">.</span></h2></div><p className="section-note">Always learning something new.</p></div>
        <div className="skill-cloud">{skills.map((skill, index) => <span className={`skill skill-${index % 4}`} key={skill}>{skill}</span>)}</div>
        <div className="numbers-row"><div><strong>300<span>+</span></strong><small>DSA problems solved</small></div><div><strong>98.48<span>%</span></strong><small>JEE Main percentile</small></div><div><strong>100<span>+</span></strong><small>users supported on Vision Bridge</small></div></div>
      </section>

      <section className="contact-section" id="contact">
        <div className="shell contact-inner"><p className="eyebrow">HAVE A PROJECT IN MIND?</p><h2>Let’s make<br /><span>something good.</span></h2><a className="email-link" href="mailto:binitrajput5@gmail.com">binitrajput5@gmail.com <span>↗</span></a><div className="social-links"><a href="https://github.com/binitrajput" target="_blank" rel="noreferrer">GitHub ↗</a><a href="https://www.linkedin.com/in/binit-rajput-307a923b9/" target="_blank" rel="noreferrer">LinkedIn ↗</a><a href="https://leetcode.com/u/binit_rajput/" target="_blank" rel="noreferrer">LeetCode ↗</a><a href="https://www.geeksforgeeks.org/profile/binitrajput5?tab=activity" target="_blank" rel="noreferrer">GeeksforGeeks ↗</a></div></div>
      </section>

      <button className={`chat-launcher ${nearPageEnd ? 'expanded' : ''}`} type="button" onClick={() => setChatOpen(true)} aria-label="Open AI chat">
        <span className="launcher-mark">✳</span><span className="launcher-label">Ask AI</span><span className="launcher-expanded-label">Ask AI about Binit</span>
      </button>

      {chatOpen && <div className="chat-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setChatOpen(false) }}>
        <section className="chat-modal" role="dialog" aria-modal="true" aria-labelledby="chat-title">
          <header className="chat-modal-header"><div className="modal-title"><span className="assistant-avatar">B<span>✳</span></span><div><h2 id="chat-title">Ask AI about Binit</h2><p><span className="status-dot" /> Here to help</p></div></div><button type="button" className="chat-close" onClick={() => setChatOpen(false)} aria-label="Close chat">×</button></header>
          <div className="chat-messages modal-messages" aria-live="polite" ref={messagesRef}>
            {messages.length === 0 ? <div className="chat-empty"><span className="assistant-avatar">B<span>✳</span></span><p>Hi! I can answer questions about Binit’s projects, skills, and experience.</p><div className="suggestions"><button type="button" onClick={() => setQuestion('Tell me about Vision Bridge')}>Tell me about Vision Bridge <span>↗</span></button><button type="button" onClick={() => setQuestion('What technologies does Binit use?')}>What technologies does Binit use? <span>↗</span></button></div></div> : messages.map((message, index) => <div className={`chat-message ${message.role}`} key={`${message.role}-${index}`}><span className="message-label">{message.role === 'user' ? 'YOU' : 'BINIT’S ASSISTANT'}</span><p>{renderFormattedText(message.content || (isSending && index === messages.length - 1 ? 'Thinking…' : ''))}</p></div>)}
          </div>
          <form className="chat-form modal-chat-form" onSubmit={handleSend}><input ref={inputRef} aria-label="Ask the assistant a question" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ask a question about Binit…" /><button type="submit" disabled={isSending || !question.trim()} aria-label="Send question">{isSending ? '…' : 'Send'} <span>↗</span></button></form>
          <p className="chat-footnote">A small AI assistant, here to help you get to know my work.</p>
        </section>
      </div>}

      <footer className="footer shell"><a className="wordmark" href="#top">BR<span>.</span></a><span>Designed & built by Binit Rajput · 2026</span><a href="#top">Back to top ↑</a></footer>
    </main>
  )
}

export default App
