import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Section, SectionHeading } from '@/components/layout/Section'
import { useI18n } from '@/i18n'
import { buildWhatsAppLink } from '@/lib/whatsapp'
import { createContactMessage } from '@/lib/api/contactMessages'
import { fadeUp, viewportOnce } from '@/animations/variants'

const contactSchema = z.object({
  name: z.string().min(2),
  phone: z.string().regex(/^\+?[0-9\s()-]{9,17}$/),
  message: z.string().min(5),
})

type ContactForm = z.infer<typeof contactSchema>

export function Contact() {
  const { t } = useI18n()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactForm>({ resolver: zodResolver(contactSchema) })

  const onSubmit = (data: ContactForm) => {
    const text = `${data.name} (${data.phone}):\n${data.message}`
    window.open(buildWhatsAppLink(text), '_blank', 'noopener')
    // Fire-and-forget: persists the message alongside the WhatsApp deep
    // link, without blocking or delaying the redirect on failure.
    createContactMessage(data).catch((err) => {
      console.error('Failed to persist contact message:', err)
    })
  }

  return (
    <Section id="contact">
      <SectionHeading
        kicker={t('contact.kicker')}
        title={t('contact.title')}
        subtitle={t('contact.subtitle')}
      />

      <motion.form
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="glass-card mx-auto flex max-w-xl flex-col gap-5 p-8 md:p-10"
      >
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-xs font-semibold tracking-[0.2em] text-foreground uppercase"
          >
            {t('contact.name')}
          </label>
          <Input
            id="contact-name"
            placeholder={t('contact.name.placeholder')}
            className="h-12 rounded-xl border-border bg-background/50"
            {...register('name')}
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-warm">{t('contact.error.name')}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-phone"
            className="mb-2 block text-xs font-semibold tracking-[0.2em] text-foreground uppercase"
          >
            {t('contact.phone')}
          </label>
          <Input
            id="contact-phone"
            type="tel"
            placeholder={t('contact.phone.placeholder')}
            className="h-12 rounded-xl border-border bg-background/50"
            {...register('phone')}
          />
          {errors.phone && (
            <p className="mt-1.5 text-xs text-warm">
              {t('contact.error.phone')}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="mb-2 block text-xs font-semibold tracking-[0.2em] text-foreground uppercase"
          >
            {t('contact.message')}
          </label>
          <Textarea
            id="contact-message"
            rows={4}
            placeholder={t('contact.message.placeholder')}
            className="rounded-xl border-border bg-background/50"
            {...register('message')}
          />
          {errors.message && (
            <p className="mt-1.5 text-xs text-warm">
              {t('contact.error.message')}
            </p>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-2 h-13 rounded-full bg-primary text-base text-white shadow-md hover:bg-[#d05f08]"
        >
          <MessageCircle className="size-5" />
          {t('contact.submit')}
        </Button>
      </motion.form>
    </Section>
  )
}
