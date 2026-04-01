import React, { useState, useEffect, useRef, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Github, Linkedin, Mail, ExternalLink, GraduationCap, Award, Code2, Cpu, Globe, User, Send, ChevronRight, Moon, Sun, LogIn, ShieldCheck, LogOut } from "lucide-react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { logout } from "./firebase";
import AdminPage from "./components/AdminPage";
import LoginPage from "./components/LoginPage";

// --- Types ---
interface Project {
  title: string;
  description: string;
  tags: string[];
  image: string;
  github: string;
  demo: string;
}

interface Skill {
  name: string;
  level: number;
  category: 'Programming' | 'Web' | 'Tools' | 'Soft Skills';
}

// --- Constants ---
const PROJECTS: Project[] = [
  {
    title: "Nexus AI Dashboard",
    description: "A futuristic analytics platform with real-time data visualization and AI-driven insights.",
    tags: ["React", "TypeScript", "Tailwind", "Framer Motion"],
    image: "https://picsum.photos/seed/nexus/800/600",
    github: "#",
    demo: "#"
  },
  {
    title: "Quantum E-Commerce",
    description: "High-performance shopping experience with glassmorphic UI and seamless transitions.",
    tags: ["Next.js", "Stripe", "PostgreSQL", "Shadcn"],
    image: "https://picsum.photos/seed/quantum/800/600",
    github: "#",
    demo: "#"
  },
  {
    title: "Ether Social Space",
    description: "Decentralized social networking concept focusing on privacy and minimalist design.",
    tags: ["React Native", "Firebase", "Web3.js"],
    image: "https://picsum.photos/seed/ether/800/600",
    github: "#",
    demo: "#"
  }
];

const SKILLS: Skill[] = [
  { name: "JavaScript", level: 90, category: 'Programming' },
  { name: "TypeScript", level: 85, category: 'Programming' },
  { name: "Python", level: 75, category: 'Programming' },
  { name: "React", level: 92, category: 'Web' },
  { name: "Next.js", level: 88, category: 'Web' },
  { name: "Tailwind CSS", level: 95, category: 'Web' },
  { name: "Node.js", level: 80, category: 'Web' },
  { name: "Git", level: 85, category: 'Tools' },
  { name: "Docker", level: 70, category: 'Tools' },
  { name: "Figma", level: 80, category: 'Tools' },
  { name: "Problem Solving", level: 90, category: 'Soft Skills' },
  { name: "Communication", level: 85, category: 'Soft Skills' },
];

// --- Components ---

const SectionHeading = ({ children, subtitle }: { children: ReactNode; subtitle?: string }) => (
  <div className="mb-12">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-display font-bold mb-4"
    >
      {children}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="text-foreground/60 max-w-2xl"
      >
        {subtitle}
      </motion.p>
    )}
    <motion.div 
      initial={{ width: 0 }}
      whileInView={{ width: 100 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="h-1 bg-accent mt-4 rounded-full"
    />
  </div>
);

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: "transform 0.1s ease-out"
      }}
      className="glass rounded-3xl overflow-hidden group cursor-pointer"
    >
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
          <div className="flex gap-4">
            <a href={project.github} className="p-3 glass rounded-full hover:bg-accent hover:text-background transition-colors">
              <Github size={20} />
            </a>
            <a href={project.demo} className="p-3 glass rounded-full hover:bg-accent hover:text-background transition-colors">
              <ExternalLink size={20} />
            </a>
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-display font-bold mb-2 group-hover:text-accent transition-colors">{project.title}</h3>
        <p className="text-foreground/60 text-sm mb-4 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.tags.map(tag => (
            <span key={tag} className="text-[10px] uppercase tracking-widest font-bold px-2 py-1 glass rounded-md text-accent/80">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const SkillBadge: React.FC<{ skill: Skill }> = ({ skill }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    whileHover={{ y: -5, scale: 1.05 }}
    className="glass p-4 rounded-2xl flex flex-col items-center justify-center gap-2 group"
  >
    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
      <Code2 className="text-accent" size={24} />
    </div>
    <span className="font-medium text-sm">{skill.name}</span>
    <div className="w-full h-1 bg-foreground/10 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        whileInView={{ width: `${skill.level}%` }}
        transition={{ duration: 1, delay: 0.5 }}
        className="h-full bg-accent"
      />
    </div>
  </motion.div>
);

