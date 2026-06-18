'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Check, Clock, Mail, MapPin, Phone, Send } from 'lucide-react';
import { useTranslations } from '@/app/lib/i18n/locale-context';
import { useLocalizedPath } from '@/app/lib/i18n/use-localized-path';

const WAVE_PATH =
  'M0 28C180 8 360 48 540 28S900 8 1080 28 1260 48 1440 28V56H0V28Z';

const CHANNEL_ICONS = {
  email: Mail,
  phone: Phone,
  hours: Clock,
  location: MapPin,
} as const;

function ContactWave({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 1440 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d={WAVE_PATH} fill="currentColor" />
      </svg>
    </div>
  );
}

export default function ContactContent() {
  const t = useTranslations();
  const { lp } = useLocalizedPath();
  const c = t.contactPage;
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="contact-page" data-nav-theme="light">
      <section className="contact-page__hero">
        <div className="contact-page__hero-bg" aria-hidden>
          <Image
            src="/hero-back.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="contact-page__hero-photo"
          />
          <div className="contact-page__hero-shade" />
          <div className="contact-page__hero-vignette" />
          <div className="contact-page__hero-grain" />
        </div>

        <div className="container">
          <div className="contact-page__hero-grid">
            <div className="contact-page__hero-copy">
              <p className="hero-eyebrow">
                <span className="hero-eyebrow-line" aria-hidden />
                {c.heroEyebrow}
              </p>
              <h1 className="hero-title">
                {c.heroTitleLine1}
                <br />
                <em>{c.heroTitleEmphasis}</em>
              </h1>
              <p className="hero-lead contact-page__hero-lead">{c.heroLead}</p>
            </div>

            <div className="contact-page__hero-aside" aria-hidden>
              <div className="contact-page__hero-rings" />
              <div className="contact-page__hero-frame">
                <Image
                  src="/IMG_1776.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 900px) 80vw, 360px"
                  className="contact-page__hero-frame-img"
                />
              </div>
              <div className="hero-float-card contact-page__hero-float">
                <p className="hero-float-card__eyebrow">{t.common.brandName}</p>
                <p className="hero-float-card__title">
                  <em>{t.nav.tagline}</em>
                </p>
              </div>
            </div>
          </div>
        </div>

        <ContactWave className="contact-page__hero-wave" />
      </section>

      <section className="contact-page__reach">
        <div className="container">
          <ul className="contact-page__reach-grid">
            {c.channels.map((channel) => {
              const Icon = CHANNEL_ICONS[channel.id as keyof typeof CHANNEL_ICONS] ?? Mail;
              return (
                <li key={channel.id} className="contact-page__reach-card">
                  <span className="contact-page__reach-icon" aria-hidden>
                    <Icon size={17} strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="contact-page__reach-label">{channel.label}</p>
                    <p className="contact-page__reach-value">{channel.value}</p>
                    <p className="contact-page__reach-hint">{channel.hint}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="contact-page__studio">
        <div className="container">
          <div className="contact-page__studio-shell">
            <div className="contact-page__studio-intro">
              <p className="contact-page__eyebrow">
                <span className="contact-page__eyebrow-line" aria-hidden />
                {c.formEyebrow}
              </p>
              <h2 className="contact-page__studio-title">{c.formTitle}</h2>
              <p className="contact-page__studio-lead">{c.formLead}</p>
            </div>

            {submitted ? (
              <div className="contact-page__success" role="status">
                <span className="contact-page__success-icon" aria-hidden>
                  <Check size={22} strokeWidth={1.5} />
                </span>
                <p className="contact-page__success-title">{c.mockSuccessTitle}</p>
                <p className="contact-page__success-body">{c.mockSuccessBody}</p>
                <button
                  type="button"
                  className="btn btn-outline contact-page__success-btn"
                  onClick={() => setSubmitted(false)}
                >
                  {c.submit}
                </button>
              </div>
            ) : (
              <form
                className="contact-page__form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div className="contact-page__form-row">
                  <div className="contact-page__field">
                    <label htmlFor="contact-name" className="contact-page__label">
                      {c.nameLabel}
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder={c.namePlaceholder}
                      className="contact-page__input"
                    />
                  </div>
                  <div className="contact-page__field">
                    <label htmlFor="contact-email" className="contact-page__label">
                      {c.emailLabel}
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder={c.emailPlaceholder}
                      className="contact-page__input"
                    />
                  </div>
                </div>

                <div className="contact-page__field">
                  <label htmlFor="contact-subject" className="contact-page__label">
                    {c.subjectLabel}
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    defaultValue=""
                    className="contact-page__input contact-page__select"
                  >
                    <option value="" disabled>
                      {c.subjectPlaceholder}
                    </option>
                    {c.subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="contact-page__field">
                  <label htmlFor="contact-message" className="contact-page__label">
                    {c.messageLabel}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={6}
                    placeholder={c.messagePlaceholder}
                    className="contact-page__input contact-page__textarea"
                  />
                </div>

                <div className="contact-page__form-foot">
                  <button type="submit" className="btn btn-primary contact-page__submit">
                    <span>{c.submit}</span>
                    <Send size={15} strokeWidth={2} aria-hidden />
                  </button>
                  <p className="contact-page__mock-note">{c.mockBadge}</p>
                </div>
              </form>
            )}
          </div>
        </div>

        <ContactWave className="contact-page__studio-wave" />
      </section>

      <section id="faq" className="contact-page__faq">
        <div className="container">
          <div className="contact-page__faq-head">
            <p className="contact-page__eyebrow contact-page__eyebrow--center">
              <span className="contact-page__eyebrow-line" aria-hidden />
              {c.faqEyebrow}
            </p>
            <h2 className="contact-page__studio-title contact-page__studio-title--center">
              {c.faqTitle}
            </h2>
          </div>

          <div className="contact-page__faq-list">
            {c.faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="contact-page__faq-item"
                open={index === 0}
              >
                <summary className="contact-page__faq-summary">{faq.question}</summary>
                <p className="contact-page__faq-answer">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="contact-page__cta" data-nav-theme="dark">
        <div className="contact-page__cta-glow" aria-hidden />
        <div className="container contact-page__cta-inner">
          <p className="contact-page__eyebrow contact-page__eyebrow--center contact-page__eyebrow--light">
            <span className="contact-page__eyebrow-line contact-page__eyebrow-line--light" aria-hidden />
            {c.infoEyebrow}
          </p>
          <h2 className="contact-page__cta-title">{c.infoTitle}</h2>
          <Link href={lp('/shop')} className="btn btn-primary contact-page__cta-btn">
            {c.shopCta}
            <ArrowUpRight size={16} strokeWidth={2} aria-hidden />
          </Link>
        </div>
        <ContactWave className="contact-page__cta-wave" />
      </section>
    </div>
  );
}
