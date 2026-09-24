import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, MessageCircle } from 'lucide-react'
import { useBusinessSettings } from '../../contexts/BusinessSettingsContext'

const faqData = [
  {
    question: 'What is available at Triveni Bhavan?',
    answer:
      'Triveni Bhavan offers spaces for celebrations and gatherings, including an Open Hall, Closed / Banquet Hall, guest rooms, and a traditional Mandir. The venue is designed to accommodate different types of family and social occasions.',
  },
  {
    question: 'How many rooms are available at Triveni Bhavan?',
    answer:
      'Triveni Bhavan has 18 rooms in total, including 14 AC rooms and 4 Non-AC rooms. There are also 14 rooms with attached toilets and 4 rooms without attached toilets.',
  },
  {
    question: 'Can I check the availability for my event date?',
    answer:
      'Yes. You can use the availability section on the website to check a date, or contact the Triveni Bhavan team directly for booking and availability-related information.',
  },
  {
    question: 'Can I visit Triveni Bhavan before making an enquiry?',
    answer:
      'Yes. If you would like to see the venue before making your decision, you can contact the Triveni Bhavan team through phone or WhatsApp and discuss a suitable time for a visit.',
  },
  {
    question: 'What types of occasions can be held at Triveni Bhavan?',
    answer:
      'The venue can be used for weddings, family functions, receptions, religious ceremonies, and other social gatherings. The available spaces can be discussed with the team according to your event requirements.',
  },
  {
    question: 'How can I enquire about a booking?',
    answer:
      'You can submit an enquiry through the website with your event details and preferred requirements. You can also contact Triveni Bhavan directly through the available phone or WhatsApp contact.',
  },
  {
    question: 'How can I contact Triveni Bhavan?',
    answer:
      'You can contact Triveni Bhavan through the phone number or WhatsApp number provided on the website. You can also use the enquiry form to share your event requirements with the team.',
  },
]

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-[#211B19]/10 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-center justify-between gap-5 py-5 text-left"
      >
        <span
          className={`font-heading text-[15px] font-medium transition-colors duration-300 sm:text-base ${
            isOpen
              ? 'text-[#8E6F35]'
              : 'text-[#211B19] group-hover:text-[#8E6F35]'
          }`}
        >
          {item.question}
        </span>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
            isOpen
              ? 'border-[#C6A15B] bg-[#C6A15B] text-white'
              : 'border-[#211B19]/10 bg-[#F7F3ED] text-[#8E6F35] group-hover:border-[#C6A15B]'
          }`}
        >
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown size={16} />
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden"
          >
            <p className="max-w-3xl pb-6 pr-10 text-sm leading-7 text-[#211B19]/60 sm:text-[15px]">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null)
  const { settings } = useBusinessSettings()

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const whatsappNumber = settings?.contact?.whatsapp || ''
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '')

  const whatsappHref = cleanWhatsApp
    ? `https://wa.me/${
        cleanWhatsApp.startsWith('91')
          ? cleanWhatsApp
          : `91${cleanWhatsApp}`
      }`
    : '#'

  const displayNumber =
    settings?.contact?.whatsapp ||
    settings?.contact?.phone ||
    '+91 9588923543'

  return (
    <section
      id="faq"
      className="relative overflow-hidden bg-[#F7F3ED] py-20 sm:py-24 lg:py-32"
    >
      {/* Subtle background detail */}
      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-[#C6A15B]/[0.06] blur-3xl" />
      <div className="pointer-events-none absolute -left-32 bottom-10 h-72 w-72 rounded-full bg-[#8E6F35]/[0.04] blur-3xl" />

      <div className="relative mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-20">
          {/* FAQ CONTENT */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-9 bg-[#C6A15B]" />

                <span className="text-[10px] font-medium uppercase tracking-[0.28em] text-[#A88745]">
                  Help Centre
                </span>
              </div>

              <h2 className="max-w-2xl font-heading text-3xl font-semibold tracking-tight text-[#211B19] sm:text-4xl lg:text-5xl">
                Everything you may want to know.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#211B19]/55 sm:text-[15px]">
                Find answers to common questions about Triveni Bhavan,
                available spaces, rooms, visits and enquiries.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-3xl border border-[#211B19]/[0.07] bg-white px-5 shadow-[0_20px_60px_rgba(33,27,25,0.05)] sm:px-8"
            >
              {faqData.map((item, index) => (
                <FAQItem
                  key={index}
                  item={item}
                  isOpen={openIndex === index}
                  onToggle={() => toggleFAQ(index)}
                />
              ))}
            </motion.div>
          </div>

          {/* WHATSAPP CARD */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[2rem] bg-[#211B19] p-7 shadow-[0_25px_70px_rgba(33,27,25,0.14)] sm:p-10">
              {/* Decorative circles */}
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border border-[#C6A15B]/20" />
              <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border border-[#C6A15B]/10" />

              <div className="relative">
                <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366]">
                  <MessageCircle size={27} strokeWidth={1.8} />
                </div>

                <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#C6A15B]">
                  Still have a question?
                </span>

                <h3 className="mt-4 font-heading text-2xl font-semibold leading-tight text-white sm:text-3xl">
                  Let’s talk about
                  <br />
                  your celebration.
                </h3>

                <p className="mt-5 max-w-md text-sm leading-7 text-white/55">
                  For availability, venue details or any specific requirement,
                  speak directly with the Triveni Bhavan team.
                </p>

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#20BA5C] hover:shadow-[0_12px_30px_rgba(37,211,102,0.2)]"
                >
                  <MessageCircle size={17} />
                  WhatsApp Us
                </a>

                <div className="mt-8 border-t border-white/10 pt-5">
                  <p className="text-xs text-white/35">
                    {displayNumber}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}