function Portfolio() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [scrolled, setScrolled] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    const handleScroll = () => setScrolled(window.scrollY > 50);
    const handleMouseMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme === 'light' ? 'bg-white text-black' : 'bg-background text-foreground'}`}>
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              y: -100,
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
            }}
            className="fixed inset-0 bg-background flex flex-col items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative mb-8"
            >
              <div className="w-32 h-32 border-2 border-accent/10 border-t-accent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center font-display font-bold text-4xl text-accent">
                N
              </div>
            </motion.div>
            
            <div className="w-64 h-1 bg-foreground/5 rounded-full overflow-hidden relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-accent"
              />
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 font-display text-sm tracking-[0.3em] uppercase opacity-40"
            >
              Initializing Experience {progress}%
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Cursor Follower */}
            <motion.div 
              className="fixed top-0 left-0 w-8 h-8 border-2 border-accent rounded-full pointer-events-none z-[9999] hidden md:block"
              animate={{ x: mousePos.x - 16, y: mousePos.y - 16 }}
              transition={{ type: "spring", damping: 20, stiffness: 250, mass: 0.5 }}
            />
            <motion.div 
              className="fixed top-0 left-0 w-2 h-2 bg-accent rounded-full pointer-events-none z-[9999] hidden md:block"
              animate={{ x: mousePos.x - 4, y: mousePos.y - 4 }}
              transition={{ type: "spring", damping: 30, stiffness: 400, mass: 0.2 }}
            />

            {/* Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
              <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-secondary/10 blur-[120px] rounded-full" />
              <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-accent/5 blur-[80px] rounded-full" />
            </div>

            {/* Navigation */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-4' : 'py-8'}`}>
              <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-display font-bold tracking-tighter"
                  >
                    NAVEEN<span className="text-accent">.</span>
                  </motion.div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="hidden md:flex items-center gap-8 glass px-8 py-3 rounded-full"
                >
                  {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
                    <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium hover:text-accent transition-colors">
                      {item}
                    </a>
                  ))}
                  {!user && (
                    <button 
                      onClick={() => navigate('/login')}
                      className="text-sm font-bold text-accent hover:opacity-80 transition-opacity"
                    >
                      Sign In
                    </button>
                  )}
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-4"
                >
                  <button 
                    onClick={toggleTheme}
                    className="p-3 glass rounded-full hover:bg-accent/10 transition-colors"
                  >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                  </button>

                  {!user ? (
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/login')}
                      className="flex items-center gap-2 px-6 py-2.5 bg-accent text-background rounded-full text-sm font-bold hover:glow-shadow transition-all"
                    >
                      <LogIn size={16} /> <span>Sign In</span>
                    </motion.button>
                  ) : (
                    <div className="flex items-center gap-2">
                      {isAdmin && (
                        <button 
                          onClick={() => navigate('/admin')}
                          className="p-2.5 glass rounded-full text-accent hover:bg-accent hover:text-background transition-all"
                          title="Admin Dashboard"
                        >
                          <ShieldCheck size={20} />
                        </button>
                      )}
                      <button 
                        onClick={() => logout()}
                        className="p-2.5 glass rounded-full text-foreground/60 hover:text-destructive transition-all"
                        title="Logout"
                      >
                        <LogOut size={20} />
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>
            </nav>

            <main className="relative z-10">
              {/* Hero Section */}
              <section className="min-h-screen flex items-center pt-20">
                <div className="container mx-auto px-6">
                  <div className="max-w-4xl">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                      className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-xs font-bold tracking-widest uppercase mb-6 text-accent"
                    >
                      <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                      Available for opportunities
                    </motion.div>
                    
                    <motion.h1 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-6xl md:text-8xl font-display font-bold leading-tight mb-8"
                    >
                      {["Crafting", "Digital", "Experiences."].map((word, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 1.5 + (i * 0.15), duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
                          className={`inline-block mr-4 ${i === 2 ? 'text-gradient' : ''}`}
                        >
                          {word}
                        </motion.span>
                      ))}
                    </motion.h1>

                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.2 }}
                      className="text-xl text-foreground/60 max-w-2xl mb-12 leading-relaxed"
                    >
                      Hi, I'm <span className="text-foreground font-bold">Naveen</span>. A BCA Graduate and Aspiring Software Developer dedicated to building high-performance, visually stunning web applications.
                    </motion.p>

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 2.4 }}
                      className="flex flex-wrap gap-6"
                    >
                      <button className="px-8 py-4 bg-accent text-background font-bold rounded-2xl hover:glow-shadow transition-all flex items-center gap-2 group">
                        View Projects <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                      </button>
                      {!user && (
                        <button 
                          onClick={() => navigate('/login')}
                          className="px-8 py-4 bg-accent/10 text-accent font-bold rounded-2xl hover:bg-accent hover:text-background transition-all flex items-center gap-2"
                        >
                          <LogIn size={18} /> Sign In to Explore
                        </button>
                      )}
                      <button className="px-8 py-4 glass font-bold rounded-2xl hover:bg-foreground/5 transition-all">
                        Download CV
                      </button>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* About Section */}
              <section id="about" className="py-32">
                <div className="container mx-auto px-6">
                  <div className="grid md:grid-cols-2 gap-20 items-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      className="relative aspect-square"
                    >
                      <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full" />
                      <div className="relative w-full h-full glass rounded-[40px] overflow-hidden p-4">
                        <img 
                          src="https://picsum.photos/seed/naveen-profile/800/800" 
                          alt="Naveen" 
                          className="w-full h-full object-cover rounded-[32px]"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      {/* Floating Stats */}
                      <motion.div 
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute -top-6 -right-6 glass p-6 rounded-3xl"
                      >
                        <div className="text-3xl font-bold text-accent">15+</div>
                        <div className="text-xs uppercase tracking-widest opacity-60">Projects Done</div>
                      </motion.div>
                    </motion.div>

                    <div>
                      <SectionHeading subtitle="A quick look into my journey and what drives me as a developer.">
                        About Me
                      </SectionHeading>
                      <div className="space-y-6 text-foreground/70 leading-relaxed">
                        <p>
                          As a Bachelor of Computer Applications (BCA) graduate, I have built a strong foundation in computer science principles, data structures, and software engineering.
                        </p>
                        <p>
                          My passion lies at the intersection of design and technology. I don't just write code; I craft experiences that are intuitive, accessible, and performant. I am constantly learning and adapting to the ever-evolving tech landscape.
                        </p>
                        <div className="grid grid-cols-2 gap-6 pt-6">
                          <div className="glass p-4 rounded-2xl">
                            <div className="text-accent font-bold mb-1">Education</div>
                            <div className="text-sm">BCA Graduate</div>
                          </div>
                          <div className="glass p-4 rounded-2xl">
                            <div className="text-accent font-bold mb-1">Location</div>
                            <div className="text-sm">Bhiwani</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Skills Section */}
              <section id="skills" className="py-32 bg-foreground/[0.02]">
                <div className="container mx-auto px-6">
                  <SectionHeading subtitle="My technical arsenal and the tools I use to bring ideas to life.">
                    Skills Universe
                  </SectionHeading>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {SKILLS.map((skill) => (
                      <SkillBadge key={skill.name} skill={skill} />
                    ))}
                  </div>
                </div>
              </section>

              {/* Projects Section */}
              <section id="projects" className="py-32">
                <div className="container mx-auto px-6">
                  <SectionHeading subtitle="A selection of my recent work, showcasing my skills in full-stack development.">
                    Featured Projects
                  </SectionHeading>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {PROJECTS.map((project) => (
                      <ProjectCard key={project.title} project={project} />
                    ))}
                  </div>
                </div>
              </section>

              {/* Education Timeline */}
              <section className="py-32 bg-foreground/[0.02]">
                <div className="container mx-auto px-6">
                  <SectionHeading subtitle="My academic background and certifications.">
                    Education & Timeline
                  </SectionHeading>
                  
                  <div className="max-w-3xl mx-auto space-y-12">
                    {[
                      {
                        year: "2021 - 2024",
                        title: "Bachelor of Computer Applications",
                        org: "University Name",
                        desc: "Focused on Software Engineering, Database Management, and Web Technologies. Graduated with honors."
                      },
                      {
                        year: "2024 - Present",
                        title: "Full Stack Web Development",
                        org: "Self-Learning / Certifications",
                        desc: "Deep diving into modern frameworks like React, Next.js, and backend technologies."
                      }
                    ].map((item, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative pl-8 border-l-2 border-accent/30"
                      >
                        <div className="absolute -left-[9px] top-0 w-4 h-4 bg-accent rounded-full glow-shadow" />
                        <div className="text-accent font-bold text-sm mb-2">{item.year}</div>
                        <h3 className="text-2xl font-display font-bold mb-2">{item.title}</h3>
                        <div className="text-foreground/60 font-medium mb-4">{item.org}</div>
                        <p className="text-foreground/50 leading-relaxed">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section id="contact" className="py-32">
                <div className="container mx-auto px-6">
                  <div className="glass rounded-[40px] p-12 md:p-20 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/5 blur-[100px] rounded-full pointer-events-none" />
                    
                    <div className="grid md:grid-cols-2 gap-20 relative z-10">
                      <div>
                        <h2 className="text-5xl font-display font-bold mb-8">Let's Build <br /> Something <span className="text-gradient">Great.</span></h2>
                        <p className="text-foreground/60 mb-12 max-w-md">
                          I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
                        </p>
                        
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="p-4 glass rounded-2xl text-accent"><Mail size={24} /></div>
                            <div>
                              <div className="text-xs uppercase tracking-widest opacity-50">Email Me</div>
                              <div className="font-bold">naveen@developer.com</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="p-4 glass rounded-2xl text-accent"><Linkedin size={24} /></div>
                            <div>
                              <div className="text-xs uppercase tracking-widest opacity-50">Connect</div>
                              <div className="font-bold">linkedin.com/in/naveen</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <form className="space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest font-bold opacity-50 ml-2">Name</label>
                            <input type="text" className="w-full glass p-4 rounded-2xl focus:outline-none focus:border-accent transition-colors" placeholder="John Doe" />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs uppercase tracking-widest font-bold opacity-50 ml-2">Email</label>
                            <input type="email" className="w-full glass p-4 rounded-2xl focus:outline-none focus:border-accent transition-colors" placeholder="john@example.com" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs uppercase tracking-widest font-bold opacity-50 ml-2">Message</label>
                          <textarea rows={4} className="w-full glass p-4 rounded-2xl focus:outline-none focus:border-accent transition-colors resize-none" placeholder="Your message here..." />
                        </div>
                        <button className="w-full py-4 bg-accent text-background font-bold rounded-2xl hover:glow-shadow transition-all flex items-center justify-center gap-2">
                          Send Message <Send size={18} />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </section>
            </main>

            <footer className="py-12 border-t border-glass-border">
              <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-xl font-display font-bold tracking-tighter">
                  NAVEEN<span className="text-accent">.</span>
                </div>
                <div className="text-foreground/40 text-sm">
                  © 2026 Naveen. All rights reserved. Designed with passion.
                </div>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-accent transition-colors"><Github size={20} /></a>
                  <a href="#" className="hover:text-accent transition-colors"><Linkedin size={20} /></a>
                  <a href="#" className="hover:text-accent transition-colors"><Globe size={20} /></a>
                </div>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Portfolio />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}
