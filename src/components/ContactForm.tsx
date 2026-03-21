import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { Send, Loader2, CheckCircle2, MessageSquare } from "lucide-react";
import { useContent } from "@/hooks/useContent";
import { api } from "@/services/api";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid 10-digit phone number." }),
  email: z.string().email({ message: "Please enter a valid email address." }).optional().or(z.literal('')),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type FormValues = z.infer<typeof formSchema>;

const inputBase =
  "w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:bg-white focus:border-brand-green focus:ring-2 focus:ring-brand-green/20";

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return 'Mobile';
  if (/Tablet|iPad/i.test(ua)) return 'Tablet';
  return 'Desktop';
}

function getBrowserName() {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  return ua.substring(0, 50);
}

export function ContactForm() {
  const content = useContent();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true);
    setSubmitError('');

    // Collect client metadata
    const payload: Record<string, string> = {
      ...data,
      browser: getBrowserName(),
      device: getDeviceType(),
    };

    try {
      await api.post('/enquiries', payload);
      setSubmitSuccess(true);
      reset();
      setTimeout(() => setSubmitSuccess(false), 8000);
    } catch {
      setSubmitError('Failed to send. Please try calling us directly.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitSuccess) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10 flex flex-col items-center text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-brand-green-light flex items-center justify-center">
          <CheckCircle2 className="h-8 w-8 text-brand-green" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{content['form_success_title'] ?? 'Message Received!'}</h3>
        <p className="text-sm text-gray-500 max-w-xs">
          {content['form_success_text'] ?? 'Thank you for reaching out. Our team will get back to you shortly via phone or WhatsApp.'}
        </p>
        <button onClick={() => setSubmitSuccess(false)} className="mt-2 text-xs text-brand-green font-semibold hover:text-brand-green-dark transition-colors">
          {content['form_success_again'] ?? 'Send another message →'}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 border-b border-gray-100 px-4 sm:px-7 py-5">
        <div className="shrink-0 h-9 w-9 rounded-xl bg-brand-green-light flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-brand-green" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 text-sm leading-tight">{content['form_heading'] ?? 'Send an Inquiry'}</p>
          <p className="text-xs text-gray-500">{content['form_subtext'] ?? 'We typically respond within a few hours'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-7 space-y-5">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            {content['form_name_label'] ?? 'Full Name'} <span className="text-red-400">*</span>
          </label>
          <input
            {...register("name")}
            type="text"
            id="name"
            className={inputBase}
            placeholder={content['form_name_placeholder'] ?? 'e.g. Rahul Sharma'}
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            {content['form_phone_label'] ?? 'Phone Number'} <span className="text-red-400">*</span>
          </label>
          <input
            {...register("phone")}
            type="tel"
            id="phone"
            className={inputBase}
            placeholder={content['form_phone_placeholder'] ?? '+91 98765 43210'}
          />
          {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            {content['form_email_label'] ?? 'Email'} <span className="text-gray-300">(optional)</span>
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className={inputBase}
            placeholder={content['form_email_placeholder'] ?? 'your@email.com'}
          />
          {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="message" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
            {content['form_message_label'] ?? 'Message or Query'} <span className="text-red-400">*</span>
          </label>
          <textarea
            {...register("message")}
            id="message"
            rows={5}
            className={`${inputBase} resize-none`}
            placeholder={content['form_message_placeholder'] ?? 'I would like to know more about…'}
          />
          {errors.message && <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-green py-4 text-sm font-bold text-white shadow-lg shadow-brand-green/20 hover:bg-brand-green-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          {isSubmitting ? "Sending…" : (content['form_submit_label'] ?? 'Send Message')}
        </button>

        <p className="text-center text-xs text-gray-400">
          {content['form_consent_text'] ?? 'By submitting you agree to be contacted via phone or WhatsApp.'}
        </p>

        {submitError && (
          <p className="text-center text-xs text-red-500 font-medium">{submitError}</p>
        )}
      </form>
    </div>
  );
}
