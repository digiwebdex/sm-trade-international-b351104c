import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { FileUp, X, Send, Sparkles, Copy, Check } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'application/pdf'];

const underlineInput = 'bg-transparent border-0 border-b border-border/50 rounded-none px-0 py-3 text-sm focus-visible:ring-0 focus-visible:border-accent transition-colors placeholder:text-muted-foreground/50';

const QuoteRequestForm = () => {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    company_name: '', contact_person: '', email: '', phone: '',
    product_interest: '', quantity: '', message: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [generatedQuote, setGeneratedQuote] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!ALLOWED_TYPES.includes(f.type)) { toast({ title: t('quote.fileTypeError'), variant: 'destructive' }); return; }
    if (f.size > MAX_FILE_SIZE) { toast({ title: t('quote.fileSizeError'), variant: 'destructive' }); return; }
    setFile(f);
  };

  const generateQuote = async () => {
    if (!form.company_name && !form.product_interest && !form.message) {
      toast({ title: lang === 'en' ? 'Please fill in some details first' : 'প্রথমে কিছু তথ্য দিন', variant: 'destructive' });
      return;
    }
    setGenerating(true);
    setGeneratedQuote('');
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ company_name: form.company_name, product_interest: form.product_interest, quantity: form.quantity, message: form.message }),
      });
      if (!resp.ok) { const err = await resp.json().catch(() => ({})); throw new Error(err.error || 'Failed'); }
      const reader = resp.body?.getReader();
      if (!reader) throw new Error('No stream');
      const decoder = new TextDecoder();
      let buffer = '', fullText = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, idx); buffer = buffer.slice(idx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try { const p = JSON.parse(jsonStr); const c = p.choices?.[0]?.delta?.content; if (c) { fullText += c; setGeneratedQuote(fullText); } }
          catch { buffer = line + '\n' + buffer; break; }
        }
      }
    } catch (err: any) {
      console.error(err);
      toast({ title: lang === 'en' ? 'Quote generation failed' : 'কোটেশন তৈরি ব্যর্থ', description: err.message, variant: 'destructive' });
    } finally { setGenerating(false); }
  };

  const copyQuote = async () => { await navigator.clipboard.writeText(generatedQuote); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.company_name || !form.contact_person || !form.email || !form.message) {
      toast({ title: t('quote.requiredError'), variant: 'destructive' }); return;
    }
    setSubmitting(true);
    try {
      let logo_url: string | null = null;
      if (file) {
        const ext = file.name.split('.').pop();
        const path = `logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('quote-attachments').upload(path, file);
        if (uploadErr) throw uploadErr;
        logo_url = path;
      }
      const { error } = await supabase.from('quote_requests').insert({
        company_name: form.company_name.trim(), contact_person: form.contact_person.trim(),
        email: form.email.trim(), phone: form.phone.trim() || null,
        product_interest: form.product_interest.trim() || null,
        quantity: form.quantity ? parseInt(form.quantity, 10) : null,
        message: form.message.trim(), logo_url,
      });
      if (error) throw error;
      toast({ title: t('quote.success') });
      setForm({ company_name: '', contact_person: '', email: '', phone: '', product_interest: '', quantity: '', message: '' });
      setFile(null); setGeneratedQuote('');
    } catch (err) { console.error(err); toast({ title: t('quote.error'), variant: 'destructive' }); }
    finally { setSubmitting(false); }
  };

  return (
    <section id="quote" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4 block" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {lang === 'en' ? 'Get Started' : 'শুরু করুন'}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold mb-5">{t('quote.title')}</h2>
          <div className="w-12 h-px bg-accent mx-auto mb-4" />
          <p className="text-muted-foreground max-w-2xl mx-auto">{t('quote.subtitle')}</p>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-10">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <input placeholder={t('quote.companyName') + ' *'} value={form.company_name} onChange={set('company_name')} className={underlineInput + ' w-full'} required />
              <input placeholder={t('quote.contactPerson') + ' *'} value={form.contact_person} onChange={set('contact_person')} className={underlineInput + ' w-full'} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <input type="email" placeholder={t('quote.email') + ' *'} value={form.email} onChange={set('email')} className={underlineInput + ' w-full'} required />
              <input type="tel" placeholder={t('quote.phone')} value={form.phone} onChange={set('phone')} className={underlineInput + ' w-full'} />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <input placeholder={t('quote.productInterest')} value={form.product_interest} onChange={set('product_interest')} className={underlineInput + ' w-full'} />
              <input type="number" min="1" placeholder={t('quote.quantity')} value={form.quantity} onChange={set('quantity')} className={underlineInput + ' w-full'} />
            </div>
            <textarea placeholder={t('quote.message') + ' *'} value={form.message} onChange={set('message')} rows={4} className={underlineInput + ' w-full resize-none'} required />

            <div className="space-y-2">
              <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.svg,.pdf" onChange={handleFile} className="hidden" />
              <button type="button" onClick={() => fileRef.current?.click()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <FileUp className="h-4 w-4" />
                {t('quote.uploadLogo')}
              </button>
              {file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="truncate max-w-[200px]">{file.name}</span>
                  <button type="button" onClick={() => setFile(null)}><X className="h-3 w-3" /></button>
                </div>
              )}
            </div>

            <div className="flex gap-3 flex-wrap pt-2">
              <Button type="submit" disabled={submitting} className="bg-foreground hover:bg-foreground/90 text-background gap-2 flex-1 min-w-[180px] rounded-full">
                <Send className="h-4 w-4" />
                {submitting ? t('quote.submitting') : t('quote.submit')}
              </Button>
              <Button type="button" variant="outline" disabled={generating} onClick={generateQuote} className="gap-2 border-accent text-accent hover:bg-accent/10 flex-1 min-w-[180px] rounded-full">
                <Sparkles className={`h-4 w-4 ${generating ? 'animate-spin' : ''}`} />
                {generating ? (lang === 'en' ? 'Generating...' : 'তৈরি হচ্ছে...') : (lang === 'en' ? 'AI Quote Estimate' : 'AI কোটেশন')}
              </Button>
            </div>
          </form>

          {/* AI Preview */}
          <div className="lg:col-span-2">
            <div className="sticky top-24 rounded-xl border border-border/40 bg-background overflow-hidden">
              <div className="px-5 py-3 border-b border-border/40 flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  <Sparkles className="h-4 w-4 text-accent" />
                  {lang === 'en' ? 'AI Quote Preview' : 'AI কোটেশন প্রিভিউ'}
                </span>
                {generatedQuote && (
                  <button onClick={copyQuote} className="text-muted-foreground hover:text-foreground transition-colors">
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </button>
                )}
              </div>
              <div className="p-5 min-h-[300px] max-h-[500px] overflow-y-auto">
                {generatedQuote ? (
                  <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{generatedQuote}</div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[260px] text-center text-muted-foreground">
                    <Sparkles className="h-8 w-8 mb-3 text-border" />
                    <p className="text-sm max-w-[200px]">
                      {lang === 'en' ? 'Fill in your requirements and click "AI Quote Estimate" to generate a quote.' : 'প্রয়োজনীয়তা পূরণ করুন এবং "AI কোটেশন" ক্লিক করুন।'}
                    </p>
                  </div>
                )}
                {generating && <span className="inline-block w-1.5 h-4 bg-accent animate-pulse ml-0.5" />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteRequestForm;
