"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect, useCallback } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "Bienvenido al diagnóstico express de Quijote Labs. Voy a hacerte 3 preguntas incómodas sobre tu negocio. Al final te digo la verdad — te guste o no.\n\n¿A qué se dedica tu empresa?",
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (userText: string) => {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: userText,
      };

      const updatedMessages = [...messages, userMsg];
      setMessages(updatedMessages);
      setIsLoading(true);

      try {
        // Exclude the hardcoded welcome message — Gemini requires the first message to be from the user
        const apiMessages = updatedMessages
          .filter((m) => m.id !== "welcome")
          .map(({ role, content }) => ({ role, content }));

        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (!res.ok || !res.body) {
          throw new Error("API error");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        const assistantId = crypto.randomUUID();

        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: "assistant", content: "" },
        ]);

        let done = false;
        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId
                  ? { ...m, content: m.content + chunk }
                  : m
              )
            );
          }
        }
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content:
              "Algo salió mal. Intenta de nuevo o escríbenos a admin@quijotelabs.com",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    sendMessage(trimmed);
  };

  // Detect when the diagnosis is complete via the marker
  const diagnosisReady = messages.some(
    (m) => m.role === "assistant" && m.content.includes("---DIAGNOSTICO_LISTO---")
  );

  // Build mailto link with conversation summary
  const buildMailtoLink = () => {
    const summary = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => `${m.role === "user" ? "Yo" : "Quijote Labs"}: ${m.content.replace("---DIAGNOSTICO_LISTO---", "").trim()}`)
      .join("\n\n");

    const subject = encodeURIComponent("Mi diagnóstico express — Quijote Labs");
    const body = encodeURIComponent(
      `Hola equipo de Quijote Labs,\n\nAcabo de hacer el diagnóstico express y me gustaría profundizar.\n\nAquí va el resumen de mi conversación:\n\n${summary}\n\n---\nQuedo al pendiente para agendar una sesión.`
    );
    return `mailto:admin@quijotelabs.com?subject=${subject}&body=${body}`;
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent hover:bg-accent-light text-white shadow-lg shadow-accent/25 flex items-center justify-center transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Cerrar chat" : "Abrir diagnóstico"}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.svg
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </motion.svg>
          ) : (
            <motion.svg
              key="chat"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="w-7 h-7"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              {/* Robot head */}
              <rect x="4" y="8" width="16" height="12" rx="2" />
              {/* Antenna */}
              <line x1="12" y1="8" x2="12" y2="4" />
              <circle cx="12" cy="3" r="1" fill="currentColor" />
              {/* Eyes */}
              <circle cx="9" cy="13" r="1.5" fill="currentColor" />
              <circle cx="15" cy="13" r="1.5" fill="currentColor" />
              {/* Mouth */}
              <line x1="9" y1="17" x2="15" y2="17" strokeLinecap="round" />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] rounded-2xl border border-white/10 bg-surface shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
            style={{ maxHeight: "min(600px, calc(100vh - 8rem))" }}
          >
            {/* Header */}
            <div className="px-5 py-4 border-b border-white/5 flex items-center gap-3 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/logo-mark.svg" width={32} height={32} alt="Quijote Labs" />
              <div>
                <p className="text-sm font-semibold">Diagnóstico Express</p>
                <p className="text-xs text-muted">
                  Quijote Labs — verdad incómoda gratis
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-accent text-white rounded-br-md"
                        : "bg-white/5 text-foreground rounded-bl-md"
                    }`}
                  >
                    {message.content
                      .replace("---DIAGNOSTICO_LISTO---", "")
                      .trim()
                      .split("\n")
                      .map((line, i, arr) => (
                        <span key={i}>
                          {line}
                          {i < arr.length - 1 && <br />}
                        </span>
                      ))}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 rounded-2xl rounded-bl-md px-4 py-3 flex gap-1.5">
                    <span className="w-2 h-2 bg-muted rounded-full animate-bounce" />
                    <span
                      className="w-2 h-2 bg-muted rounded-full animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="w-2 h-2 bg-muted rounded-full animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </div>
              )}

              {/* Email CTA — appears after diagnosis is complete */}
              {diagnosisReady && !isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="pt-2 space-y-2"
                >
                  <a
                    href={buildMailtoLink()}
                    className="block w-full text-center py-3 px-4 bg-accent hover:bg-accent-light text-white text-sm font-medium rounded-xl transition-colors"
                  >
                    Enviar diagnóstico por correo
                  </a>
                  <p className="text-xs text-muted text-center">
                    Te respondemos con recomendaciones detalladas — sin compromiso
                  </p>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-white/5 shrink-0"
            >
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe aquí..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="px-4 py-2.5 bg-accent hover:bg-accent-light disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
