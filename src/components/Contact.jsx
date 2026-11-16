import { useState } from 'react';
import Reveal from './Reveal.jsx';
import {
    PHONE, PHONE_TEL, WHATSAPP, WHATSAPP_NUMBER, HOURS,
    INSTAGRAM, INSTAGRAM_URL,
    WHATSAPP_DIAG_URL, WHATSAPP_QUOTE_URL, WHATSAPP_LOCATION_URL,
    ADDRESS, MAPS_URL, MAPS_EMBED_SRC,
    SERVICE_OPTIONS,
} from '../data/content.js';

const INITIAL = { name: '', phone: '', service: '', message: '' };
const REQUIRED = ['name', 'phone', 'service'];

const maskPhone = (raw) => {
    let v = raw.replace(/\D/g, '').slice(0, 11);
    if (v.length > 10) return v.replace(/(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
    if (v.length > 6) return v.replace(/(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    if (v.length > 2) return v.replace(/(\d{2})(\d{0,5})/, '($1) $2');
    if (v.length > 0) return v.replace(/(\d*)/, '($1');
    return v;
};

export default function Contact() {
    const [form, setForm] = useState(INITIAL);
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState({ kind: '', message: '' });

    const update = (field) => (e) => {
        const value = field === 'phone' ? maskPhone(e.target.value) : e.target.value;
        setForm(prev => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: false }));
    };

    const validate = () => {
        const errs = {};
        REQUIRED.forEach(f => { if (!form[f].trim()) errs[f] = true; });
        return errs;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) {
            setErrors(errs);
            setStatus({ kind: 'error', message: 'Por favor, preencha os campos obrigatórios.' });
            return;
        }

        const msg = [
            '*Nova mensagem pelo site da GRB Assessoria Contábil*',
            '',
            `*Nome:* ${form.name}`,
            `*Telefone/WhatsApp:* ${form.phone}`,
            `*Assunto:* ${form.service}`,
            '',
            `*Mensagem:* ${form.message || '(sem mensagem adicional)'}`,
        ].join('\n');

        setStatus({ kind: 'success', message: 'Mensagem preparada. Você será direcionado ao WhatsApp.' });

        setTimeout(() => {
            window.open(
                `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
                '_blank',
                'noopener'
            );
            setForm(INITIAL);
            setErrors({});
            setStatus({ kind: '', message: '' });
        }, 1000);
    };

    const fieldClass = (name) => (errors[name] ? 'is-invalid' : '');

    return (
        <section className="section contact-section" id="contato">
            <div className="container">

                {/* Header */}
                <Reveal>
                    <header className="section__header section__header--center">
                        <span className="eyebrow">Entre em contato</span>
                        <h2 className="section__title">Fale conosco pelo WhatsApp</h2>
                        <p className="section__lead">
                            Escolha o canal de sua preferência. Nossa equipe responde prontamente.
                        </p>
                    </header>
                </Reveal>

                {/* Quick CTA Cards — WhatsApp + Instagram */}
                <Reveal>
                    <div className="contact-quick-cards">

                        {/* WhatsApp Card — Diagnóstico */}
                        <a
                            href={WHATSAPP_DIAG_URL}
                            className="quick-card quick-card--whatsapp"
                            target="_blank"
                            rel="noopener noreferrer"
                            id="contact-diag-whatsapp"
                        >
                            <div className="quick-card__icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </div>
                            <div className="quick-card__body">
                                <strong>Diagnóstico gratuito</strong>
                                <span>Solicite pelo WhatsApp</span>
                                <span className="quick-card__number">{WHATSAPP}</span>
                            </div>
                            <span className="quick-card__arrow">→</span>
                        </a>

                        {/* WhatsApp Card — Proposta */}
                        <a
                            href={WHATSAPP_QUOTE_URL}
                            className="quick-card quick-card--whatsapp-alt"
                            target="_blank"
                            rel="noopener noreferrer"
                            id="contact-quote-whatsapp"
                        >
                            <div className="quick-card__icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                            </div>
                            <div className="quick-card__body">
                                <strong>Solicitar proposta</strong>
                                <span>Resposta em até 24 horas</span>
                                <span className="quick-card__number">{WHATSAPP}</span>
                            </div>
                            <span className="quick-card__arrow">→</span>
                        </a>

                        {/* Instagram Card */}
                        <a
                            href={INSTAGRAM_URL}
                            className="quick-card quick-card--instagram"
                            target="_blank"
                            rel="noopener noreferrer"
                            id="contact-instagram"
                        >
                            <div className="quick-card__icon">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="3" />
                                </svg>
                            </div>
                            <div className="quick-card__body">
                                <strong>Instagram</strong>
                                <span>Conteúdos e novidades sobre contabilidade</span>
                                <span className="quick-card__number">{INSTAGRAM}</span>
                            </div>
                            <span className="quick-card__arrow">→</span>
                        </a>
                    </div>
                </Reveal>

                {/* Main Grid: Form + Map */}
                <div className="contact-main-grid">

                    {/* Left: Form */}
                    <Reveal>
                        <div className="contact-form-card">
                            <div className="contact-form-card__header">
                                <div className="contact-form-card__icon">
                                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3>Envie sua mensagem pelo WhatsApp</h3>
                                    <p>Preencha os campos e você será direcionado ao WhatsApp</p>
                                </div>
                            </div>
                            <form className="form form--premium" onSubmit={onSubmit} noValidate>
                                <div className="form__row">
                                    <div className="form__group">
                                        <label htmlFor="name">Nome completo *</label>
                                        <input
                                            id="name" type="text" autoComplete="name"
                                            placeholder="Digite o seu nome"
                                            value={form.name} onChange={update('name')}
                                            className={fieldClass('name')}
                                        />
                                    </div>
                                    <div className="form__group">
                                        <label htmlFor="phone">WhatsApp / Telefone *</label>
                                        <input
                                            id="phone" type="tel" autoComplete="tel"
                                            placeholder="(00) 00000-0000"
                                            value={form.phone} onChange={update('phone')}
                                            className={fieldClass('phone')}
                                        />
                                    </div>
                                </div>
                                <div className="form__group">
                                    <label htmlFor="service">Assunto *</label>
                                    <select
                                        id="service"
                                        value={form.service} onChange={update('service')}
                                        className={fieldClass('service')}
                                    >
                                        <option value="">Selecione uma opção</option>
                                        {SERVICE_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                </div>
                                <div className="form__group">
                                    <label htmlFor="message">Mensagem <span style={{ color: 'var(--gray-400)', fontWeight: 400 }}>(opcional)</span></label>
                                    <textarea
                                        id="message" rows="4"
                                        placeholder="Descreva brevemente a sua empresa e a sua necessidade."
                                        value={form.message} onChange={update('message')}
                                    />
                                </div>
                                <button type="submit" className="btn btn--whatsapp btn--full btn--lg" id="form-submit-whatsapp">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Enviar mensagem pelo WhatsApp
                                </button>
                                <p className="form__legal">
                                    Os dados informados seguem diretamente para o nosso WhatsApp.
                                </p>
                                {status.message && (
                                    <p
                                        className={`form__status ${status.kind === 'success' ? 'is-success' : 'is-error'}`}
                                        role="status" aria-live="polite"
                                    >
                                        {status.message}
                                    </p>
                                )}
                            </form>
                        </div>
                    </Reveal>

                    {/* Right: Map + Info */}
                    <Reveal>
                        <div className="contact-right">

                            {/* Google Maps */}
                            <div className="contact-map-card">
                                <div className="contact-map-card__header">
                                    <div className="contact-map-card__icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                            <circle cx="12" cy="10" r="3" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4>Nossa localização</h4>
                                        <p>{ADDRESS}</p>
                                    </div>
                                </div>
                                <div className="contact-map-embed">
                                    <iframe
                                        src={MAPS_EMBED_SRC}
                                        width="100%"
                                        height="260"
                                        style={{ border: 0 }}
                                        allowFullScreen=""
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                        title="Localização GRB Assessoria Contábil"
                                    />
                                </div>
                                <a
                                    href={MAPS_URL}
                                    className="contact-map-link"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                                        <circle cx="12" cy="10" r="3" />
                                    </svg>
                                    Abrir no Google Maps
                                </a>
                            </div>

                            {/* Info rápida */}
                            <div className="contact-info-card">
                                <div className="contact-info-row">
                                    <div className="contact-info-row__icon contact-info-row__icon--green">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <strong>WhatsApp</strong>
                                        <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">{WHATSAPP}</a>
                                    </div>
                                </div>

                                <div className="contact-info-row">
                                    <div className="contact-info-row__icon contact-info-row__icon--phone">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <strong>Telefone</strong>
                                        <a href={`tel:${PHONE_TEL}`}>{PHONE}</a>
                                    </div>
                                </div>

                                <div className="contact-info-row">
                                    <div className="contact-info-row__icon contact-info-row__icon--instagram">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="3" />
                                        </svg>
                                    </div>
                                    <div>
                                        <strong>Instagram</strong>
                                        <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">{INSTAGRAM}</a>
                                    </div>
                                </div>

                                <div className="contact-info-row">
                                    <div className="contact-info-row__icon contact-info-row__icon--clock">
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <polyline points="12 6 12 12 16 14" />
                                        </svg>
                                    </div>
                                    <div>
                                        <strong>Horário</strong>
                                        <span>{HOURS}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Reveal>
                </div>

            </div>
        </section>
    );
}
