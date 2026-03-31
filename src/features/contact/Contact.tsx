import { Send, MapPin, Mail, Clock } from "lucide-react";
import { useState } from "react";
import FadeInView from "@/shared/components/FadeInView";
import StaggerInView from "@/shared/components/StaggerInView";

export default function Contact() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormState({ name: "", email: "", message: "" });
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="h-full pt-8 pb-12 w-full max-w-5xl mx-auto flex flex-col">
      <StaggerInView className="mb-10 flex flex-col gap-4 text-center md:text-left" stagger={0.2} y={20}>
        <h2 className="theme-heading text-4xl md:text-5xl font-bold tracking-tight">
          Let's Work <span className="gradient-text">Together</span>
        </h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto md:mx-0">
          Have a project in mind or just want to chat? I'd love to hear from you.
        </p>
      </StaggerInView>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 flex-1">

        {/* Contact Form */}
        <FadeInView delay={0.1}>
          <div className="glass-strong rounded-3xl p-6 md:p-8 relative overflow-hidden">
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[60px] pointer-events-none" />

            <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm font-medium text-white/80 ml-1">Name</label>
                <input
                  type="text"
                  id="name"
                  required
                  className="glass-input w-full px-4 py-3 rounded-xl"
                  placeholder="John Doe"
                  value={formState.name}
                  onChange={e => setFormState({ ...formState, name: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-white/80 ml-1">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  className="glass-input w-full px-4 py-3 rounded-xl"
                  placeholder="john@example.com"
                  value={formState.email}
                  onChange={e => setFormState({ ...formState, email: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2 flex-1">
                <label htmlFor="message" className="text-sm font-medium text-white/80 ml-1">Message</label>
                <textarea
                  id="message"
                  required
                  className="glass-input w-full px-4 py-3 rounded-xl h-32 resize-none"
                  placeholder="Tell me about your project..."
                  value={formState.message}
                  onChange={e => setFormState({ ...formState, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`mt-2 w-full py-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300 ${
                  isSuccess
                    ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                    : "gradient-bg text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:shadow-[0_0_30px_rgba(236,72,153,0.5)] hover:-translate-y-1"
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isSuccess ? (
                  "Message Sent!"
                ) : (
                  <>Send Message <Send className="w-4 h-4 ml-1" /></>
                )}
              </button>
            </form>
          </div>
        </FadeInView>

        {/* Contact Info */}
        <StaggerInView className="flex flex-col gap-6" stagger={0.2} y={20} amount={0.15}>
          <div className="glass rounded-3xl p-6 md:p-8 flex items-start gap-5 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-pink-500/20 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1">Email</h3>
              <p className="text-white/60 mb-2">Drop me a line anytime.</p>
              <a href="mailto:hello@example.com" className="text-pink-300 hover:text-pink-200 transition-colors font-medium">
                hello@example.com
              </a>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 md:p-8 flex items-start gap-5 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 text-violet-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1">Location</h3>
              <p className="text-white/60 mb-2">Available for remote work worldwide.</p>
              <span className="text-white/80 font-medium">San Francisco, CA</span>
            </div>
          </div>

          <div className="glass rounded-3xl p-6 md:p-8 flex items-start gap-5 hover:bg-white/10 transition-colors">
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-white mb-1">Availability</h3>
              <p className="text-white/60 mb-2">Currently accepting new projects.</p>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-sm font-medium border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Available for hire
              </span>
            </div>
          </div>
        </StaggerInView>

      </div>
    </div>
  );
}
