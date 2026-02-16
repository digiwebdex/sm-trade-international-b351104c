import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react';

const underlineInput = 'bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-3 text-sm focus-visible:outline-none focus-visible:border-accent transition-colors placeholder:text-muted-foreground/50 w-full';

const ContactSection = () => {
  const { t, lang } = useLanguage();
  const { get } = useSiteSettings();
  const { toast } = useToast();

  const phone = get('contact', 'phone', '+88 01867666888');
  const email = get('contact', 'email', 'smtrade.int94@gmail.com');
  const address = get('contact', 'address', t('contact.addressValue'));
  const whatsapp = get('contact', 'whatsapp_number', '8801867666888');

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast({ title: lang === 'en' ? 'Please fill required fields' : 'প্রয়োজনীয় ক্ষেত্র পূরণ করুন', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from('contact_messages').insert({
        name: form.name.trim(), email: form.email.trim(),
        phone: form.phone.trim() || null, message: form.message.trim(),
      });
      if (error) throw error;
      toast({ title: lang === 'en' ? 'Message sent successfully!' : 'বার্তা সফলভাবে পাঠানো হয়েছে!' });
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      toast({ title: lang === 'en' ? 'Failed to send message' : 'বার্তা পাঠাতে ব্যর্থ', variant: 'destructive' });
    } finally { setSubmitting(false); }
  };

  const contactItems = [
    { icon: MapPin, label: t('contact.address'), value: address },
    { icon: Phone, label: lang === 'en' ? 'Phone' : 'ফোন', value: phone },
    { icon: Mail, label: lang === 'en' ? 'Email' : 'ইমেইল', value: email },
  ];

  return (
    <section id="contact" className="py-24 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {lang === 'en' ? 'Reach Out' : 'যোগাযোগ করুন'}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-5">{t('contact.title')}</h2>
          <div className="w-12 h-px bg-accent mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <input placeholder={t('contact.name') + ' *'} value={form.name} onChange={set('name')} className={underlineInput} required />
            <input type="email" placeholder={t('contact.email') + ' *'} value={form.email} onChange={set('email')} className={underlineInput} required />
            <input type="tel" placeholder={t('contact.phone')} value={form.phone} onChange={set('phone')} className={underlineInput} />
            <textarea placeholder={t('contact.message') + ' *'} value={form.message} onChange={set('message')} rows={4} className={underlineInput + ' resize-none'} required />
            <Button type="submit" disabled={submitting} className="w-full bg-foreground hover:bg-foreground/90 text-background gap-2 rounded-full">
              <Send className="h-4 w-4" />
              {submitting ? (lang === 'en' ? 'Sending...' : 'পাঠানো হচ্ছে...') : t('contact.send')}
            </Button>
          </form>

          {/* Info */}
          <div className="space-y-6">
            {contactItems.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3">
                <Icon className="h-4 w-4 text-muted-foreground mt-1 shrink-0" />
                <div>
                  <h4 className="font-medium text-sm mb-0.5" style={{ fontFamily: 'DM Sans, sans-serif' }}>{label}</h4>
                  <p className="text-muted-foreground text-sm">{value}</p>
                </div>
              </div>
            ))}

            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-border text-foreground px-5 py-2.5 rounded-full text-sm font-medium hover:border-accent hover:text-accent transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              {t('contact.whatsapp')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
